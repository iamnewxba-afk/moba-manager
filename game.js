// ===== DATA =====
const ranks = [
  {name:"Warrior", stars:3},
  {name:"Elite", stars:4},
  {name:"Master", stars:4},
  {name:"Grandmaster", stars:5},
  {name:"Epic", stars:5},
  {name:"Legend", stars:5},
  {name:"Mythic", stars:999}
];

let team = JSON.parse(localStorage.getItem("team")) || [
  createPlayer("Kai", "EXP"),
  createPlayer("Renz", "Jungle"),
  createPlayer("Miko", "Mid"),
  createPlayer("Jude", "Gold"),
  createPlayer("Aki", "Roam"),
];

let synergy = 50;
let logDiv = document.getElementById("log");

// ===== PLAYER CREATION =====
function createPlayer(name, role){
  return {
    name,
    role,
    mechanics: rand(40,60),
    gameSense: rand(40,60),
    teamwork: rand(40,60),
    mentality: rand(40,60),
    fatigue: 0,
    rankIndex: 0,
    stars: 0
  };
}

// ===== UTILS =====
function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function save(){
  localStorage.setItem("team", JSON.stringify(team));
}

function log(msg){
  let div = document.getElementById("log");

  let entry = document.createElement("div");
  entry.innerHTML = "▶ " + msg;

  div.prepend(entry);
}

// ===== UI =====
function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.style.display="none");
  document.getElementById(id).style.display="block";
}

function render(){
  renderTeam();
  renderActions();
  renderTournament();
}

function renderTeam(){
  let html = "<h2>🏆 Team Roster</h2>";

  team.forEach(p=>{
    let rank = ranks[p.rankIndex].name;

    html += `
    <div class="card">
      <h3>${p.name} (${p.role})</h3>
      <p><b>Rank:</b> ${rank} ⭐${p.stars}</p>
      <p>⚔ Mechanics: ${p.mechanics}</p>
      <p>🧠 Game Sense: ${p.gameSense}</p>
      <p>🤝 Teamwork: ${p.teamwork}</p>
      <p>💬 Mentality: ${p.mentality}</p>
      <p>⚡ Fatigue: ${p.fatigue}</p>
    </div>`;
  });

  html += `<div class="card"><b>Team Synergy:</b> ${synergy}</div>`;

  document.getElementById("team").innerHTML = html;
}

// ===== ACTIONS =====
function renderActions(){
  document.getElementById("actions").innerHTML = `
  <h2>Actions</h2>
  <button onclick="scrim()">Scrim</button>
  <button onclick="rankGrind()">Rank Grind</button>
  <button onclick="bond()">Team Bonding</button>
  <button onclick="rest()">Rest</button>
  <button onclick="simulateMatch()">Play Match</button>
  `;
}

function scrim(){
  team.forEach(p=>{
    p.teamwork += 2;
    p.gameSense += 2;
    p.fatigue += 5;
  });
  synergy += 2;
  log("Scrims improved teamwork.");
  update();
}

function rankGrind(){
  team.forEach(p=>{
    p.mechanics += 2;
    p.mentality += 1;
    p.fatigue += 4;
    gainStar(p);
  });
  log("Rank grinding increased stars.");
  update();
}

function bond(){
  synergy += 5;
  log("Team bonding boosted synergy.");
  update();
}

function rest(){
  team.forEach(p=>{
    p.fatigue = Math.max(0,p.fatigue-10);
  });
  log("Team rested.");
  update();
}

// ===== RANK SYSTEM =====
function gainStar(p){
  p.stars++;
  let maxStars = ranks[p.rankIndex].stars;

  if(p.stars >= maxStars){
    p.stars = 0;
    p.rankIndex = Math.min(p.rankIndex+1, ranks.length-1);
  }
}

// ===== MATCH ENGINE =====
function calcPlayerPower(p){
  return (
    p.mechanics +
    p.gameSense +
    p.teamwork +
    p.mentality -
    p.fatigue
  );
}

function simulateMatch(){
  let teamPower = team.reduce((sum,p)=>sum+calcPlayerPower(p),0);
  teamPower *= (1 + synergy/100);

  let enemyPower = rand(200,400);

  if(teamPower > enemyPower){
    log("🏆 Victory!");
  } else {
    log("❌ Defeat!");
  }

  team.forEach(p=>p.fatigue+=5);
  update();
}

// ===== TOURNAMENT =====
let tournament = ["You","Team A","Team B","Team C"];

function renderTournament(){
  let html = "<h2>Tournament</h2>";
  html += `<button onclick="playTournament()">Start Tournament</button>`;
  document.getElementById("tournament").innerHTML = html;
}

function playTournament(){
  log("Tournament Started!");

  let semi1 = simulateBracket("You","Team A");
  let semi2 = simulateBracket("Team B","Team C");

  let final = simulateBracket(semi1, semi2);

  log(`🏆 Champion: ${final}`);
}

function simulateBracket(a,b){
  let powerA = a==="You" ? getTeamPower() : rand(200,400);
  let powerB = b==="You" ? getTeamPower() : rand(200,400);

  return powerA > powerB ? a : b;
}

function getTeamPower(){
  return team.reduce((sum,p)=>sum+calcPlayerPower(p),0)*(1+synergy/100);
}

// ===== UPDATE =====
function update(){
  save();
  render();
}

// ===== START =====
render();
showTab("team");
