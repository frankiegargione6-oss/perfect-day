// Perfect Day v0.21 Supabase auth, profiles, friends, head-to-head, leaderboard, daily challenge
const SUPABASE_URL = "https://naphnmpmujupkfpkuhhu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcGhubXBtdWp1cGtmcGt1aGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MjQ2MjksImV4cCI6MjA5NzQwMDYyOX0.voAllZifeoMqMGvCJaeIyE1XX2lt6KNElPkXXfJ5_OA";

let supabaseClient = null;
let loggedInUser = null;
let currentProfile = null;
let lastSavedGameSignature = null;

function $(id) { return document.getElementById(id); }
function pageName() { return document.body?.dataset?.page || "game"; }
function isDailyChallengePage() { return pageName() === "daily-challenge"; }
function todayKey(date = new Date()) { return date.toLocaleDateString("en-CA"); }
function startOfTodayISO() { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString(); }
function startOfTomorrowISO() { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+1); return d.toISOString(); }
function urlParam(name) { return new URLSearchParams(window.location.search).get(name); }
function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = String(value || '');
  return div.innerHTML;
}
function profileLink(id, username) { return `<a class="inline-link" href="/public-profile.html?id=${encodeURIComponent(id)}">${escapeHtml(username || 'Player')}</a>`; }

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
  if (!supabaseClient || !loggedInUser) {
    if (isDailyChallengePage()) alert("Log in before playing the Daily Challenge so your one attempt can be saved.");
    return;
  }
  if (typeof slots === "undefined" || typeof build === "undefined") return;
  if (!slots.every(slot => build[slot])) return;

  const signature = getGameSignature();
  if (lastSavedGameSignature === signature) return;

  const mode = isDailyChallengePage() ? "Daily Challenge" : els.mode.value;

  if (mode === "Daily Challenge") {
    const existing = await getTodaysDailyScore();
    if (existing) {
      alert("You already completed today's Daily Challenge. Your first completed score is locked in.");
      lockDailyGame(existing);
      return;
    }
  }

  const score = calculateEverydayScore();
  const respinsUsed = (regionRespinUsed ? 1 : 0) + (cityRespinUsed ? 1 : 0);

  const payload = {
    user_id: loggedInUser.id,
    score: score.total,
    mode,
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

  await saveH2HResult(score, build);
  await saveGroupResult(score, build);
  await saveTeamResult(score, build);

  lastSavedGameSignature = signature;
  if (mode === "Daily Challenge") {
    await loadDailyChallenge();
  }
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
      bestGameId: row.id,
      bestGameData: row.game_data,
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
      existing.bestGameId = row.id;
      existing.bestGameData = row.game_data;
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
          <div class="data-main">${profileLink(row.user_id, row.username)} <span class="level-pill">Lv. ${row.levelInfo.level}</span></div>
          <div class="data-sub">${cachedLeaderboardMode} · ${row.bestTier} · ${row.games} game${row.games === 1 ? "" : "s"} · ${row.levelInfo.totalXp} XP</div>
        </div>
        <div class="row-actions"><div class="data-score">${row.bestScore}/100</div><button class="mini secondary" data-view-game-card="${row.user_id}">View Card</button></div>
      </div>
    `;
  }).join("");

  list.querySelectorAll("[data-view-game-card]").forEach(btn => btn.addEventListener("click", () => {
    const row = rows.find(r => r.user_id === btn.dataset.viewGameCard);
    showGameCardModal(row?.username || "Player", row?.bestScore || 0, row?.bestTier || "Completed", row?.mode || cachedLeaderboardMode, row?.bestGameData || {});
  }));

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
    .select("id, user_id, score, mode, score_tier, created_at, game_data, profiles(username)")
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
    { icon: "🏖️", title: "Beach Regular", description: "Complete a Beach game.", unlocked: modes.has("Beach") || modes.has("Beach Day") },
    { icon: "🏈", title: "Tailgate Tested", description: "Complete a Tailgate game.", unlocked: modes.has("Tailgate") },
    { icon: "⛳", title: "Fairway Weather", description: "Complete a Golf game.", unlocked: modes.has("Golf") || modes.has("Golf Day") },
    { icon: "❄️", title: "Winter Starter", description: "Complete a Winter game.", unlocked: modes.has("Winter") || modes.has("Snow Day") },
    { icon: "⛈️", title: "Severe Setup", description: "Complete a Severe Weather game.", unlocked: modes.has("Severe Weather") || modes.has("Storm Lover") },
    { icon: "☀️", title: "Summer Scorcher", description: "Complete a Summer game.", unlocked: modes.has("Summer") },
    { icon: "💀", title: "Worst Day Builder", description: "Complete a Worst Day game.", unlocked: modes.has("Worst Day") },
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

async function getFriendRows() {
  if (!loggedInUser || !supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from("friendships")
    .select("friend_id, created_at, friend:profiles!friendships_friend_id_fkey(id, username)")
    .eq("user_id", loggedInUser.id)
    .order("created_at", { ascending: false });
  if (error) { console.warn("Friend load failed:", error.message); return []; }
  return data || [];
}
async function getFriendIdSet() { const rows = await getFriendRows(); return new Set(rows.map(row => row.friend_id)); }
async function searchPlayers(event) {
  event?.preventDefault();
  const results = $("friendSearchResults");
  if (!results) return;
  if (!loggedInUser) { results.innerHTML = `<div class="empty-state">Log in to search for friends.</div>`; return; }
  const q = cleanUsername($("friendSearchInput")?.value || "");
  if (!q) return setStatus("Enter a username to search.", "error");
  results.innerHTML = "Searching...";
  const friendIds = await getFriendIdSet();
  const { data, error } = await supabaseClient.from("profiles").select("id, username").ilike("username", `%${q}%`).limit(12);
  if (error) { results.textContent = error.message; return; }
  const rows = (data || []).filter(p => p.id !== loggedInUser.id);
  if (!rows.length) { results.innerHTML = `<div class="empty-state">No players found.</div>`; return; }
  results.innerHTML = rows.map(player => {
    const alreadyFriends = friendIds.has(player.id);
    return `<div class="data-row social-row"><div class="data-rank">👤</div><div><div class="data-main">${profileLink(player.id, player.username)}</div><div class="data-sub">${alreadyFriends ? "Already friends" : "Send a friend request"}</div></div><button class="mini ${alreadyFriends ? "secondary" : ""}" data-add-friend="${player.id}" ${alreadyFriends ? "disabled" : ""}>${alreadyFriends ? "Friends" : "Add"}</button></div>`;
  }).join("");
  results.querySelectorAll("[data-add-friend]").forEach(btn => btn.addEventListener("click", () => sendFriendRequest(btn.dataset.addFriend)));
}
async function sendFriendRequest(receiverId) {
  if (!loggedInUser) return setStatus("Log in first.", "error");
  if (!receiverId || receiverId === loggedInUser.id) return setStatus("Pick another player.", "error");
  setStatus("Sending request...", "info");
  const { error } = await supabaseClient.from("friend_requests").insert({ requester_id: loggedInUser.id, receiver_id: receiverId, status: "pending" });
  if (error) return setStatus(error.message.includes("duplicate") ? "Friend request already sent." : error.message, "error");
  setStatus("Friend request sent.", "success");
  await loadFriendsPage();
}
async function acceptFriendRequest(requestId, requesterId) {
  if (!loggedInUser) return;
  setStatus("Accepting request...", "info");
  const { error: updateError } = await supabaseClient.from("friend_requests").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", requestId);
  if (updateError) return setStatus(updateError.message, "error");
  const { error: insertError } = await supabaseClient.from("friendships").upsert([{ user_id: loggedInUser.id, friend_id: requesterId }, { user_id: requesterId, friend_id: loggedInUser.id }], { onConflict: "user_id,friend_id" });
  if (insertError) return setStatus(insertError.message, "error");
  setStatus("Friend request accepted.", "success");
  await loadFriendsPage();
}
async function declineFriendRequest(requestId) {
  if (!loggedInUser) return;
  const { error } = await supabaseClient.from("friend_requests").update({ status: "declined", updated_at: new Date().toISOString() }).eq("id", requestId);
  if (error) return setStatus(error.message, "error");
  await loadFriendsPage();
}
async function loadFriendRequests() {
  const list = $("friendRequestsList");
  if (!list) return;
  if (!loggedInUser) { list.innerHTML = `<div class="empty-state">Log in to manage friend requests.</div>`; return; }
  const { data, error } = await supabaseClient.from("friend_requests").select("id, requester_id, receiver_id, status, created_at, requester:profiles!friend_requests_requester_id_fkey(id, username), receiver:profiles!friend_requests_receiver_id_fkey(id, username)").or(`requester_id.eq.${loggedInUser.id},receiver_id.eq.${loggedInUser.id}`).eq("status", "pending").order("created_at", { ascending: false });
  if (error) { list.textContent = error.message; return; }
  if (!data || !data.length) { list.innerHTML = `<div class="empty-state">No pending requests.</div>`; return; }
  list.innerHTML = data.map(req => {
    const incoming = req.receiver_id === loggedInUser.id;
    const other = incoming ? req.requester : req.receiver;
    return `<div class="data-row social-row"><div class="data-rank">${incoming ? "📩" : "📤"}</div><div><div class="data-main">${profileLink(other?.id, other?.username)}</div><div class="data-sub">${incoming ? "Wants to be friends" : "Request sent"}</div></div><div class="row-actions">${incoming ? `<button class="mini" data-accept-request="${req.id}" data-requester="${req.requester_id}">Accept</button><button class="mini secondary" data-decline-request="${req.id}">Deny</button>` : `<span class="badge small-badge">Pending</span>`}</div></div>`;
  }).join("");
  list.querySelectorAll("[data-accept-request]").forEach(btn => btn.addEventListener("click", () => acceptFriendRequest(btn.dataset.acceptRequest, btn.dataset.requester)));
  list.querySelectorAll("[data-decline-request]").forEach(btn => btn.addEventListener("click", () => declineFriendRequest(btn.dataset.declineRequest)));
}
async function loadFriendsList(targetId = null, containerId = "friendsList") {
  const list = $(containerId);
  if (!list || !supabaseClient) return [];
  const userId = targetId || loggedInUser?.id;
  if (!userId) { list.innerHTML = `<div class="empty-state">Log in to view friends.</div>`; return []; }
  const { data, error } = await supabaseClient.from("friendships").select("friend_id, created_at, friend:profiles!friendships_friend_id_fkey(id, username)").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) { list.textContent = error.message; return []; }
  if (!data || !data.length) { list.innerHTML = `<div class="empty-state">No friends yet.</div>`; return []; }
  list.innerHTML = data.map(row => `<div class="data-row social-row"><div class="data-rank">🤝</div><div><div class="data-main">${profileLink(row.friend?.id, row.friend?.username)}</div><div class="data-sub">Friend since ${new Date(row.created_at).toLocaleDateString()}</div></div><a class="nav-button" href="/head-to-head.html">Challenge</a></div>`).join("");
  return data;
}
async function loadFriendsPage() { $("friendSearchForm")?.addEventListener("submit", searchPlayers); await loadFriendRequests(); await loadFriendsList(); }
async function renderProfileFriendsPreview() { const el = $("profileFriendsList"); if (!el) return; await loadFriendsList(loggedInUser?.id, "profileFriendsList"); }
async function loadPublicProfile() {
  const box = $("publicProfileContent");
  if (!box || !supabaseClient) return;
  const playerId = urlParam("id");
  if (!playerId) { box.innerHTML = `<div class="empty-state">No player selected.</div>`; return; }
  const { data: profile, error } = await supabaseClient.from("profiles").select("id, username, created_at").eq("id", playerId).maybeSingle();
  if (error || !profile) { box.innerHTML = `<div class="empty-state">Player not found.</div>`; return; }
  const { data: scores } = await supabaseClient.from("game_scores").select("score, mode, score_tier, created_at").eq("user_id", playerId).eq("completed", true).limit(1000);
  const games = scores || [];
  const bestScore = games.length ? Math.max(...games.map(s => s.score || 0)) : 0;
  const avgScore = games.length ? Math.round(games.reduce((sum, s) => sum + (s.score || 0), 0) / games.length) : 0;
  const totalXp = games.reduce((sum, s) => sum + scoreToXp(s.score), 0);
  const levelInfo = calculateLevel(totalXp);
  const friendIds = loggedInUser ? await getFriendIdSet() : new Set();
  const isMe = loggedInUser?.id === playerId;
  const overallH2H = loggedInUser ? await getH2HStats(playerId) : { wins: 0, losses: 0, ties: 0 };
  const vsStats = loggedInUser && !isMe ? await getH2HStats(loggedInUser.id, playerId) : null;
  const vsBlock = vsStats ? `<div class="social-section compact"><p class="eyebrow">Head-to-Head vs ${escapeHtml(profile.username)}</p><h2>${vsStats.wins}-${vsStats.losses}${vsStats.ties ? `-${vsStats.ties}` : ""}</h2><p class="account-subtitle">Your record against this player</p></div>` : "";
  const friendButton = isMe ? `<a class="nav-button" href="/profile.html">Your Profile</a>` : (loggedInUser ? `<button id="publicAddFriendBtn" type="button" ${friendIds.has(playerId) ? "disabled" : ""}>${friendIds.has(playerId) ? "Already Friends" : "Add Friend"}</button>` : `<a class="nav-button primary" href="/login.html">Log in to add friend</a>`);
  box.innerHTML = `<div class="profile-card-inner"><div><p class="eyebrow">Player Profile</p><h2>${escapeHtml(profile.username)} <span class="level-pill big">Lv. ${levelInfo.level}</span></h2><p class="account-subtitle">${totalXp} XP · Joined ${new Date(profile.created_at).toLocaleDateString()}</p></div><div class="profile-stats"><div><strong>${games.length}</strong><span>Games</span></div><div><strong>${bestScore}</strong><span>Best</span></div><div><strong>${avgScore}</strong><span>Avg</span></div><div><strong>${overallH2H.wins}-${overallH2H.losses}${overallH2H.ties ? `-${overallH2H.ties}` : ""}</strong><span>H2H</span></div></div><div>${friendButton}</div>${vsBlock}<div class="social-section"><div class="page-heading-row"><div><p class="eyebrow">Friends</p><h2>Friend List</h2></div></div><div id="publicFriendsList" class="data-list">Loading friends...</div></div></div>`;
  $("publicAddFriendBtn")?.addEventListener("click", () => sendFriendRequest(playerId));
  await loadFriendsList(playerId, "publicFriendsList");
}
async function populateH2HFriendSelect() {
  const select = $("h2hFriendSelect");
  if (!select) return;
  const rows = await getFriendRows();
  if (!rows.length) { select.innerHTML = `<option value="">Add friends first</option>`; return; }
  select.innerHTML = `<option value="">Choose friend</option>` + rows.map(row => `<option value="${row.friend_id}">${escapeHtml(row.friend?.username || "Friend")}</option>`).join("");
}
async function createH2HMatch(event) {
  event?.preventDefault();
  if (!loggedInUser) return setStatus("Log in first.", "error");
  const opponentId = $("h2hFriendSelect")?.value;
  const mode = $("h2hModeSelect")?.value || "Everyday";
  if (!opponentId) return setStatus("Choose a friend to challenge.", "error");
  const { error } = await supabaseClient.from("h2h_matches").insert({ challenger_id: loggedInUser.id, opponent_id: opponentId, mode, status: "pending" });
  if (error) return setStatus(error.message, "error");
  setStatus("Challenge sent.", "success");
  await loadH2HMatches();
}
async function acceptH2H(matchId) { const { error } = await supabaseClient.from("h2h_matches").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", matchId); if (error) return setStatus(error.message, "error"); await loadH2HMatches(); }
async function declineH2H(matchId) { const { error } = await supabaseClient.from("h2h_matches").update({ status: "declined", updated_at: new Date().toISOString() }).eq("id", matchId); if (error) return setStatus(error.message, "error"); await loadH2HMatches(); }
function h2hWinnerText(match) { if (match.status !== "completed") return match.status; if (match.winner_id === loggedInUser?.id) return "You won"; if (!match.winner_id) return "Tie"; return "You lost"; }
function h2hResultClass(match) {
  if (match.status !== "completed") return "";
  if (!match.winner_id) return "h2h-tie";
  return match.winner_id === loggedInUser?.id ? "h2h-win" : "h2h-loss";
}
async function getH2HStats(userId = loggedInUser?.id, opponentId = null) {
  if (!userId || !supabaseClient) return { wins: 0, losses: 0, ties: 0, played: 0 };
  const { data, error } = await supabaseClient
    .from("h2h_matches")
    .select("challenger_id, opponent_id, winner_id, status")
    .eq("status", "completed")
    .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
    .limit(1000);
  if (error) {
    console.warn("H2H stats failed:", error.message);
    return { wins: 0, losses: 0, ties: 0, played: 0 };
  }
  const rows = (data || []).filter(row => {
    if (!opponentId) return true;
    return (row.challenger_id === userId && row.opponent_id === opponentId) || (row.opponent_id === userId && row.challenger_id === opponentId);
  });
  let wins = 0, losses = 0, ties = 0;
  rows.forEach(row => {
    if (!row.winner_id) ties += 1;
    else if (row.winner_id === userId) wins += 1;
    else losses += 1;
  });
  return { wins, losses, ties, played: rows.length };
}
async function loadH2HMatches() {
  const list = $("h2hMatchesList");
  if (!list) return;
  if (!loggedInUser) { list.innerHTML = `<div class="empty-state">Log in to view head-to-head matches.</div>`; return; }
  const { data, error } = await supabaseClient.from("h2h_matches").select("*, challenger:profiles!h2h_matches_challenger_id_fkey(id, username), opponent:profiles!h2h_matches_opponent_id_fkey(id, username)").or(`challenger_id.eq.${loggedInUser.id},opponent_id.eq.${loggedInUser.id}`).order("created_at", { ascending: false }).limit(50);
  if (error) { list.textContent = error.message; return; }
  if (!data || !data.length) { list.innerHTML = `<div class="empty-state">No matches yet. Challenge a friend above.</div>`; return; }
  list.innerHTML = data.map(match => {
    const amChallenger = match.challenger_id === loggedInUser.id;
    const other = amChallenger ? match.opponent : match.challenger;
    const myScore = amChallenger ? match.challenger_score : match.opponent_score;
    const theirScore = amChallenger ? match.opponent_score : match.challenger_score;
    const canAccept = !amChallenger && match.status === "pending";
    const canPlay = match.status === "accepted" && (myScore === null || myScore === undefined);
    const playUrl = `/?h2h=${match.id}&mode=${encodeURIComponent(match.mode || "Everyday")}`;
    return `<div class="data-row social-row h2h-row ${h2hResultClass(match)}"><div class="data-rank">⚔️</div><div><div class="data-main">vs ${profileLink(other?.id, other?.username)}</div><div class="data-sub">${match.mode || "Everyday"} · ${h2hWinnerText(match)} · You: ${myScore ?? "—"} · Them: ${theirScore ?? "—"}</div></div><div class="row-actions">${canAccept ? `<button class="mini" data-accept-h2h="${match.id}">Accept</button><button class="mini secondary" data-decline-h2h="${match.id}">Deny</button>` : ""}${canPlay ? `<a class="nav-button primary" href="${playUrl}">Play</a>` : ""}<a class="nav-button" href="/match-details.html?h2h=${match.id}">View Match</a>${match.status === "pending" && amChallenger ? `<span class="badge small-badge">Waiting</span>` : ""}</div></div>`;
  }).join("");
  list.querySelectorAll("[data-accept-h2h]").forEach(btn => btn.addEventListener("click", () => acceptH2H(btn.dataset.acceptH2h)));
  list.querySelectorAll("[data-decline-h2h]").forEach(btn => btn.addEventListener("click", () => declineH2H(btn.dataset.declineH2h)));
}
async function loadH2HPage() { $("h2hCreateForm")?.addEventListener("submit", createH2HMatch); await populateH2HFriendSelect(); await loadH2HMatches(); }
async function setupHeadToHeadGame() {
  if (pageName() !== "game") return;
  const matchId = urlParam("h2h");
  const groupId = urlParam("group");
  const teamId = urlParam("team");
  if (!matchId && !groupId && !teamId) return;
  const mode = urlParam("mode") || "Everyday";
  if ($("mode")) { $("mode").value = mode; $("mode").disabled = true; }
  if (typeof els !== "undefined" && els.modeBadge) els.modeBadge.textContent = mode;
  const heroSub = document.querySelector(".subtitle");
  if (heroSub) heroSub.textContent = matchId ? "Head-to-Head match: finish one run and your score will be saved to the match." : (groupId ? "Group Play match: finish one run and your score will be saved to the group." : "Team Mode match: finish one run and your score will be saved to your team.");
  if (!loggedInUser) alert("Log in before playing multiplayer so your score can save.");
}
async function saveH2HResult(score, gameData) {
  const matchId = urlParam("h2h");
  if (!matchId || !loggedInUser || !supabaseClient) return;
  const { data: match, error } = await supabaseClient.from("h2h_matches").select("*").eq("id", matchId).maybeSingle();
  if (error || !match) { alert("Head-to-head match not found."); return; }
  const amChallenger = match.challenger_id === loggedInUser.id;
  const amOpponent = match.opponent_id === loggedInUser.id;
  if (!amChallenger && !amOpponent) { alert("You are not in this match."); return; }
  const update = { updated_at: new Date().toISOString() };
  if (amChallenger) { update.challenger_score = score.total; update.challenger_game_data = gameData; }
  if (amOpponent) { update.opponent_score = score.total; update.opponent_game_data = gameData; }
  const finalChallenger = amChallenger ? score.total : match.challenger_score;
  const finalOpponent = amOpponent ? score.total : match.opponent_score;
  if (finalChallenger !== null && finalChallenger !== undefined && finalOpponent !== null && finalOpponent !== undefined) { update.status = "completed"; update.winner_id = finalChallenger === finalOpponent ? null : (finalChallenger > finalOpponent ? match.challenger_id : match.opponent_id); } else { update.status = "accepted"; }
  const { error: updateError } = await supabaseClient.from("h2h_matches").update(update).eq("id", matchId);
  if (updateError) alert(`Head-to-head score did not save: ${updateError.message}`);
}


function renderSmallGameCard(title, score, tier, mode, gameData) {
  const picks = Object.entries(gameData || {}).map(([slot, item]) => `
    <div class="past-pick">
      <span>${escapeHtml(item?.icon || "🌤️")} ${escapeHtml(slot)}</span>
      <strong>${escapeHtml(item?.value || "—")}</strong>
      <em>${escapeHtml(item?.city || "")}</em>
    </div>
  `).join("") || `<div class="empty-state">No card saved yet.</div>`;
  return `<article class="past-game-card match-card"><div class="past-game-top"><div><div class="data-main">${escapeHtml(title)}</div><div class="data-sub">${escapeHtml(mode || "Everyday")} · ${escapeHtml(tier || "Completed")}</div></div><div class="data-score">${score ?? "—"}/100</div></div><div class="past-pick-grid">${picks}</div></article>`;
}

function showGameCardModal(username, score, tier, mode, gameData) {
  let overlay = document.getElementById("gameCardModal");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "gameCardModal";
    overlay.className = "modal-overlay";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal-content"><div class="modal-top"><div><p class="small">Leaderboard Card</p><h2>${escapeHtml(username)}'s Game</h2></div><button id="closeGameCardModal" class="secondary mini">Close</button></div>${renderSmallGameCard(username, score, tier, mode, gameData)}</div>`;
  overlay.classList.remove("hidden-modal");
  document.getElementById("closeGameCardModal")?.addEventListener("click", () => overlay.classList.add("hidden-modal"));
}

