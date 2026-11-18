const currentChamp = "calgary";

let currentChallenger = "";
let nextHome = "";
let nextVisitor = "";
let nextDate;

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [
    year,
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("-");
}

function formatDisplayDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-us", {
    timeZone: "UTC",
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Helper to find the first game for a team starting from (nextGameDayOffset + 1)
function findNextGameAfter(schedule, team, startOffset) {
  for (let j = startOffset; j < startOffset + 30; j++) {
    let futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + j);
    let formattedFutureDate = formatDate(futureDate);

    if (!schedule[formattedFutureDate]) {
      continue;
    }

    for (const game of schedule[formattedFutureDate].games) {
      if (Object.values(game).includes(team)) {
        return {
          date: formattedFutureDate,
          home: game.home,
          visitor: game.visitor,
        };
      }
    }
  }
  return null;
}

// schedule and upcoming game widget

fetch("26-27-schedule.json")
  .then((res) => res.json())
  .then((res) => {
    let schedule = {};

    // reformatting the schedule downloaded from hockeyreference.com

    res.forEach((game) => {
      if (!Object.keys(schedule).includes(game.date)) {
        schedule[game.date] = { games: [] };
      }
      schedule[game.date].games.push({
        home: game.home,
        visitor: game.visitor,
      });
    });

    let found = 0;
    let nextGameDayOffset = 0;

    for (let i = 0; i < 30; i++) {
      let tempDate = new Date();
      tempDate.setDate(tempDate.getDate() + i);
      let formattedTempDate = formatDate(tempDate);

      if (!schedule[formattedTempDate]) {
        continue;
      }

      schedule[formattedTempDate].games.forEach((game) => {
        if (Object.values(game).includes(currentChamp)) {
          nextHome = game.home;
          nextVisitor = game.visitor;
          currentChallenger =
            currentChamp == game.home ? game.visitor : game.home;
          document
            .getElementById(currentChallenger)
            .parentElement.classList.add("challenger");

          nextDate = formattedTempDate;
          nextGameDayOffset = i;
          found = 1;
        }
      });

      if (found != 0) break;
    }

    // adding date and team logos for the next game

    document.getElementById("date").innerText = formatDisplayDate(nextDate);
    document
      .getElementById("home")
      .setAttribute("src", `logos/${nextHome}.png`);
    document
      .getElementById("away")
      .setAttribute("src", `logos/${nextVisitor}.png`);

    // NEW: Finding and displaying the following game for both possible winners
    const champNextGame = findNextGameAfter(
      schedule,
      currentChamp,
      nextGameDayOffset + 1,
    );
    const challengerNextGame = findNextGameAfter(
      schedule,
      currentChallenger,
      nextGameDayOffset + 1,
    );

    // 1. If Current Champ retains the Cup
    document.getElementById("champ-scenario-label").innerText =
      `If ${currentChamp.replace("-", " ")} wins:`;
    if (champNextGame) {
      document.getElementById("champ-next-date").innerText = formatDisplayDate(
        champNextGame.date,
      );
      document
        .getElementById("champ-next-home")
        .setAttribute("src", `logos/${champNextGame.home}.png`);
      document
        .getElementById("champ-next-away")
        .setAttribute("src", `logos/${champNextGame.visitor}.png`);
    }

    // 2. If Challenger wins the Cup
    document.getElementById("challenger-scenario-label").innerText =
      `If ${currentChallenger.replace("-", " ")} wins:`;
    if (challengerNextGame) {
      document.getElementById("challenger-next-date").innerText =
        formatDisplayDate(challengerNextGame.date);
      document
        .getElementById("challenger-next-home")
        .setAttribute("src", `logos/${challengerNextGame.home}.png`);
      document
        .getElementById("challenger-next-away")
        .setAttribute("src", `logos/${challengerNextGame.visitor}.png`);
    }
  });

const teamPoints = [
 { anaheim: "0" },
  { boston: "0" },
  { buffalo: "1" },
  { calgary: "1" },
  { carolina: "0" },
  { chicago: "2" },
  { colorado: "3" },
  { columbus: "2" },
  { dallas: "6" },
  { detroit: "0" },
  { edmonton: "0" },
  { florida: "1" },
  { vegas: "2" },
  { "los-angeles": "0" },
  { minnesota: "0" },
  { montreal: "0" },
  { nashville: "1" },
  { "new-jersey": "1" },
  { "ny-islanders": "0" },
  { "ny-rangers": "0" },
  { ottawa: "0" },
  { philadelphia: "0" },
  { pittsburgh: "1" },
  { "san-jose": "3" },
  { seattle: "0" },
  { "st-louis": "0" },
  { tampa: "0" },
  { toronto: "0" },
  { utah: "0" },
  { vancouver: "0" },
  { washington: "0" },
  { winnipeg: "0" },
];

const Lagzdins = document.querySelector(".Lagzdins");
const Zarins = document.querySelector(".Zarins");
const Krists = document.querySelector(".Krists");
const Davis = document.querySelector(".Davis");

const players = [Lagzdins, Zarins, Krists, Davis];

// iterates through team points array and displays all team points accordingly

teamPoints.forEach((team) => {
  const teamName = Object.keys(team)[0];
  document.getElementById(teamName).innerText = team[teamName];
});

// adds a border to the active cup champ

document.getElementById(currentChamp).parentElement.classList.add("champ");

// gets all team points for each player and displays the max value of each next to the player name

getPoints();

function getPoints() {
  players.forEach((player) => {
    let playerTotal = 0;
    const playerArray = [];
    player.querySelectorAll(".team-score").forEach((team) => {
      playerTotal += Number(team.innerText);
      playerArray.push(Number(team.innerText));
    });

    player.querySelector("#high-points").innerText =
      `High ${Math.max(...playerArray)} / Total ${playerTotal}`;
  });
}

