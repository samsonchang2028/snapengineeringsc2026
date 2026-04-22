/* ============================================================
   NBA HUB — scripts.js
   Structure:
     1. DATA          — your player + team arrays
     2. STATE         — app state (current page, selected player, etc.)
     3. ROUTER        — navigate() + showPage()
     4. SIDEBAR       — openSidebar() / closeSidebar()
     5. HOME PAGE     — renderFeaturedCard(), renderThumbnails()
     6. PLAYERS PAGE  — renderPlayerList(), filterPlayers(), renderPlayerDetail()
     7. TEAMS PAGE    — renderTeamLists(), renderTeamDetail()
     8. STATS PAGE    — renderStatsList(), filterStats(), renderStatsDetail()
     9. MVP PAGE      — renderMVPLadder(), renderMVPExpanded(), shot chart
    10. INIT          — runs on page load
   ============================================================ */


/* ============================================================
   1. DATA
   ============================================================ */

// Each player object — add as many fields as you want!
const players = [
  {
    id: 1,
    name: "Stephen Curry",
    number: 30,
    team: "Golden State Warriors",
    conference: "West",
    position: "PG",
    ppg: 26.4,
    rpg: 4.5,
    apg: 5.1,
    spg: 1.2,
    fgPct: 45.0,
    threePct: 39.5,
    ftPct: 92.3,
    height: "6'2\"",
    weight: "185 lbs",
    age: 36,
    mvpRank: 4,           // null if not in MVP race
    funFact: "Curry has won 4 NBA championships and is widely considered the greatest shooter ever.",
    // Shot data: {x, y, made} — x/y are percentages of canvas size (0–100)
    shots: [
      { x: 50, y: 30, made: true,  type: "3s" },
      { x: 30, y: 20, made: false, type: "3s" },
      { x: 70, y: 25, made: true,  type: "3s" },
      { x: 50, y: 60, made: true,  type: "2s" },
      { x: 45, y: 70, made: true,  type: "fts" },
      { x: 55, y: 70, made: false, type: "fts" },
      // Add more shot data points here!
    ],
  },
  {
    id: 2,
    name: "Nikola Jokic",
    number: 15,
    team: "Denver Nuggets",
    conference: "West",
    position: "C",
    ppg: 29.6,
    rpg: 13.0,
    apg: 10.2,
    spg: 1.4,
    fgPct: 57.5,
    threePct: 35.8,
    ftPct: 81.6,
    height: "7'0\"",
    weight: "284 lbs",
    age: 29,
    mvpRank: 1,
    funFact: "Jokic is a 3-time MVP and the only center to average a triple-double for a season.",
    shots: [
      { x: 50, y: 55, made: true,  type: "2s" },
      { x: 52, y: 60, made: true,  type: "2s" },
      { x: 35, y: 25, made: false, type: "3s" },
      { x: 65, y: 22, made: true,  type: "3s" },
      { x: 48, y: 70, made: true,  type: "fts" },
    ],
  },
  {
    id: 3,
    name: "Shai Gilgeous-Alexander",
    number: 2,
    team: "Oklahoma City Thunder",
    conference: "West",
    position: "SG",
    ppg: 31.4,
    rpg: 5.5,
    apg: 6.4,
    spg: 2.0,
    fgPct: 53.5,
    threePct: 37.2,
    ftPct: 87.5,
    height: "6'6\"",
    weight: "195 lbs",
    age: 26,
    mvpRank: 2,
    funFact: "SGA led the OKC Thunder to the #1 seed in the West in 2024–25.",
    shots: [
      { x: 50, y: 50, made: true,  type: "2s" },
      { x: 55, y: 40, made: true,  type: "2s" },
      { x: 30, y: 22, made: true,  type: "3s" },
      { x: 70, y: 20, made: false, type: "3s" },
      { x: 50, y: 72, made: true,  type: "fts" },
    ],
  },
  {
    id: 4,
    name: "Giannis Antetokounmpo",
    number: 34,
    team: "Milwaukee Bucks",
    conference: "East",
    position: "PF",
    ppg: 30.4,
    rpg: 11.9,
    apg: 6.5,
    spg: 1.2,
    fgPct: 61.2,
    threePct: 27.4,
    ftPct: 72.5,
    height: "6'11\"",
    weight: "243 lbs",
    age: 30,
    mvpRank: 3,
    funFact: "Giannis went from undrafted prospect to 2-time MVP and NBA champion.",
    shots: [
      { x: 50, y: 45, made: true,  type: "2s" },
      { x: 48, y: 55, made: true,  type: "2s" },
      { x: 60, y: 68, made: false, type: "fts" },
      { x: 55, y: 72, made: true,  type: "fts" },
      { x: 25, y: 25, made: false, type: "3s" },
    ],
  },
  {
    id: 5,
    name: "LeBron James",
    number: 23,
    team: "Los Angeles Lakers",
    conference: "West",
    position: "SF",
    ppg: 23.7,
    rpg: 8.3,
    apg: 9.0,
    spg: 1.1,
    fgPct: 54.3,
    threePct: 36.8,
    ftPct: 75.0,
    height: "6'9\"",
    weight: "250 lbs",
    age: 40,
    mvpRank: 5,
    funFact: "LeBron is the NBA's all-time leading scorer, surpassing Kareem Abdul-Jabbar in 2023.",
    shots: [
      { x: 50, y: 50, made: true,  type: "2s" },
      { x: 40, y: 30, made: true,  type: "3s" },
      { x: 65, y: 28, made: false, type: "3s" },
      { x: 50, y: 70, made: true,  type: "fts" },
    ],
  },
  // ── ADD MORE PLAYERS BELOW ──
  // Copy a block above, change the fields, bump the id.
];