async function loadMatchDetails() {
  const box = $("matchDetailsContent");
  if (!box || !supabaseClient) return;
  const h2hId = urlParam("h2h");
  if (!h2hId) { box.innerHTML = `<div class="empty-state">No match selected.</div>`; return; }
  const { data: match, error } = await supabaseClient
    .from("h2h_matches")
    .select("*, challenger:profiles!h2h_matches_challenger_id_fkey(id, username), opponent:profiles!h2h_matches_opponent_id_fkey(id, username)")
    .eq("id", h2hId)
    .maybeSingle();
  if (error || !match) { box.textContent = error?.message || "Match not found."; return; }
  const winner = !match.winner_id ? (match.status === "completed" ? "Tie" : match.status) : (match.winner_id === match.challenger_id ? `${match.challenger?.username} won` : `${match.opponent?.username} won`);
  box.innerHTML = `<div class="match-summary"><p class="eyebrow">${escapeHtml(match.mode || "Everyday")}</p><h2>${escapeHtml(winner)}</h2><p class="account-subtitle">${escapeHtml(match.challenger?.username || "Player")} ${match.challenger_score ?? "—"} vs ${match.opponent_score ?? "—"} ${escapeHtml(match.opponent?.username || "Player")}</p></div><div class="match-card-grid">${renderSmallGameCard(match.challenger?.username || "Challenger", match.challenger_score, "Head-to-Head", match.mode, match.challenger_game_data)}${renderSmallGameCard(match.opponent?.username || "Opponent", match.opponent_score, "Head-to-Head", match.mode, match.opponent_game_data)}</div>`;
}