// Rules Modal functionality

let rulesModal = document.getElementById("rules-modal");
let modalOpen = document.getElementById("modal-open");
let modalClose = document.getElementById("modal-close");

modalOpen.addEventListener("click", () => {
  rulesModal.showModal();
});

modalClose.addEventListener("click", () => {
  rulesModal.close();
});

// ==========================================
// CUP GAME-BY-GAME HISTORY LOG
// ==========================================

// Add each completed Cup game here in chronological order.
// The script automatically detects the owners and calculates running win totals!
const cupHistory = [
  // Example entries based on your current teamPoints (20 games played so far):
  { date: "2026-09-29", holder: "carolina", challenger: "florida", winner: "florida" },
  { date: "2026-10-01", holder: "florida", challenger: "san-jose", winner: "san-jose" },
 { date: "2026-10-03", holder: "san-jose", challenger: "los-angeles", winner: "san-jose" },
  { date: "2026-10-05", holder: "san-jose", challenger: "dallas", winner: "dallas" },
  { date: "2026-10-08", holder: "dallas", challenger: "buffalo", winner: "dallas" },
  { date: "2026-10-10", holder: "dallas", challenger: "pittsburgh", winner: "pittsburgh" },
  { date: "2026-10-13", holder: "pittsburgh", challenger: "chicago", winner: "chicago" },
  { date: "2026-10-15", holder: "chicago", challenger: "winnipeg", winner: "chicago" },
  { date: "2026-10-17", holder: "chicago", challenger: "dallas", winner: "dallas" },
  { date: "2026-10-20", holder: "dallas", challenger: "boston", winner: "dallas" },
  { date: "2026-10-22", holder: "dallas", challenger: "winnipeg", winner: "dallas" },
  { date: "2026-10-25", holder: "dallas", challenger: "ny-islanders", winner: "dallas" },
  { date: "2026-10-27", holder: "dallas", challenger: "new-jersey", winner: "new-jersey" },
  { date: "2026-10-28", holder: "new-jersey", challenger: "colorado", winner: "colorado" },
  { date: "2026-10-31", holder: "colorado", challenger: "calgary", winner: "colorado" },
  { date: "2026-11-02", holder: "colorado", challenger: "chicago", winner: "colorado" },
  { date: "2026-11-03", holder: "colorado", challenger: "columbus", winner: "columbus" },
  { date: "2026-11-05", holder: "columbus", challenger: "dallas", winner: "columbus" },
  { date: "2026-11-06", holder: "columbus", challenger: "buffalo", winner: "buffalo" },
  { date: "2026-11-08", holder: "buffalo", challenger: "vegas", winner: "vegas" },
  { date: "2026-11-11", holder: "vegas", challenger: "utah", winner: "vegas" },
  { date: "2026-11-13", holder: "vegas", challenger: "nashville", winner: "nashville" },
  { date: "2026-11-15", holder: "nashville", challenger: "san-jose", winner: "san-jose" },
  { date: "2026-11-17", holder: "nashville", challenger: "calgary", winner: "calgary" },
];

// 1. Automatically map every NHL team to its owner from index.html
const teamToOwner = {};
const ownerRunningWins = {
  Lagzdins: 0,
  Zarins: 0,
  Krists: 0,
  Davis: 0,
};

players.forEach((playerDiv) => {
  const ownerName = playerDiv.classList[0]; // "Lagzdins", "Zarins", "Krists", or "Davis"
  playerDiv.querySelectorAll(".team-score").forEach((teamEl) => {
    teamToOwner[teamEl.id] = ownerName;
  });
});

// 2. Render the Game-by-Game History Table
function renderCupHistory() {
  const tbody = document.getElementById("history-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  cupHistory.forEach((game, index) => {
    const gameNum = index + 1;
    const holderOwner = teamToOwner[game.holder] || "Unknown";
    const challengerOwner = teamToOwner[game.challenger] || "Unknown";

    const holderWon = game.winner === game.holder;
    const challengerWon = game.winner === game.challenger;

    // Increment the winning owner's running total at the time of this game
    if (holderWon && ownerRunningWins[holderOwner] !== undefined) {
      ownerRunningWins[holderOwner] += 1;
    } else if (challengerWon && ownerRunningWins[challengerOwner] !== undefined) {
      ownerRunningWins[challengerOwner] += 1;
    }

    const holderWinsAtTime = ownerRunningWins[holderOwner];
    const challengerWinsAtTime = ownerRunningWins[challengerOwner];

    // Format date nicely (e.g., "Oct 8")
    const shortDate = new Date(game.date).toLocaleString("en-us", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
    });

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="col-num">${gameNum}</td>
      <td class="col-date">${shortDate}</td>
      <td class="col-owner ${holderWon ? "winner-owner" : ""}">
        <span class="owner-name">${holderOwner}</span>
        <span class="owner-wins">(${holderWinsAtTime})</span>
      </td>
      <td class="col-matchup">
        <div class="history-teams">
          <img src="logos/${game.holder}.png" alt="${game.holder}" class="history-logo ${holderWon ? "winner-logo" : "loser-logo"}" />
          <span class="history-vs">vs</span>
          <img src="logos/${game.challenger}.png" alt="${game.challenger}" class="history-logo ${challengerWon ? "winner-logo" : "loser-logo"}" />
        </div>
      </td>
      <td class="col-owner ${challengerWon ? "winner-owner" : ""}">
        <span class="owner-name">${challengerOwner}</span>
        <span class="owner-wins">(${challengerWinsAtTime})</span>
      </td>
    `;

    tbody.prepend(tr);
  });
}

renderCupHistory();
