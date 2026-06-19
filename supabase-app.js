// Perfect Day v0.18 Supabase auth, profile, leaderboard, and past-games pages
const SUPABASE_URL = "https://naphnmpmujupkfpkuhhu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcGhubXBtdWp1cGtmcGt1aGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MjQ2MjksImV4cCI6MjA5NzQwMDYyOX0.voAllZifeoMqMGvCJaeIyE1XX2lt6KNElPkXXfJ5_OA";

let supabaseClient = null;
let loggedInUser = null;
let currentProfile = null;
let lastSavedGameSignature = null;

function $(id) { return document.getElementById(id); }
function pageName() { return document.body?.dataset?.page || "game"; }

function cleanUsername(username) {
  return String(username || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-.]/g, "")
    .slice(0, 24);
}

function setStatus(message, kind = "info") {
  const el = $("pageStatus");
  if (!el) {
    if (message && kind === "error") alert(message);
    return;
  }
  el.textContent = message || "";
  el.className = `page-status ${kind}`;
}

function initSupabase() {
  if (!window.supabase) {
    console.warn("Supabase CDN did not load.");
    setStatus("Supabase did not load. Refresh and try again.", "error");
    return;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  supabaseClient.auth.getSession().then(async ({ data }) => {
    loggedInUser = data.session?.user || null;
    await refreshNav();
    await routePageLoad();
  });

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    loggedInUser = session?.user || null;
    currentProfile = null;
    await refreshNav();
  });
}

async function refreshNav() {
  const navGuest = $("navGuest");
  const navUser = $("navUser");
  const navUsername = $("navUsername");

  if (!navGuest || !navUser) return;

  if (!loggedInUser) {
    navGuest.classList.remove("hidden");
    navUser.classList.add("hidden");
    if (navUsername) navUsername.textContent = "Profile";
    return;
  }

  currentProfile = await getOrCreateProfile();
  const username = currentProfile?.username || loggedInUser.email?.split("@")[0] || "Player";
  navGuest.classList.add("hidden");
  navUser.classList.remove("hidden");
  if (navUsername) navUsername.textContent = username;
}

async function getOrCreateProfile(preferredUsername = "") {
  if (!loggedInUser || !supabaseClient) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", loggedInUser.id)
    .maybeSingle();

  if (data) return data;
  if (error) console.warn("Profile lookup failed:", error.message);

  const starterUsername = cleanUsername(preferredUsername || loggedInUser.email?.split("@")[0] || `player_${loggedInUser.id.slice(0, 6)}`);

  const { data: inserted, error: insertError } = await supabaseClient
    .from("profiles")
    .insert({ id: loggedInUser.id, username: starterUsername })
    .select()
    .single();

  if (insertError) {
    console.warn("Profile create failed:", insertError.message);
    return null;
  }

  return inserted;
}

async function signUpWithEmail() {
  const email = $("signupEmail")?.value.trim();
  const password = $("signupPassword")?.value || "";
  const username = cleanUsername($("signupUsername")?.value);

  if (!email || !password || !username) return setStatus("Enter email, password, and username.", "error");
  if (password.length < 6) return setStatus("Password must be at least 6 characters.", "error");

  setStatus("Creating account...", "info");
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return setStatus(error.message, "error");

  if (data.user) {
    loggedInUser = data.user;
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .upsert({ id: data.user.id, username }, { onConflict: "id" });

    if (profileError) return setStatus(`Account created, but username did not save: ${profileError.message}`, "error");

    await refreshNav();
    setStatus("Account created. Sending you to the game...", "success");
    setTimeout(() => window.location.href = "/", 700);
  }
}

function withTimeout(promise, ms = 12000, label = "Request timed out. Refresh and try again.") {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms))
  ]);
}

async function loginWithEmail() {
  const email = $("loginEmail")?.value.trim();
  const password = $("loginPassword")?.value || "";

  if (!email || !password) return setStatus("Enter email and password.", "error");
  if (!supabaseClient) return setStatus("Supabase did not load. Refresh and try again.", "error");

  setStatus("Logging in...", "info");

  try {
    const { data, error } = await withTimeout(
      supabaseClient.auth.signInWithPassword({ email, password }),
      12000,
      "Login timed out. Refresh and try again."
    );

    if (error) return setStatus(error.message, "error");
    if (!data?.session) return setStatus("Login did not return a session. Try signing up again or check email confirmation settings.", "error");

    loggedInUser = data.session.user;
    setStatus("Logged in. Sending you to the game...", "success");
    window.location.href = "/";
  } catch (error) {
    setStatus(error.message || "Login failed. Refresh and try again.", "error");
  }
}

async function logout() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  loggedInUser = null;
  currentProfile = null;
  await refreshNav();
  window.location.href = "/";
}

async function saveUsername() {
  if (!loggedInUser) return setStatus("Log in first.", "error");
  const username = cleanUsername($("profileUsername")?.value);
  if (!username) return setStatus("Enter a username.", "error");

  const { error } = await supabaseClient
    .from("profiles")
    .upsert({ id: loggedInUser.id, username }, { onConflict: "id" });

  if (error) return setStatus(error.message, "error");
  currentProfile = await getOrCreateProfile();
  await refreshNav();
  setStatus("Username saved.", "success");
}

function getGameSignature() {
  try { return JSON.stringify({ mode: els.mode.value, build }); }
  catch { return ""; }
}