async function renderFriendCheckboxes(containerId, prefix = "player") {
  const box = $(containerId);
  if (!box) return [];
  const rows = await getFriendRows();
  if (!rows.length) { box.innerHTML = `<div class="empty-state">Add friends first.</div>`; return []; }
  box.innerHTML = rows.map(row => `<label class="check-card"><input type="checkbox" value="${row.friend_id}" data-${prefix}-friend="true"/> <span>${escapeHtml(row.friend?.username || "Friend")}</span></label>`).join("");
  return rows;
}

function checkedValues(containerId) {
  return [...(document.getElementById(containerId)?.querySelectorAll('input[type="checkbox"]:checked') || [])].map(i => i.value);
}

async function loadGroupPage() {
  $("groupCreateForm")?.addEventListener("submit", createGroupMatch);
  await renderFriendCheckboxes("groupFriendChecks", "group");
  await loadGroupMatches();
}

async function createGroupMatch(event) {
  event?.preventDefault();
  if (!loggedInUser) return setStatus("Log in first.", "error");
  const friendIds = checkedValues("groupFriendChecks");
  if (!friendIds.length) return setStatus("Select at least one friend.", "error");
  const mode = $("groupModeSelect")?.value || "Everyday";
  const { data: match, error } = await supabaseClient.from("group_matches").insert({ creator_id: loggedInUser.id, mode, status: "active" }).select().single();
  if (error) return setStatus(error.message, "error");
  const players = [loggedInUser.id, ...friendIds].map(user_id => ({ match_id: match.id, user_id }));
  const { error: playerError } = await supabaseClient.from("group_match_players").insert(players);
  if (playerError) return setStatus(playerError.message, "error");
  setStatus("Group match created.", "success");
  await loadGroupMatches();
}

