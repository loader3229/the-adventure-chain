let modInfo = {
    name: "The Adventure Chain",
    id: "the-adventure-chain",
    author: "loader3229",
    pointsName: "HP",
    modFiles: ["layers.js", "layers/a.js", "layers/b.js", "layers/c.js", "layers/d.js", "layers/e.js", "layers/f.js", "layers/g.js", "layers/h.js", "tree.js"],

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(0), // Used for hard resets and new players
    offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
    num: "8.0",
    name: "Helper",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v8.0</h3><br>
        - Added layer H.<br>
    <h3>v7.0</h3><br>
        - Added layers F and G.<br>
    <h3>v5.0</h3><br>
        - Added Equipments.<br>
    <h3>v4.0</h3><br>
        - Added Domains.<br>
    <h3>v3.1</h3><br>
        - Added Calm buyables.<br>
        - Added Calm upgrades.<br>
    <h3>v3.0</h3><br>
        - Added Calm Points.<br>
        - Added hotkeys for A,B,C.<br>
    <h3>v2.0</h3><br>
        - Added Bosses.<br>
    <h3>v1.0</h3><br>
        - Added Adventure.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints() {
    if (inChallenge("d", 12)) return false;
    return true
}

// Calculate points/sec!
function getPointGen() {
    if (!canGenPoints())
        return new Decimal(0)

    let gain = getLevel()
    if (hasMilestone("c", 2)) gain = gain.mul(1.1);
    gain = gain.mul(buyableEffect("c", 21));
    if (player.b.points.gte(18)) gain = gain.mul(1.25);
    if (player.b.points.gte(24)) gain = gain.mul(1.25);
    gain = gain.mul(layers.e.equipmentEff(23));

    if (player.b.points.gte(21)) gain = gain.mul(buyableEffect("h", 12));

    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
    return {
    }
}

// Display extra things at the top of the page
var displayThings = [
    "Endgame: Boss 24 beaten and Level 64000",
    function () { return "Level: " + formatWhole(getLevel()) + "/" + formatWhole(getLevelCap()) + " (" + format(getLevelProgress().mul(100)) + "%)" },
    function () { return "ATK: " + format(getATK()) },
    function () { if (player.b.points.gte(1)) return "DEF: " + format(getDEF()) },
    function () { if (player.b.points.gte(13)) return "DMG: " + format(getDMG()) + "x" }

]

// Determines when the game "ends"
function isEndgame() {
    return player.b.points.gte(24) && getLevel().gte(64000)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
    return (3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
    if (parseInt(oldVersion.split(".")[0]) < 7) player.b.hp = layers.b.getBossHP(), player.b.y = player.b.points.add(10);
}

function getATK() {
    if (inChallenge("d", 21)) return new Decimal(1);
    let atk = getLevel();
    if (hasMilestone("c", 2)) atk = atk.mul(1.1);
    atk = atk.mul(buyableEffect("c", 12));

    atk = atk.mul(layers.e.equipmentEff(21));
    if (player.b.points.gte(21)) atk = atk.mul(buyableEffect("h", 12));


    if (inChallenge("d", 22)) atk = atk.sqrt();
    return atk;
}

function getDEF() {
    let def = new Decimal(0);
    if (inChallenge("d", 11)) return def;
    if (player.b.points.gte(1)) def = def.add(getLevel().mul(0.05));
    if (player.b.points.gte(21)) def = def.add(getLevel().mul(0.02));
    if (hasMilestone("c", 13)) def = def.add(getLevel().mul(0.01));
    if (hasMilestone("c", 2)) def = def.mul(1.1);
    def = def.mul(buyableEffect("c", 13));

    def = def.mul(layers.e.equipmentEff(22));

    if (player.b.points.gte(21)) def = def.mul(buyableEffect("h", 12));
    return def;
}

function getDMG() {
    if (inChallenge("d", 21)) return new Decimal(1);

    let dmg = new Decimal(1);
    if (player.b.points.gte(13)) dmg = dmg.add(getLevel().mul(0.0001));
    if (player.b.points.gte(19)) dmg = dmg.mul(1.1);
    dmg = dmg.mul(buyableEffect("c", 32));

    dmg = dmg.mul(layers.e.equipmentEff(24));

    if (player.b.points.gte(21)) dmg = dmg.mul(buyableEffect("h", 12));

    return dmg;
}

function getLevel() {
    return getRealLevel().floor();
}

function getLevelCap() {
    if (player.sac.points.gte(2)) return new Decimal(64000);
    if (player.sac.points.gte(1)) return new Decimal(16000);
    if (player.b.points.gte(10)) return new Decimal(4000);
    if (player.b.points.gte(8)) return new Decimal(3000);
    if (hasMilestone("c", 3)) return new Decimal(2000);
    return new Decimal(1000);
}

function getLevelProgress() {
    return getRealLevel().sub(getLevel());
}

function getLevelScaling() {
    let scaling = new Decimal(1);
    if (hasMilestone("c", 6)) scaling = scaling.add(hasUpgrade("c", 31) ? 1 : 0.2);
    if (hasMilestone("c", 7) && player.sac.points.gte(2)) scaling = scaling.add(0.5);
    if (player.b.points.gte(16)) scaling = scaling.add(player.b.points.div(16).pow(2));
    else if (player.b.points.gte(13)) scaling = scaling.add(player.b.points.mul(0.05));
    else if (player.b.points.gte(7)) scaling = scaling.add(player.b.points.sub(5).mul(0.05));
    scaling = scaling.add(buyableEffect("c", 22));
    scaling = scaling.add(layers.e.equipmentEff(11));
    return scaling;
}
function getRealLevel() {

    let scaling = getLevelScaling();

    if (player.sac.points.gte(3)) {
        let level = player.a.points.pow(0.075).div(16).div(scaling.sqrt()).add(1).log(1.0625).mul(scaling.sqrt()).pow(2).add(1);
        if (player.a.points.pow(0.15).lte(scaling.sqrt())) level = player.a.points.pow(0.15).add(1);
        level = level.min(256000);
        return level;
    }
    if (player.sac.points.gte(2)) {
        let level = player.a.points.pow(1 / 12).div(12.5).div(softcap(scaling.sqrt(), new Decimal(player.b.points.gte(21) ? player.b.points.mul(0.1).add(1) : 3))).add(1).log(1.08).mul(softcap(scaling.sqrt(), new Decimal(player.b.points.gte(21) ? player.b.points.mul(0.1).add(1) : 3))).pow(2).add(1);
        if (player.a.points.pow(1 / 6).lte(softcap(scaling.sqrt(), new Decimal(player.b.points.gte(21) ? player.b.points.mul(0.1).add(1) : 3)).pow(2))) level = player.a.points.pow(1 / 6).add(1);
        level = level.min(64000);
        return level;
    }
    if (player.sac.points.gte(1)) {
        let level = player.a.points.pow(0.2).div(200).div(scaling).add(1).log(1.005).mul(scaling).add(1);
        if (hasMilestone("c", 7)) level = player.a.points.pow(0.2).div(250).div(scaling).add(1).log(1.004).mul(scaling).add(1);
        if (player.a.points.pow(0.2).lte(scaling)) level = player.a.points.pow(0.2).add(1);
        level = level.min(16000);
        return level;
    }
    if (hasMilestone("c", 3)) {
        let level = player.a.points.cbrt().div(100).div(scaling).add(1).log(1.01).mul(scaling).add(1);
        if (player.a.points.cbrt().lte(scaling)) level = player.a.points.cbrt().add(1);
        if (level.gte(1225)) level = level.sqrt().mul(35);
        level = level.min(2000);
        if (player.b.points.gte(8)) {
            let level2 = player.a.points.pow(0.25).div(player.b.points.gte(10) ? 250 : 200).div(scaling).add(1).log(1.001).mul(scaling).div(player.b.points.gte(10) ? 4 : 5).add(1);
            if (player.a.points.pow(0.25).lte(scaling.div(player.b.points.gte(10) ? 4 : 5))) level2 = player.a.points.pow(0.25).add(1);
            if (level2.gte(3600)) level2 = level2.sqrt().mul(60);
            level2 = level2.min(player.b.points.gte(10) ? 4000 : 3000);
            level = level.max(level2);
        }
        return level;
    }
    return player.a.points.cbrt().add(100).log10().sub(2).mul(200).add(1).min(1000);
}