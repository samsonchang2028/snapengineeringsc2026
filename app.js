

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
document.addEventListener("DOMContentLoaded", () => {
  renderHome();
});

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

function renderPlayers() {
  document.getElementById("page-players").innerHTML = `
    <h1>Players</h1>
    
  `;
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