async function loadGroupMatches() {
  const list = $("groupMatchesList");
  if (!list) return;
  if (!loggedInUser) { list.innerHTML = `<div class="empty-state">Log in to view group matches.</div>`; return; }
  const { data, error } = await supabaseClient.from("group_match_players").select("score, game_data, group_matches(id, mode, status, winner_id, created_at)").eq("user_id", loggedInUser.id).order("created_at", { referencedTable: "group_matches", ascending: false }).limit(50);
  if (error) { list.textContent = error.message; return; }
  if (!data?.length) { list.innerHTML = `<div class="empty-state">No group matches yet.</div>`; return; }
  list.innerHTML = data.map(row => { const m=row.group_matches; const canPlay=row.score===null||row.score===undefined; return `<div class="data-row social-row"><div class="data-rank">👥</div><div><div class="data-main">${escapeHtml(m.mode || "Everyday")} Group Match</div><div class="data-sub">${escapeHtml(m.status || "active")} · Your score: ${row.score ?? "—"}</div></div><div class="row-actions">${canPlay ? `<a class="nav-button primary" href="/?group=${m.id}&mode=${encodeURIComponent(m.mode || "Everyday")}">Play</a>` : ""}<a class="nav-button" href="/match-details.html?group=${m.id}">View Match</a></div></div>`; }).join("");
}