async function saveCompletedGame() {
  if (!supabaseClient || !loggedInUser) return;
  if (typeof slots === "undefined" || typeof build === "undefined") return;
  if (!slots.every(slot => build[slot])) return;

  const signature = getGameSignature();
  if (lastSavedGameSignature === signature) return;

  const score = calculateEverydayScore();
  const respinsUsed = (regionRespinUsed ? 1 : 0) + (cityRespinUsed ? 1 : 0);

  const payload = {
    user_id: loggedInUser.id,
    score: score.total,
    mode: els.mode.value,
    score_tier: score.tier,
    game_data: build,
    guesses_used: slots.length,
    respins_used: respinsUsed,
    completed: true
  };

  const { error } = await supabaseClient.from("game_scores").insert(payload);

  if (error) {
    console.warn("Score save failed:", error.message);
    alert(`Game finished, but score did not save. ${error.message}`);
    return;
  }

  lastSavedGameSignature = signature;
}

async function loadLeaderboard() {
  const list = $("leaderboardList");
  if (!list || !supabaseClient) return;

  list.innerHTML = "Loading leaderboard...";
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("score, mode, score_tier, created_at, profiles(username)")
    .eq("completed", true)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    list.textContent = error.message;
    return;
  }

  if (!data || data.length === 0) {
    list.textContent = "No scores yet. Finish a game while logged in.";
    return;
  }

  list.innerHTML = data.map((row, index) => `
    <div class="data-row">
      <div class="data-rank">#${index + 1}</div>
      <div>
        <div class="data-main">${row.profiles?.username || "Unknown Player"}</div>
        <div class="data-sub">${row.mode || "Everyday"} · ${row.score_tier || "Score"} · ${new Date(row.created_at).toLocaleDateString()}</div>
      </div>
      <div class="data-score">${row.score}/100</div>
    </div>
  `).join("");
}

async function loadPastGames() {
  const list = $("pastGamesList");
  if (!list || !supabaseClient) return;

  if (!loggedInUser) {
    list.innerHTML = `<div class="empty-state">Log in to view your past games.<br/><a href="/login.html" class="inline-link">Log in</a></div>`;
    return;
  }

  list.innerHTML = "Loading past games...";
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("score, mode, score_tier, created_at, game_data")
    .eq("user_id", loggedInUser.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    list.textContent = error.message;
    return;
  }

  if (!data || data.length === 0) {
    list.textContent = "No past games yet. Finish a game while logged in.";
    return;
  }

  list.innerHTML = data.map(row => {
    const picks = Object.entries(row.game_data || {}).map(([slot, item]) => `
      <div class="past-pick">
        <span>${item.icon || "🌤️"} ${slot}</span>
        <strong>${item.value || "—"}</strong>
        <em>${item.city || ""}</em>
      </div>
    `).join("");

    return `
      <article class="past-game-card">
        <div class="past-game-top">
          <div>
            <div class="data-main">${row.mode || "Everyday"} — ${row.score_tier || "Completed"}</div>
            <div class="data-sub">${new Date(row.created_at).toLocaleString()}</div>
          </div>
          <div class="data-score">${row.score}/100</div>
        </div>
        <div class="past-pick-grid">${picks}</div>
      </article>
    `;
  }).join("");
}

async function loadProfile() {
  const box = $("profileContent");
  if (!box) return;

  if (!loggedInUser) {
    box.innerHTML = `<div class="empty-state">Log in to view your profile.<br/><a href="/login.html" class="inline-link">Log in</a></div>`;
    return;
  }

  currentProfile = await getOrCreateProfile();
  const username = currentProfile?.username || loggedInUser.email?.split("@")[0] || "Player";

  const { data: scores } = await supabaseClient
    .from("game_scores")
    .select("score")
    .eq("user_id", loggedInUser.id);

  const gamesPlayed = scores?.length || 0;
  const bestScore = gamesPlayed ? Math.max(...scores.map(s => s.score || 0)) : 0;
  const avgScore = gamesPlayed ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / gamesPlayed) : 0;

  box.innerHTML = `
    <div class="profile-card-inner">
      <div>
        <p class="eyebrow">Signed in as</p>
        <h2>${username}</h2>
        <p class="account-subtitle">${loggedInUser.email}</p>
      </div>
      <div class="profile-stats">
        <div><strong>${gamesPlayed}</strong><span>Games</span></div>
        <div><strong>${bestScore}</strong><span>Best</span></div>
        <div><strong>${avgScore}</strong><span>Avg</span></div>
      </div>
      <div class="profile-form">
        <label for="profileUsername">Username</label>
        <input id="profileUsername" type="text" value="${username}" />
        <button id="saveProfileUsernameBtn" type="button">Save Username</button>
        <button id="profileLogoutBtn" type="button" class="secondary">Log Out</button>
      </div>
    </div>
  `;

  $("saveProfileUsernameBtn")?.addEventListener("click", saveUsername);
  $("profileLogoutBtn")?.addEventListener("click", logout);
}

async function routePageLoad() {
  const page = pageName();
  if (page === "leaderboard") await loadLeaderboard();
  if (page === "past-games") await loadPastGames();
  if (page === "profile") await loadProfile();
}

function bindPageButtons() {
  $("signupForm")?.addEventListener("submit", (event) => { event.preventDefault(); signUpWithEmail(); });
  $("loginForm")?.addEventListener("submit", (event) => { event.preventDefault(); loginWithEmail(); });
  $("logoutBtn")?.addEventListener("click", logout);
}

bindPageButtons();
initSupabase();
