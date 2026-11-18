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