// Teams data
const teams = [
  { name: "Golden State Warriors", conference: "West", coach: "Steve Kerr",    record: "46-36", funFact: "Home of the Splash Brothers.",        roster: ["Stephen Curry", "Draymond Green", "Andrew Wiggins"] },
  { name: "Denver Nuggets",        conference: "West", coach: "Michael Malone", record: "50-32", funFact: "2023 NBA Champions.",                  roster: ["Nikola Jokic", "Jamal Murray", "Michael Porter Jr."] },
  { name: "Oklahoma City Thunder", conference: "West", coach: "Mark Daigneault",record: "68-14", funFact: "Youngest roster to win the West.",     roster: ["Shai Gilgeous-Alexander", "Jalen Williams", "Chet Holmgren"] },
  { name: "Los Angeles Lakers",    conference: "West", coach: "JJ Redick",      record: "47-35", funFact: "17 championships, most in NBA history.", roster: ["LeBron James", "Anthony Davis", "Austin Reaves"] },
  { name: "Milwaukee Bucks",       conference: "East", coach: "Doc Rivers",     record: "48-34", funFact: "Giannis led them to the 2021 title.",  roster: ["Giannis Antetokounmpo", "Damian Lillard", "Khris Middleton"] },
  { name: "Boston Celtics",        conference: "East", coach: "Joe Mazzulla",   record: "61-21", funFact: "2024 NBA Champions.",                  roster: ["Jayson Tatum", "Jaylen Brown", "Kristaps Porzingis"] },
  // ── ADD MORE TEAMS ──
];


/* ============================================================
   2. STATE
   ============================================================ */

let currentPage      = "home";
let featuredIndex    = 0;       // which player is in the hero card
let selectedPlayer   = null;    // players page
let selectedTeam     = null;    // teams page
let selectedMVP      = null;    // mvp page
let shotFilter       = "all";   // "all" | "3s" | "fts"
let playerQuery      = "";      // search text on players page
let statsQuery       = "";      // search text on stats page


/* ============================================================
   3. ROUTER
   ============================================================ */

function navigate(page) {
  currentPage = page;
  showPage(page);
  closeSidebar();

  // Highlight active nav link
  document.querySelectorAll("#top-links a").forEach(a => a.classList.remove("active"));
  const activeLink = document.querySelector(`#top-links a[onclick="navigate('${page}')"]`);
  if (activeLink) activeLink.classList.add("active");
}

function showPage(page) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  // Show requested page
  const el = document.getElementById("page-" + page);
  if (el) el.classList.add("active");

  // Render the page content
  if (page === "home")    renderHome();
  if (page === "players") renderPlayerList();
  if (page === "teams")   renderTeamLists();
  if (page === "stats")   renderStatsList();
  if (page === "mvp")     renderMVPLadder();
}


