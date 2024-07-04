let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];
const monsters = [
  {
    name: "Troll",
    level: 2,
    health: 15,
  },
  {
    name: "Kraken",
    level: 8,
    health: 60,
  },
  {
    name: "Drachen",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "town square",
    "button text": ["Geh zum Shop", "Geh zur Höhle", "Kampf gegen Drachen"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Sie befinden sich auf dem Stadtplatz. Sie sehen ein Schild mit der Aufschrift "Shop“.',
  },
  {
    name: "store",
    "button text": [
      "Kaufe 10 Gesundheit (10 Gold)",
      "Waffe kaufen (30 Gold)",
      "Geh zum Stadtplatz",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Du betretest den Laden.",
  },
  {
    name: "cave",
    "button text": ["Der Troll", "Der Kraken", "Geh zum Stadtplatz"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Du betretest die Höhle. Du siehst einige Monster.",
  },
  {
    name: "fight",
    "button text": ["Attacke", "Ausweichen", "Rennen"],
    "button functions": [attack, dodge, goTown],
    text: "Du kämpfst gegen ein Monstrum.",
  },
  {
    name: "lose",
    "button text": ["Neustart?", "Neustart?", "Neustart?"],
    "button functions": [restart, restart, restart],
    text: "Du bist tot. &#x2620;",
  },
  {
    name: "win",
    "button text": ["Neustart?", "Neustart?", "Neustart?"],
    "button functions": [restart, restart, restart],
    text: "Der Drache ist besiegt! Du hast gewonnen! &#x1F389;",
  },
  {
    name: "kill monster",
    "button text": [
      "Geh zum Stadtplatz",
      "Geh zum Stadtplatz",
      "Geh zum Stadtplatz",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: "Das Monster schreit „Arg!“ während es stirbt. Du sammelst Erfahrungspunkte und findest Gold.",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Du hast nicht genug Gold, um Gesundheit zu kaufen.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Du hast jetzt eine " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In deinem Inventar hast Du: " + inventory;
    } else {
      text.innerText = "Du hast nicht genug Gold, um eine Waffe zu kaufen.";
    }
  } else {
    text.innerText = "Du hast bereits die stärkste Waffe!";
    button2.innerText = "Verkaufe Waffe für 15 Gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Du hast ein verkauft " + currentWeapon + ".";
    text.innerText += "In deinem Inventar hast Du: " + inventory;
  } else {
    text.innerText = "Verkaufe nicht deine einzige Waffe!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "Der " + monsters[fighting].name + " attackiert dich.";
  text.innerText +=
    " Du greifst es mit deinem " + weapons[currentWeapon].name + " an.";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " Daneben, du honk.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Dein " + inventory.pop() + " geht kaputt.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText =
    "Du weichst den Angriff des " + monsters[fighting].name + " aus";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText =
    "Du hast " + guess + " ausgewählt" + ". Hier sind die Zufallszahlen:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Richtig! Du gewinnst 20 Gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Falsch! Du verlierst 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
