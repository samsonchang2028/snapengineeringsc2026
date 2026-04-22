

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



let favorites = []


function toggleFavorite(playerId) {
  if (favorites.includes(playerId)) {
    favorites = favorites.filter(id => id !== playerId);
  } else {
    favorites.push(playerId);
  }
  renderPlayerDetail(playerId);
}

function renderTeams() {
  document.getElementById("page-teams").innerHTML = `
    <h1>Teams</h1>

  `;
}

function renderStats() {
  document.getElementById("page-stats").innerHTML = `
    <h1>Stats</h1>

  `;
}

function renderMVP() {
  document.getElementById("page-mvp").innerHTML = `
    <h1>MVP Race</h1>

  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
});