/* ============================================================
   4. SIDEBAR
   ============================================================ */

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebar-overlay").classList.add("show");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("show");
}


/* ============================================================
   5. HOME PAGE
   ============================================================ */

function renderHome() {
  renderFeaturedCard(players[featuredIndex]);
  renderThumbnails();
}

function renderFeaturedCard(player) {
  const card = document.getElementById("featured-card");
  card.innerHTML = `
    <div class="hero-card">
      <div class="hero-card-left">
        <div class="player-avatar">${player.number}</div>
        <div class="player-identity">
          <h2>#${player.number} ${player.name}</h2>
          <p class="player-team">${player.team}</p>
          <p class="player-meta">${player.position} · Age ${player.age} · ${player.height}</p>
        </div>
      </div>
      <div class="hero-card-right">
        <div class="stat-grid">
          <div class="stat-box"><span class="stat-val">${player.ppg}</span><span class="stat-lbl">PPG</span></div>
          <div class="stat-box"><span class="stat-val">${player.rpg}</span><span class="stat-lbl">RPG</span></div>
          <div class="stat-box"><span class="stat-val">${player.apg}</span><span class="stat-lbl">APG</span></div>
        </div>
        <p class="fun-fact">"${player.funFact}"</p>
        ${player.mvpRank ? `<div class="mvp-badge">⭐ MVP Race #${player.mvpRank}</div>` : ""}
      </div>
    </div>
  `;
}

function renderThumbnails() {
  const strip = document.getElementById("thumbnail-strip");
  strip.innerHTML = players.map((p, i) => `
    <div class="thumb ${i === featuredIndex ? "active" : ""}" onclick="switchFeatured(${i})">
      <span class="thumb-num">${p.number}</span>
      <span class="thumb-name">${p.name.split(" ").slice(-1)[0]}</span>
    </div>
  `).join("");
}

function switchFeatured(index) {
  featuredIndex = index;
  renderFeaturedCard(players[index]);
  renderThumbnails();
}


/* ============================================================
   6. PLAYERS PAGE
   ============================================================ */

function renderPlayerList() {
  const query    = playerQuery.toLowerCase();
  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.team.toLowerCase().includes(query)
  );

  const list = document.getElementById("player-list");
  list.innerHTML = filtered.map(p => `
    <li class="list-item ${selectedPlayer && selectedPlayer.id === p.id ? "selected" : ""}"
        onclick="renderPlayerDetail(${p.id})">
      <span class="list-num">${p.number}</span>
      <span class="list-name">${p.name}</span>
      <span class="list-pos">${p.position}</span>
    </li>
  `).join("");
}

function filterPlayers() {
  playerQuery = document.getElementById("player-search").value;
  renderPlayerList();
}

function renderPlayerDetail(playerId) {
  selectedPlayer = players.find(p => p.id === playerId);
  const p = selectedPlayer;

  document.getElementById("player-detail").innerHTML = `
    <div class="detail-card">
      <div class="detail-header">
        <div class="detail-avatar">${p.number}</div>
        <div>
          <h2>${p.name}</h2>
          <p class="detail-team">${p.team}</p>
          <p class="detail-meta">${p.position} · ${p.height} · ${p.weight} · Age ${p.age}</p>
        </div>
      </div>
      <div class="detail-stats">
        <div class="stat-box"><span class="stat-val">${p.ppg}</span><span class="stat-lbl">PPG</span></div>
        <div class="stat-box"><span class="stat-val">${p.rpg}</span><span class="stat-lbl">RPG</span></div>
        <div class="stat-box"><span class="stat-val">${p.apg}</span><span class="stat-lbl">APG</span></div>
        <div class="stat-box"><span class="stat-val">${p.spg}</span><span class="stat-lbl">SPG</span></div>
        <div class="stat-box"><span class="stat-val">${p.fgPct}%</span><span class="stat-lbl">FG%</span></div>
        <div class="stat-box"><span class="stat-val">${p.threePct}%</span><span class="stat-lbl">3P%</span></div>
        <div class="stat-box"><span class="stat-val">${p.ftPct}%</span><span class="stat-lbl">FT%</span></div>
      </div>
      <p class="fun-fact">"${p.funFact}"</p>
      ${p.mvpRank ? `<div class="mvp-badge">⭐ MVP Race #${p.mvpRank}</div>` : ""}
    </div>
  `;

  renderPlayerList(); // re-render to highlight selected
}


/* ============================================================
   7. TEAMS PAGE
   ============================================================ */

function renderTeamLists() {
  const west = teams.filter(t => t.conference === "West");
  const east = teams.filter(t => t.conference === "East");

  function teamItem(t) {
    return `<li class="list-item ${selectedTeam && selectedTeam.name === t.name ? "selected" : ""}"
                onclick="renderTeamDetail('${t.name}')">
              ${t.name}
            </li>`;
  }

  document.getElementById("west-list").innerHTML = west.map(teamItem).join("");
  document.getElementById("east-list").innerHTML = east.map(teamItem).join("");
}

function renderTeamDetail(teamName) {
  selectedTeam = teams.find(t => t.name === teamName);
  const t = selectedTeam;

  document.getElementById("team-detail").innerHTML = `
    <div class="detail-card">
      <h2>${t.name}</h2>
      <p class="detail-meta">${t.conference}ern Conference · Record: ${t.record}</p>
      <p><strong>Coach:</strong> ${t.coach}</p>
      <p class="fun-fact">"${t.funFact}"</p>
      <h3>Roster</h3>
      <ul class="roster-list">
        ${t.roster.map(name => `<li>${name}</li>`).join("")}
      </ul>
    </div>
  `;

  renderTeamLists(); // re-render to highlight
}


/* ============================================================
   8. STATS PAGE
   ============================================================ */

function renderStatsList() {
  const query    = statsQuery.toLowerCase();
  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  document.getElementById("stats-list").innerHTML = filtered.map(p => `
    <li class="list-item ${selectedPlayer && selectedPlayer.id === p.id ? "selected" : ""}"
        onclick="renderStatsDetail(${p.id})">
      <span class="list-num">${p.number}</span>
      <span class="list-name">${p.name}</span>
    </li>
  `).join("");
}

function filterStats() {
  statsQuery = document.getElementById("stats-search").value;
  renderStatsList();
}

function renderStatsDetail(playerId) {
  const p = players.find(pl => pl.id === playerId);

  document.getElementById("stats-detail").innerHTML = `
    <div class="detail-card">
      <div class="detail-header">
        <div class="detail-avatar">${p.number}</div>
        <div>
          <h2>${p.name}</h2>
          <p>${p.team} · ${p.position}</p>
        </div>
      </div>

      <table class="stats-table">
        <thead>
          <tr><th>Stat</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>Points per game</td><td>${p.ppg}</td></tr>
          <tr><td>Rebounds per game</td><td>${p.rpg}</td></tr>
          <tr><td>Assists per game</td><td>${p.apg}</td></tr>
          <tr><td>Steals per game</td><td>${p.spg}</td></tr>
          <tr><td>FG %</td><td>${p.fgPct}%</td></tr>
          <tr><td>3-Point %</td><td>${p.threePct}%</td></tr>
          <tr><td>FT %</td><td>${p.ftPct}%</td></tr>
          <tr><td>Height</td><td>${p.height}</td></tr>
          <tr><td>Weight</td><td>${p.weight}</td></tr>
          <tr><td>Age</td><td>${p.age}</td></tr>
        </tbody>
      </table>
    </div>
  `;

  renderStatsList();
}


/* ============================================================
   9. MVP PAGE
   ============================================================ */

function renderMVPLadder() {
  const mvpPlayers = players
    .filter(p => p.mvpRank !== null && p.mvpRank !== undefined)
    .sort((a, b) => a.mvpRank - b.mvpRank);

  document.getElementById("mvp-ladder").innerHTML = mvpPlayers.map(p => `
    <div class="mvp-row" onclick="openMVPExpanded(${p.id})">
      <span class="mvp-rank">#${p.mvpRank}</span>
      <div class="mvp-avatar">${p.number}</div>
      <div class="mvp-info">
        <span class="mvp-name">${p.name}</span>
        <span class="mvp-team">${p.team}</span>
      </div>
      <div class="mvp-quick-stats">
        <span>${p.ppg} PPG</span>
        <span>${p.rpg} RPG</span>
        <span>${p.apg} APG</span>
      </div>
    </div>
  `).join("");
}

function openMVPExpanded(playerId) {
  selectedMVP = players.find(p => p.id === playerId);
  shotFilter  = "all";

  // Reset filter button states
  document.querySelectorAll(".shot-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("filter-all").classList.add("active");

  // Render header
  const p = selectedMVP;
  document.getElementById("mvp-expanded-header").innerHTML = `
    <div class="detail-header">
      <div class="detail-avatar">${p.number}</div>
      <div>
        <h2>#${p.mvpRank} ${p.name}</h2>
        <p>${p.team} · ${p.position}</p>
      </div>
    </div>
  `;

  // Render stat bars (visual comparison of key stats)
  renderMVPStatBars(p);

  // Show the expanded section
  document.getElementById("mvp-expanded").classList.remove("hidden");

  // Draw shot chart
  drawShotChart(p, shotFilter);

  // Scroll to it
  document.getElementById("mvp-expanded").scrollIntoView({ behavior: "smooth" });
}

function closeMVPExpanded() {
  document.getElementById("mvp-expanded").classList.add("hidden");
  selectedMVP = null;
}

function setShotFilter(filter) {
  shotFilter = filter;
  document.querySelectorAll(".shot-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("filter-" + filter).classList.add("active");
  if (selectedMVP) drawShotChart(selectedMVP, filter);
}

// ── Shot Chart (drawn on <canvas>) ──────────────────────────
function drawShotChart(player, filter) {
  const canvas  = document.getElementById("shot-chart");
  const ctx     = canvas.getContext("2d");
  const W       = canvas.width;
  const H       = canvas.height;

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Draw court outline (simple half-court)
  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth   = 2;

  // Half-court rectangle
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Paint / key
  ctx.strokeRect(W / 2 - 60, H - 20, 120, -140);

  // 3-point arc (approximate)
  ctx.beginPath();
  ctx.arc(W / 2, H - 20, 200, Math.PI, 0);
  ctx.stroke();

  // Basket
  ctx.beginPath();
  ctx.arc(W / 2, H - 20, 12, 0, Math.PI * 2);
  ctx.strokeStyle = "#e8742a";
  ctx.lineWidth   = 2;
  ctx.stroke();

  // Filter shots
  const shots = filter === "all"
    ? player.shots
    : player.shots.filter(s => s.type === filter);

  // Plot each shot
  shots.forEach(shot => {
    const x = (shot.x / 100) * W;
    const y = (shot.y / 100) * H;

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);

    if (shot.made) {
      ctx.fillStyle   = "rgba(34, 197, 94, 0.85)";   // green = made
      ctx.strokeStyle = "#16a34a";
    } else {
      ctx.fillStyle   = "rgba(239, 68, 68, 0.85)";   // red = missed
      ctx.strokeStyle = "#b91c1c";
    }

    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
  });

  // Legend
  ctx.font      = "13px sans-serif";
  ctx.fillStyle = "#16a34a";
  ctx.fillText("● Made", 30, H - 5);
  ctx.fillStyle = "#b91c1c";
  ctx.fillText("● Missed", 110, H - 5);
}

// ── Stat bars: visual bar comparison for a single player ────
function renderMVPStatBars(player) {
  // Max values for scaling the bars
  const maxStats = { ppg: 40, rpg: 15, apg: 12, spg: 3 };
  const labels   = { ppg: "PPG", rpg: "RPG", apg: "APG", spg: "SPG" };

  const html = Object.keys(maxStats).map(stat => {
    const val     = player[stat];
    const pct     = Math.min((val / maxStats[stat]) * 100, 100).toFixed(1);
    return `
      <div class="stat-bar-row">
        <span class="stat-bar-label">${labels[stat]}</span>
        <div class="stat-bar-track">
          <div class="stat-bar-fill" style="width: ${pct}%"></div>
        </div>
        <span class="stat-bar-val">${val}</span>
      </div>
    `;
  }).join("");

  document.getElementById("mvp-stat-bars").innerHTML = `<div class="stat-bars">${html}</div>`;
}


/* ============================================================
   10. INIT — runs when the page loads
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  navigate("home");
});