async function saveGroupResult(score, gameData) {
  const matchId = urlParam("group");
  if (!matchId || !loggedInUser || !supabaseClient) return;
  const { error } = await supabaseClient.from("group_match_players").update({ score: score.total, game_data: gameData, finished_at: new Date().toISOString() }).eq("match_id", matchId).eq("user_id", loggedInUser.id);
  if (error) return alert(`Group score did not save: ${error.message}`);
  const { data: players } = await supabaseClient.from("group_match_players").select("user_id, score").eq("match_id", matchId);
  const finished = (players || []).filter(p => p.score !== null && p.score !== undefined);
  if (players?.length && finished.length === players.length) {
    const best = [...finished].sort((a,b)=>(b.score||0)-(a.score||0))[0];
    await supabaseClient.from("group_matches").update({ status: "completed", winner_id: best.user_id, updated_at: new Date().toISOString() }).eq("id", matchId);
  }
}

async function loadTeamPage() {
  $("teamCreateForm")?.addEventListener("submit", createTeamMatch);
  await renderFriendCheckboxes("teamAFriendChecks", "team-a");
  await renderFriendCheckboxes("teamBFriendChecks", "team-b");
  await loadTeamMatches();
}

async function createTeamMatch(event) {
  event?.preventDefault();
  if (!loggedInUser) return setStatus("Log in first.", "error");
  const teamA = Array.from(new Set([loggedInUser.id, ...checkedValues("teamAFriendChecks")]));
  const teamB = checkedValues("teamBFriendChecks");
  if (!teamB.length) return setStatus("Select at least one player for Team B.", "error");
  if (teamB.some(id => teamA.includes(id))) return setStatus("A player cannot be on both teams.", "error");
  const mode = $("teamModeSelect")?.value || "Everyday";
  const { data: match, error } = await supabaseClient.from("team_matches").insert({ creator_id: loggedInUser.id, mode, status: "active" }).select().single();
  if (error) return setStatus(error.message, "error");
  const players = [...teamA.map(user_id => ({ match_id: match.id, user_id, team_name: "A" })), ...teamB.map(user_id => ({ match_id: match.id, user_id, team_name: "B" }))];
  const { error: playerError } = await supabaseClient.from("team_match_players").insert(players);
  if (playerError) return setStatus(playerError.message, "error");
  setStatus("Team match created.", "success");
  await loadTeamMatches();
}

