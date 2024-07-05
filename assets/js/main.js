// Variablen initialisieren und deklarieren
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Stock"];

// Buttons und Textelemente aus dem DOM auswählen
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

// Waffen und Monster-Daten
const weapons = [
  { name: "Stock", power: 5 },
  { name: "Dolch", power: 30 },
  { name: "Morgenstern", power: 50 },
  { name: "Schwert", power: 100 },
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

// Orte, Texte und Buttons
const locations = [
  {
    name: "Stadtplatz",
    "button text": ["Geh zum Shop", "Geh zur Höhle", "Bekämpfe den Drachen"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Sie befinden sich auf dem Stadtplatz. Sie sehen ein Schild mit der Aufschrift "Shop“.',
  },
  {
    name: "Shop",
    "button text": [
      "Kaufe 10 Gesundheit (10 Gold)",
      "Waffe kaufen (30 Gold)",
      "Geh zum Stadtplatz",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Du betrittst den Laden.",
  },
  {
    name: "Höhle",
    "button text": ["Der Troll", "Die Spinne", "Geh zum Stadtplatz"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Du betretest die Höhle. Du siehst einige Monster.",
  },
  {
    name: "Kampf",
    "button text": ["Attacke", "Ausweichen", "Rennen"],
    "button functions": [attack, dodge, goTown],
    text: "Du kämpfst gegen ein Monstrum.",
  },
  {
    name: "verlieren",
    "button text": ["Neustart?", "Neustart?", "Neustart?"],
    "button functions": [restart, restart, restart],
    text: "Du bist tot. &#x2620;",
  },
  {
    name: "gewinnen",
    "button text": ["Neustart?", "Neustart?", "Neustart?"],
    "button functions": [restart, restart, restart],
    text: "Der Drache ist besiegt! Du hast gewonnen! &#x1F389;",
  },
  {
    name: "Töte Monster",
    "button text": [
      "Geh zum Stadtplatz",
      "Geh zum Stadtplatz",
      "Geh zum Stadtplatz",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: "Das Monster schreit „Arg!“ während es stirbt. Du sammelst Erfahrungspunkte und findest Gold.",
  },
];

// Initialisiere Buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Funktion zum Aktualisieren der Ansicht basierend auf der aktuellen Location
function update(location) {
  monsterStats.style.display = "";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

// Funktionen zum Wechseln der Locations
function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

// Funktion zum Kauf von Gesundheit
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

// Funktion zum Kauf von Waffen
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Du hast jetzt ein " + newWeapon + ".";
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

// Funktion zum Verkauf von Waffen
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

// Funktionen zum Starten von Kämpfen
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

// Funktion, um den Kampf zu starten und Monster-Stats anzuzeigen
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

// Funktion zum Angriff
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

// Funktion, um den Angriffswert eines Monsters zu erhalten
function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

// Funktion zur Überprüfung, ob das Monster getroffen wird
function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

// Funktion zum Ausweichen
function dodge() {
  text.innerText =
    "Du weichst den Angriff des " + monsters[fighting].name + " aus";
}

// Funktion zum Besiegen eines Monsters
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

// Funktionen für Spielende
function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

// Funktion zum Neustart des Spiels
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Stock"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

// Funktion für ein Easter Egg
function easterEgg() {
  update(locations[7]);
}

// Funktionen für das Zufallsspiel
function pickTwo() {
  pick(2);
}

// Funktion pickEight ruft die Funktion pick mit der Zahl 8 als Argument auf
function pickEight() {
  pick(8);
}

// Funktion pick, die ein Zufallsspiel durchführt
function pick(guess) {
  const numbers = [];

  // Schleife, um 10 Zufallszahlen zwischen 0 und 10 (einschließlich) zu generieren
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  // Text-Element aktualisieren, um die gewählte Zahl und die Zufallszahlen anzuzeigen
  text.innerText =
    "Du hast " + guess + " ausgewählt" + ". Hier sind die Zufallszahlen:\n";

  // Schleife, um jede der 10 Zufallszahlen anzuzeigen
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }

  // Überprüfen, ob die gewählte Zahl in den Zufallszahlen enthalten ist
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
