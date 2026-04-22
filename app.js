

function renderLeaderboard(containerId, title, stat, label){

    const top5 = [...players]
    .sort((a, b) => b[stat] - a[stat])
    .slice(0, 5);

    document.getElementById(containerId).innerHTML = `
    <div class="leaderboard-card">
      <h3>${title}</h3>
      ${top5.map((p, i) => `
        <div class="leader-row">
          <span class="leader-rank">#${i + 1}</span>
          <span class="leader-name">${p.name}</span>
          <span class="leader-val">${p[stat]} ${label}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderHome(){
    renderLeaderboard("top-scorers", "Top Scorers", "ppg", "PPG")
    renderLeaderboard("top-rebounds", "Top Rebounders", "rpg", "RPG")
    renderLeaderboard("top-assists", "Top Passers", "apg", "APG")
    renderLeaderboard("top-3pt-percent", "Top 3pt %", "threePct", "%")
}

function navigate(page){
    if (page === "home") { renderHome(); }
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active")
    });

    document.getElementById("page-" + page).classList.add("active");

    if (page === "home")    { renderHome();    console.log("home pressed"); }
    if (page === "players") { renderPlayers(); console.log("players pressed"); }
    if (page === "teams")   { renderTeams();   console.log("teams pressed"); }
    if (page === "stats")   { renderStats();   console.log("stats pressed"); }
    if (page === "mvp")     { renderMVP();     console.log("mvp pressed"); }
}




let selectedPlayer = null;
let playerQuery = "";

function renderPlayers() {
  renderPlayerList();
}

