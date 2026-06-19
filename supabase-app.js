// Perfect Day v0.18 Supabase auth, profile, leaderboard, and past-games pages
const SUPABASE_URL = "https://naphnmpmujupkfpkuhhu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcGhubXBtdWp1cGtmcGt1aGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MjQ2MjksImV4cCI6MjA5NzQwMDYyOX0.voAllZifeoMqMGvCJaeIyE1XX2lt6KNElPkXXfJ5_OA";

let supabaseClient = null;
let loggedInUser = null;
let currentProfile = null;
let lastSavedGameSignature = null;

function $(id) { return document.getElementById(id); }
function pageName() { return document.body?.dataset?.page || "game"; }

function applyTheme(theme) {
  const finalTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = finalTheme;
  localStorage.setItem("perfectDayTheme", finalTheme);
  const btn = $("themeToggle");
  if (btn) btn.textContent = finalTheme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("perfectDayTheme") || "light";
  applyTheme(saved);
  $("themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function calculateLevel(totalXp) {
  let xp = Math.max(0, Number(totalXp) || 0);
  let level = 1;
  let needed = 100;
  while (xp >= needed && level < 999) {
    xp -= needed;
    level += 1;
    needed = Math.round(100 * Math.pow(level, 1.5));
  }
  const progress = needed ? Math.round((xp / needed) * 100) : 0;
  return { level, totalXp: Math.max(0, Number(totalXp) || 0), currentXp: Math.round(xp), needed, progress };
}

function numericFromPick(item) {
  const match = String(item?.value || "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function scoreToXp(score) {
  return Math.max(0, Number(score) || 0);
}

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

  // Do not await Supabase/database calls directly inside onAuthStateChange.
  // Supabase can hang if the callback awaits another Supabase request while auth is resolving.
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    loggedInUser = session?.user || null;
    currentProfile = null;
    setTimeout(() => {
      refreshNav().catch(error => console.warn("Nav refresh failed:", error.message));
    }, 0);
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
      20000,
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

let leaderboardExpanded = false;
let cachedLeaderboardRows = [];
let cachedLeaderboardMode = "All Modes";

function buildLeaderboardRows(rows, selectedMode = "All Modes") {
  const filtered = selectedMode === "All Modes" ? rows : rows.filter(row => (row.mode || "Everyday") === selectedMode);
  const users = new Map();

  for (const row of filtered) {
    const userId = row.user_id || row.profiles?.username || "unknown";
    const existing = users.get(userId) || {
      user_id: userId,
      username: row.profiles?.username || "Unknown Player",
      bestScore: 0,
      bestTier: "Score",
      bestDate: row.created_at,
      games: 0,
      totalXp: 0,
      modes: new Set()
    };

    existing.games += 1;
    existing.totalXp += scoreToXp(row.score);
    existing.modes.add(row.mode || "Everyday");
    if ((row.score || 0) > existing.bestScore) {
      existing.bestScore = row.score || 0;
      existing.bestTier = row.score_tier || "Score";
      existing.bestDate = row.created_at;
    }
    users.set(userId, existing);
  }

  return [...users.values()]
    .map(user => ({ ...user, levelInfo: calculateLevel(user.totalXp) }))
    .sort((a, b) => b.bestScore - a.bestScore || b.totalXp - a.totalXp || a.username.localeCompare(b.username));
}

function renderLeaderboard() {
  const list = $("leaderboardList");
  const moreBtn = $("viewMoreLeaderboardBtn");
  if (!list) return;

  const rows = buildLeaderboardRows(cachedLeaderboardRows, cachedLeaderboardMode);
  if (!rows.length) {
    list.textContent = "No scores yet for this mode. Finish a game while logged in.";
    if (moreBtn) moreBtn.classList.add("hidden");
    return;
  }

  const myIndex = loggedInUser ? rows.findIndex(row => row.user_id === loggedInUser.id) : -1;
  const visible = leaderboardExpanded ? rows : rows.slice(0, 20);
  const showMeBelow = !leaderboardExpanded && myIndex >= 20;
  const displayRows = showMeBelow ? [...visible, { spacer: true }, rows[myIndex]] : visible;

  list.innerHTML = displayRows.map((row, index) => {
    if (row.spacer) return `<div class="leaderboard-spacer">...</div>`;
    const realRank = rows.findIndex(r => r.user_id === row.user_id) + 1;
    const isMe = loggedInUser && row.user_id === loggedInUser.id;
    return `
      <div class="data-row leaderboard-row ${isMe ? "is-me" : ""}">
        <div class="data-rank">#${realRank}</div>
        <div>
          <div class="data-main">${row.username} <span class="level-pill">Lv. ${row.levelInfo.level}</span></div>
          <div class="data-sub">${cachedLeaderboardMode} · ${row.bestTier} · ${row.games} game${row.games === 1 ? "" : "s"} · ${row.levelInfo.totalXp} XP</div>
        </div>
        <div class="data-score">${row.bestScore}/100</div>
      </div>
    `;
  }).join("");

  if (moreBtn) {
    moreBtn.classList.toggle("hidden", rows.length <= 20);
    moreBtn.textContent = leaderboardExpanded ? "Show Top 20" : "View More";
  }
}

async function loadLeaderboard() {
  const list = $("leaderboardList");
  if (!list || !supabaseClient) return;

  const modeSelect = $("leaderboardMode");
  const moreBtn = $("viewMoreLeaderboardBtn");
  cachedLeaderboardMode = modeSelect?.value || "All Modes";
  leaderboardExpanded = false;

  modeSelect?.addEventListener("change", () => {
    cachedLeaderboardMode = modeSelect.value;
    leaderboardExpanded = false;
    renderLeaderboard();
  });
  moreBtn?.addEventListener("click", () => {
    leaderboardExpanded = !leaderboardExpanded;
    renderLeaderboard();
  });

  list.innerHTML = "Loading leaderboard...";
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("user_id, score, mode, score_tier, created_at, profiles(username)")
    .eq("completed", true)
    .order("score", { ascending: false })
    .limit(1000);

  if (error) {
    list.textContent = error.message;
    return;
  }

  cachedLeaderboardRows = data || [];
  renderLeaderboard();
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

function getAchievementDefinitions(scores) {
  const games = scores || [];
  const totalXp = games.reduce((sum, g) => sum + scoreToXp(g.score), 0);
  const modes = new Set(games.map(g => g.mode || "Everyday"));
  const hasScore = n => games.some(g => (g.score || 0) >= n);
  const hasNoRespins = games.some(g => (g.respins_used || 0) === 0);
  const allPicks = games.flatMap(g => Object.values(g.game_data || {}));
  const tempValues = allPicks.filter(p => String(p?.value || "").includes("°F")).map(numericFromPick).filter(v => v !== null);
  const windValues = allPicks.filter(p => String(p?.value || "").includes("mph")).map(numericFromPick).filter(v => v !== null);
  const skyTexts = allPicks.map(p => String(p?.value || "").toLowerCase());
  const pressureValues = allPicks.filter(p => String(p?.value || "").includes("hPa")).map(numericFromPick).filter(v => v !== null);

  return [
    { icon: "🎮", title: "First Spin", description: "Complete your first logged-in game.", unlocked: games.length >= 1 },
    { icon: "💯", title: "Perfect Day", description: "Score a 100.", unlocked: hasScore(100) },
    { icon: "🔥", title: "Elite Builder", description: "Score 90 or higher.", unlocked: hasScore(90) },
    { icon: "🌤️", title: "Great Forecast", description: "Score 80 or higher.", unlocked: hasScore(80) },
    { icon: "🎯", title: "No-Respin Run", description: "Finish a game without using either respin.", unlocked: hasNoRespins },
    { icon: "🧭", title: "Mode Explorer", description: "Complete games in at least 3 modes.", unlocked: modes.size >= 3 },
    { icon: "🏖️", title: "Beach Regular", description: "Complete a Beach Day game.", unlocked: modes.has("Beach Day") },
    { icon: "🏈", title: "Tailgate Tested", description: "Complete a Tailgate game.", unlocked: modes.has("Tailgate") },
    { icon: "⛳", title: "Fairway Weather", description: "Complete a Golf Day game.", unlocked: modes.has("Golf Day") },
    { icon: "❄️", title: "Snow Day Starter", description: "Complete a Snow Day game.", unlocked: modes.has("Snow Day") },
    { icon: "⛈️", title: "Storm Lover", description: "Complete a Storm Lover game.", unlocked: modes.has("Storm Lover") },
    { icon: "🌡️", title: "Heat Lover", description: "Draft a temperature of 95°F or hotter.", unlocked: tempValues.some(v => v >= 95) },
    { icon: "🧊", title: "Cold Snap", description: "Draft a temperature of 32°F or colder.", unlocked: tempValues.some(v => v <= 32) },
    { icon: "💨", title: "Wind Warrior", description: "Draft wind of 25 mph or stronger.", unlocked: windValues.some(v => v >= 25) },
    { icon: "☀️", title: "Clear Skies", description: "Draft a clear or sunny sky cover.", unlocked: skyTexts.some(t => t.includes("clear") || t.includes("sunny")) },
    { icon: "📈", title: "Pressure Peak", description: "Draft pressure of 1025 hPa or higher.", unlocked: pressureValues.some(v => v >= 1025) },
    { icon: "🔁", title: "Regular", description: "Complete 10 games.", unlocked: games.length >= 10 },
    { icon: "🏅", title: "Veteran", description: "Complete 25 games.", unlocked: games.length >= 25 },
    { icon: "👑", title: "Weather Legend", description: "Reach 10,000 lifetime XP.", unlocked: totalXp >= 10000 }
  ];
}

async function getUserScores() {
  if (!loggedInUser || !supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("score, mode, score_tier, created_at, game_data, respins_used")
    .eq("user_id", loggedInUser.id)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    console.warn("Score load failed:", error.message);
    return [];
  }
  return data || [];
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
  const scores = await getUserScores();

  const gamesPlayed = scores.length;
  const bestScore = gamesPlayed ? Math.max(...scores.map(s => s.score || 0)) : 0;
  const avgScore = gamesPlayed ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / gamesPlayed) : 0;
  const totalXp = scores.reduce((sum, s) => sum + scoreToXp(s.score), 0);
  const levelInfo = calculateLevel(totalXp);
  const achievements = getAchievementDefinitions(scores);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  box.innerHTML = `
    <div class="profile-card-inner">
      <div>
        <p class="eyebrow">Signed in as</p>
        <h2>${username} <span class="level-pill big">Lv. ${levelInfo.level}</span></h2>
        <p class="account-subtitle">${loggedInUser.email}</p>
      </div>
      <div class="xp-card">
        <div class="xp-top"><strong>${levelInfo.totalXp} XP</strong><span>${levelInfo.currentXp}/${levelInfo.needed} XP to Level ${levelInfo.level + 1}</span></div>
        <div class="xp-bar"><span style="width:${levelInfo.progress}%"></span></div>
      </div>
      <div class="profile-stats">
        <div><strong>${gamesPlayed}</strong><span>Games</span></div>
        <div><strong>${bestScore}</strong><span>Best</span></div>
        <div><strong>${avgScore}</strong><span>Avg</span></div>
        <div><strong>${unlockedCount}/${achievements.length}</strong><span>Badges</span></div>
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

async function loadAchievements() {
  const summary = $("achievementSummary");
  const list = $("achievementsList");
  if (!summary || !list) return;

  if (!loggedInUser) {
    summary.innerHTML = `<div class="empty-state">Log in to view achievements.<br/><a href="/login.html" class="inline-link">Log in</a></div>`;
    list.innerHTML = "";
    return;
  }

  const scores = await getUserScores();
  const achievements = getAchievementDefinitions(scores);
  const unlocked = achievements.filter(a => a.unlocked).length;
  const totalXp = scores.reduce((sum, s) => sum + scoreToXp(s.score), 0);
  const levelInfo = calculateLevel(totalXp);

  summary.innerHTML = `<strong>${unlocked}/${achievements.length}</strong> achievements unlocked · Level ${levelInfo.level} · ${levelInfo.totalXp} XP`;
  list.innerHTML = achievements.map(a => `
    <article class="achievement-card ${a.unlocked ? "unlocked" : "locked"}">
      <div class="achievement-icon">${a.icon}</div>
      <div>
        <h3>${a.title}</h3>
        <p>${a.description}</p>
      </div>
      <span class="achievement-state">${a.unlocked ? "Unlocked" : "Locked"}</span>
    </article>
  `).join("");
}

async function routePageLoad() {
  const page = pageName();
  if (page === "leaderboard") await loadLeaderboard();
  if (page === "past-games") await loadPastGames();
  if (page === "profile") await loadProfile();
  if (page === "achievements") await loadAchievements();
}

function bindPageButtons() {
  $("signupForm")?.addEventListener("submit", (event) => { event.preventDefault(); signUpWithEmail(); });
  $("loginForm")?.addEventListener("submit", (event) => { event.preventDefault(); loginWithEmail(); });
  $("logoutBtn")?.addEventListener("click", logout);
}

initTheme();
bindPageButtons();
initSupabase();