async function loadTeamMatches() {
  const list = $("teamMatchesList");
  if (!list) return;
  if (!loggedInUser) { list.innerHTML = `<div class="empty-state">Log in to view team matches.</div>`; return; }
  const { data, error } = await supabaseClient.from("team_match_players").select("score, team_name, team_matches(id, mode, status, winning_team, created_at)").eq("user_id", loggedInUser.id).order("created_at", { referencedTable: "team_matches", ascending: false }).limit(50);
  if (error) { list.textContent = error.message; return; }
  if (!data?.length) { list.innerHTML = `<div class="empty-state">No team matches yet.</div>`; return; }
  list.innerHTML = data.map(row => { const m=row.team_matches; const canPlay=row.score===null||row.score===undefined; return `<div class="data-row social-row"><div class="data-rank">🛡️</div><div><div class="data-main">Team ${escapeHtml(row.team_name)} · ${escapeHtml(m.mode || "Everyday")}</div><div class="data-sub">${escapeHtml(m.status || "active")} · winner: ${escapeHtml(m.winning_team || "—")} · Your score: ${row.score ?? "—"}</div></div><div class="row-actions">${canPlay ? `<a class="nav-button primary" href="/?team=${m.id}&mode=${encodeURIComponent(m.mode || "Everyday")}">Play</a>` : ""}<a class="nav-button" href="/match-details.html?team=${m.id}">View Match</a></div></div>`; }).join("");
}