function renderPlayerList() {
  const query = playerQuery.toLowerCase();
  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.team.toLowerCase().includes(query) ||
    (favorites.includes(p.id) && "favorites".startsWith(query))
  );

  document.getElementById("player-list").innerHTML = filtered.map(p => `
    <li class="list-item ${selectedPlayer && selectedPlayer.id === p.id ? "selected" : ""} ${favorites.includes(p.id) ? "favorited" : ""}"
        onclick="renderPlayerDetail(${p.id})">
      <span class="list-num">#${p.number}</span>
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
        <div class="detail-avatar">#${p.number}</div>
        <div>
          <h2>${p.name}</h2>
          <p class="detail-team">${p.team}</p>
          <p class="detail-meta">${p.position} · Age ${p.age}</p>
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
      ${p.mvpRank ? `<div class="mvp-badge"> MVP Race #${p.mvpRank}</div>` : ""}
      <button class="fav-btn" onclick="toggleFavorite(${p.id})">
        ${favorites.includes(p.id) ? "★ Favorited" : "☆ Add to Favorites"}
      </button>
    </div>
  `;

  renderPlayerList();
}



let favorites = [];
let selectedTeam = null;
let favoriteTeams = [];
let showingTeamFavorites = false;


function toggleFavorite(playerId) {
  if (favorites.includes(playerId)) {
    favorites = favorites.filter(id => id !== playerId);
  } else {
    favorites.push(playerId);
  }
  renderPlayerDetail(playerId);
}

function renderTeams() {
  if (!selectedTeam) selectedTeam = teams.find(t => t.abbr === "OKC");

  const westTeams = teams.filter(t => t.conference === "West");
  const eastTeams = teams.filter(t => t.conference === "East");

  const centerContent = showingTeamFavorites
    ? buildTeamFavoritesView()
    : buildTeamCard(selectedTeam);

  document.getElementById("page-teams").innerHTML = `
    <div class="teams-layout">
      <aside class="teams-sidebar">
        <h2 class="conf-label">West</h2>
        <ul class="teams-list">
          ${westTeams.map(t => `
            <li class="team-item ${!showingTeamFavorites && selectedTeam.abbr === t.abbr ? "selected" : ""}"
                onclick="selectTeam('${t.abbr}')">
              ${t.name}
              ${favoriteTeams.includes(t.abbr) ? `<span class="team-sidebar-star">★</span>` : ""}
            </li>
          `).join("")}
        </ul>
      </aside>
      <div class="teams-center">
        <div class="teams-center-toolbar">
          <button class="team-fav-toggle ${showingTeamFavorites ? "active" : ""}"
                  onclick="toggleTeamFavoritesView()">
            ★ Favorites${favoriteTeams.length > 0 ? ` (${favoriteTeams.length})` : ""}
          </button>
        </div>
        ${centerContent}
      </div>
      <aside class="teams-sidebar teams-sidebar-right">
        <h2 class="conf-label">East</h2>
        <ul class="teams-list">
          ${eastTeams.map(t => `
            <li class="team-item ${!showingTeamFavorites && selectedTeam.abbr === t.abbr ? "selected" : ""}"
                onclick="selectTeam('${t.abbr}')">
              ${t.name}
              ${favoriteTeams.includes(t.abbr) ? `<span class="team-sidebar-star">★</span>` : ""}
            </li>
          `).join("")}
        </ul>
      </aside>
    </div>
  `;
}

function buildTeamCard(team) {
  const seen = new Set();
  const roster = players.filter(p => {
    if (p.teamShort !== team.abbr || seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });

  const isFav = favoriteTeams.includes(team.abbr);

  return `
    <div class="team-card">
      <h2 class="team-card-name">${team.name}</h2>
      <p class="team-card-meta">${team.conference}ern Conference · Record: ${team.wins}-${team.losses}</p>
      <p class="team-card-coach">Coach: ${team.coach}</p>
      <p class="team-card-fact">"${team.funFact}"</p>
      <h3 class="team-card-roster-heading">Roster</h3>
      <ul class="team-card-roster">
        ${roster.length > 0
          ? roster.map(p => `<li>${p.name}</li>`).join("")
          : `<li class="team-no-players">No featured players this season</li>`}
      </ul>
      <button class="team-fav-btn ${isFav ? "active" : ""}"
              onclick="toggleTeamFavorite('${team.abbr}')">
        ${isFav ? "★ Favorited" : "☆ Add to Favorites"}
      </button>
    </div>
  `;
}

function buildTeamFavoritesView() {
  if (favoriteTeams.length === 0) {
    return `<p class="placeholder-msg" style="margin-top:80px;">No favorite teams yet — click Add to Favorites on any team card</p>`;
  }
  const favTeams = teams.filter(t => favoriteTeams.includes(t.abbr));
  return `<div class="team-fav-grid">${favTeams.map(t => buildTeamCard(t)).join("")}</div>`;
}

function toggleTeamFavorite(abbr) {
  if (favoriteTeams.includes(abbr)) {
    favoriteTeams = favoriteTeams.filter(a => a !== abbr);
  } else {
    favoriteTeams.push(abbr);
  }
  renderTeams();
}

function toggleTeamFavoritesView() {
  showingTeamFavorites = !showingTeamFavorites;
  renderTeams();
}

function selectTeam(abbr) {
  selectedTeam = teams.find(t => t.abbr === abbr);
  showingTeamFavorites = false;
  renderTeams();
}

function renderStats() {
  document.getElementById("page-stats").innerHTML = `
    <div class="hero-section">
      <h1>League Leaders</h1>
      <p class="subtitle">2025–26 Season · Click a player to view their card</p>
    </div>
    <div class="leaderboards">
      <div id="stats-scorers"></div>
      <div id="stats-rebounds"></div>
      <div id="stats-assists"></div>
      <div id="stats-3pt"></div>
    </div>
  `;

  renderStatsLeaderboard("stats-scorers",  "Top Scorers",    "ppg",      "PPG");
  renderStatsLeaderboard("stats-rebounds", "Top Rebounders", "rpg",      "RPG");
  renderStatsLeaderboard("stats-assists",  "Top Passers",    "apg",      "APG");
  renderStatsLeaderboard("stats-3pt",      "Top 3pt %",      "threePct", "%");
}

function renderStatsLeaderboard(containerId, title, stat, label) {
  const top5 = [...players]
    .sort((a, b) => b[stat] - a[stat])
    .slice(0, 5);

  document.getElementById(containerId).innerHTML = `
    <div class="leaderboard-card">
      <h3>${title}</h3>
      ${top5.map((p, i) => `
        <div class="leader-row leader-row--link" onclick="goToPlayerDetail(${p.id})">
          <span class="leader-rank">#${i + 1}</span>
          <span class="leader-name">${p.name}</span>
          <span class="leader-val">${p[stat]} ${label}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function goToPlayerDetail(playerId) {
  navigate("players");
  renderPlayerDetail(playerId);
}

const mvpHighlights = {
  1: { statKey: "apg",  label: "APG", reason: "Averages a triple-double a game as a center!",              image: "assets/joker.png" },
  2: { statKey: "ppg",  label: "PPG", reason: "Led OKC to the best record in the NBA, CLUTCH PLAYER OF THE YEAR!!!", image: "assets/shai.png" },
  3: { statKey: "blk",  label: "BPG", reason: "Leads the NBA in blocks and has 101 consecutive games with blocks!", image: "assets/wemby.jpg" },
  4: { statKey: "ppg",  label: "PPG", reason: "Best scoring average in the league!",                        image: "assets/luka.png" },
  5: { statKey: "apg",  label: "APG", reason: "Flippped Detroit's upside down to a championship contender!", image: "assets/cade.png" },
};

function renderMVP() {
  const candidates = players
    .filter(p => p.mvpRank !== null)
    .filter((p, i, arr) => arr.findIndex(x => x.mvpRank === p.mvpRank) === i)
    .sort((a, b) => a.mvpRank - b.mvpRank);

  document.getElementById("page-mvp").innerHTML = `
    <div class="hero-section">
      <h1>MVP Race</h1>
      <p class="subtitle">2025–26 Season · Top 5 Candidates</p>
    </div>
    <div class="mvp-grid">
      ${candidates.map(p => {
        const h = mvpHighlights[p.mvpRank];
        const rankClass = p.mvpRank === 1 ? "rank-gold" : p.mvpRank === 2 ? "rank-silver" : p.mvpRank === 3 ? "rank-bronze" : "rank-default";
        return `
          <div class="mvp-card mvp-card--clickable" onclick="goToPlayerDetail(${p.id})">
            <div class="mvp-rank-badge ${rankClass}">#${p.mvpRank}</div>
            ${p.mvpRank <= 3 ? `<div class="mvp-finalist-badge">FINALIST</div>` : ""}
            <div class="mvp-img-placeholder">
              ${h.image
                ? `<img src="${h.image}" alt="${p.name}" class="mvp-img" />`
                : `<span class="mvp-jersey">#${p.number}</span>
                   <span class="mvp-img-label">Photo coming soon</span>`
              }
            </div>
            <div class="mvp-card-body">
              <h2 class="mvp-name">
                ${p.name}
                ${favorites.includes(p.id) ? `<span class="mvp-fav-star">★</span>` : ""}
              </h2>
              <p class="mvp-team">${p.team} · ${p.position}</p>
              <div class="mvp-highlight">
                <span class="mvp-highlight-val">${p[h.statKey]}</span>
                <span class="mvp-highlight-lbl">${h.label}</span>
              </div>
              <p class="mvp-reason">${h.reason}</p>
              <div class="mvp-secondary-stats">
                <div class="mvp-stat"><span class="mvp-stat-val">${p.ppg}</span><span class="mvp-stat-lbl">PPG</span></div>
                <div class="mvp-stat"><span class="mvp-stat-val">${p.rpg}</span><span class="mvp-stat-lbl">RPG</span></div>
                <div class="mvp-stat"><span class="mvp-stat-val">${p.apg}</span><span class="mvp-stat-lbl">APG</span></div>
                <div class="mvp-stat"><span class="mvp-stat-val">${p.fgPct}%</span><span class="mvp-stat-lbl">FG%</span></div>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
});
