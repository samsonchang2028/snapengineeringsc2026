

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