async function saveTeamResult(score, gameData) {
  const matchId = urlParam("team");
  if (!matchId || !loggedInUser || !supabaseClient) return;
  const { error } = await supabaseClient.from("team_match_players").update({ score: score.total, game_data: gameData, finished_at: new Date().toISOString() }).eq("match_id", matchId).eq("user_id", loggedInUser.id);
  if (error) return alert(`Team score did not save: ${error.message}`);
  const { data: players } = await supabaseClient.from("team_match_players").select("team_name, score").eq("match_id", matchId);
  const finished = (players || []).filter(p => p.score !== null && p.score !== undefined);
  if (players?.length && finished.length === players.length) {
    const teamA = finished.filter(p => p.team_name === "A");
    const teamB = finished.filter(p => p.team_name === "B");
    const avg = arr => arr.length ? arr.reduce((s,p)=>s+(p.score||0),0)/arr.length : 0;
    const a = avg(teamA), b = avg(teamB);
    await supabaseClient.from("team_matches").update({ status: "completed", team_a_score: Math.round(a), team_b_score: Math.round(b), winning_team: a === b ? "Tie" : (a > b ? "A" : "B"), updated_at: new Date().toISOString() }).eq("id", matchId);
  }
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
  const h2hStats = await getH2HStats(loggedInUser.id);

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
        <div><strong>${h2hStats.wins}-${h2hStats.losses}${h2hStats.ties ? `-${h2hStats.ties}` : ""}</strong><span>H2H</span></div>
      </div>
      <div class="profile-form">
        <label for="profileUsername">Username</label>
        <input id="profileUsername" type="text" value="${username}" />
        <button id="saveProfileUsernameBtn" type="button">Save Username</button>
        <button id="profileLogoutBtn" type="button" class="secondary">Log Out</button>
      </div>
      <div class="social-section">
        <div class="page-heading-row"><div><p class="eyebrow">Friends</p><h2>Your Friends</h2></div><a class="nav-button" href="/friends.html">Manage Friends</a></div>
        <div id="profileFriendsList" class="data-list">Loading friends...</div>
      </div>
    </div>
  `;

  $("saveProfileUsernameBtn")?.addEventListener("click", saveUsername);
  $("profileLogoutBtn")?.addEventListener("click", logout);
  await renderProfileFriendsPreview();
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


async function getTodaysDailyScore() {
  if (!loggedInUser || !supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("score, mode, score_tier, created_at, game_data")
    .eq("user_id", loggedInUser.id)
    .eq("mode", "Daily Challenge")
    .gte("created_at", startOfTodayISO())
    .lt("created_at", startOfTomorrowISO())
    .order("created_at", { ascending: true })
    .limit(1);
  if (error) {
    console.warn("Daily score lookup failed:", error.message);
    return null;
  }
  return data?.[0] || null;
}

function setDailyStatus(title, text) {
  const titleEl = $("dailyStatusTitle");
  const textEl = $("dailyStatusText");
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
}

function lockDailyGame(existing = null) {
  if (typeof els !== "undefined" && els.spinBtn) {
    els.spinBtn.disabled = true;
    els.spinBtn.textContent = "Completed";
  }
  if (typeof els !== "undefined" && els.respinRegionBtn) els.respinRegionBtn.disabled = true;
  if (typeof els !== "undefined" && els.respinCityBtn) els.respinCityBtn.disabled = true;
  if (typeof els !== "undefined" && els.spinResult) {
    els.spinResult.classList.remove("empty");
    els.spinResult.innerHTML = existing
      ? `<p><strong>Daily Challenge complete.</strong><br/>Your locked score today: ${existing.score}/100 — ${existing.score_tier || "Completed"}</p>`
      : `<p><strong>Log in to play the Daily Challenge.</strong><br/>Daily scores are locked to one attempt per account.</p>`;
  }
}

async function loadDailyScores() {
  const list = $("dailyScoresList");
  if (!list || !supabaseClient) return;
  list.innerHTML = "Loading today's scores...";
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("user_id, score, score_tier, created_at, profiles(username)")
    .eq("mode", "Daily Challenge")
    .gte("created_at", startOfTodayISO())
    .lt("created_at", startOfTomorrowISO())
    .order("score", { ascending: false })
    .limit(50);
  if (error) {
    list.textContent = error.message;
    return;
  }
  if (!data || data.length === 0) {
    list.innerHTML = `<div class="empty-state">No one has completed today's Daily Challenge yet.</div>`;
    return;
  }
  list.innerHTML = data.map((row, idx) => {
    const isMe = loggedInUser && row.user_id === loggedInUser.id;
    return `<div class="data-row leaderboard-row ${isMe ? "is-me" : ""}">
      <div class="data-rank">#${idx + 1}</div>
      <div>
        <div class="data-main">${profileLink(row.user_id, row.profiles?.username || "Unknown Player")}</div>
        <div class="data-sub">${row.score_tier || "Completed"} · ${new Date(row.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
      </div>
      <div class="data-score">${row.score}/100</div>
    </div>`;
  }).join("");
}

function calculateDailyStreak(rows) {
  const days = new Set((rows || []).map(r => new Date(r.created_at).toLocaleDateString("en-CA")));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toLocaleDateString("en-CA"))) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

async function loadDailyHistory() {
  const list = $("dailyHistoryList");
  if (!list || !supabaseClient) return;
  if (!loggedInUser) {
    list.innerHTML = `<div class="empty-state">Log in to see your Daily Challenge calendar.</div>`;
    return;
  }
  const { data, error } = await supabaseClient
    .from("game_scores")
    .select("score, score_tier, created_at")
    .eq("user_id", loggedInUser.id)
    .eq("mode", "Daily Challenge")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) {
    list.textContent = error.message;
    return;
  }
  const streak = calculateDailyStreak(data || []);
  if (!data || data.length === 0) {
    list.innerHTML = `<div class="empty-state">No Daily Challenges completed yet.</div>`;
    return;
  }
  list.innerHTML = `<div class="daily-streak-card"><strong>🔥 ${streak}</strong><span>day streak</span></div>` + data.map(row => `
    <div class="data-row">
      <div class="data-rank">📅</div>
      <div>
        <div class="data-main">${new Date(row.created_at).toLocaleDateString()}</div>
        <div class="data-sub">${row.score_tier || "Completed"}</div>
      </div>
      <div class="data-score">${row.score}/100</div>
    </div>
  `).join("");
}

async function loadDailyChallenge() {
  if (!isDailyChallengePage()) return;
  const historyToggle = $("dailyHistoryToggle");
  const historyPanel = $("dailyHistoryPanel");
  historyToggle?.addEventListener("click", async () => {
    historyPanel?.classList.toggle("hidden");
    await loadDailyHistory();
  });

  if (!loggedInUser) {
    setDailyStatus("Log in required", "Daily Challenge is one locked attempt per account. Log in or sign up first.");
    lockDailyGame(null);
    await loadDailyScores();
    return;
  }

  const existing = await getTodaysDailyScore();
  if (existing) {
    setDailyStatus("Completed", `Your score today is locked: ${existing.score}/100 — ${existing.score_tier || "Completed"}.`);
    lockDailyGame(existing);
  } else {
    setDailyStatus("Ready", `Today is ${todayKey()}. You have one completed attempt.`);
    if (typeof els !== "undefined" && els.spinBtn) {
      els.spinBtn.disabled = false;
      els.spinBtn.textContent = "Start Daily";
    }
  }
  await loadDailyScores();
  await loadDailyHistory();
}

async function routePageLoad() {
  const page = pageName();
  if (page === "leaderboard") await loadLeaderboard();
  if (page === "past-games") await loadPastGames();
  if (page === "profile") await loadProfile();
  if (page === "achievements") await loadAchievements();
  if (page === "daily-challenge") await loadDailyChallenge();
  if (page === "friends") await loadFriendsPage();
  if (page === "public-profile") await loadPublicProfile();
  if (page === "head-to-head") await loadH2HPage();
  if (page === "group-play") await loadGroupPage();
  if (page === "team-mode") await loadTeamPage();
  if (page === "match-details") await loadMatchDetails();
  if (page === "game") await setupHeadToHeadGame();
}

function bindPageButtons() {
  $("signupForm")?.addEventListener("submit", (event) => { event.preventDefault(); signUpWithEmail(); });
  $("loginForm")?.addEventListener("submit", (event) => { event.preventDefault(); loginWithEmail(); });
  $("logoutBtn")?.addEventListener("click", logout);
}

initTheme();
bindPageButtons();
initSupabase();
