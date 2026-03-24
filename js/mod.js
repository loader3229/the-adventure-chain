let modInfo = {
    name: "The Adventure Chain",
    id: "the-adventure-chain",
    author: "loader3229",
    pointsName: "HP",
    modFiles: ["layers.js", "layers/a.js", "layers/b.js", "layers/c.js", "layers/d.js", "layers/e.js", "layers/f.js", "layers/g.js", "layers/h.js", "layers/i.js", "layers/j.js", "tree.js"],

	discordName: "loader3229's Discord Server",
	discordLink: "https://discord.gg/jztUReQ2vT",
    initialStartPoints: new Decimal(0), // Used for hard resets and new players
    offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
    num: "10.5",
    name: "Joker",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v10.0</h3><br>
        - Added layer J.<br>
    <h3>v9.0</h3><br>
        - Added layer I.<br>
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

    let gain = getLevel();
    if (hasMilestone("c", 2)) gain = gain.mul(1.1);
    if (player.b.points.gte(18)) gain = gain.mul(1.25);
    if (player.b.points.gte(24)) gain = gain.mul(1.25);
    if (hasMilestone("c", 18)) gain = gain.mul(1.28); // 2.2 
    if (hasMilestone("c", 20)) gain = gain.mul(1.2/1.1); // 2.4
    if (player.b.points.gte(41)) gain = gain.mul(1.25/1.2); // 2.5

    gain = gain.mul(buyableEffect("c", 21));
    if (player.b.points.gte(21)) gain = gain.mul(buyableEffect("h", 12));
    if (player.b.points.gte(30)) gain = gain.mul(1+player.d.challenges[12]/100);
    gain = gain.mul(layers.e.equipmentEff(23));
    if(hasMilestone("i",13))gain = gain.mul(layers.i.infEff());

    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() {
    return {
    }
}

// Display extra things at the top of the page
var displayThings = [
    "Mod Author: loader3229",
    "Endgame: Boss 42 beaten and Level 1024000",
    function () { if(getLevel().gte(200000))return "Level: " + formatWhole(getLevel()) + "/" + formatWhole(getLevelCap()) + " (Scaling: " + format(getLevelScaling()) + ")"; return "Level: " + formatWhole(getLevel()) + "/" + formatWhole(getLevelCap()) + " (" + format(getLevelProgress().mul(100)) + "%)" },
    function () { return "ATK: " + format(getATK()) },
    function () { if (player.b.points.gte(1)) return "DEF: " + format(getDEF()) },
    function () { if (player.b.points.gte(13)) return "DMG: " + format(getDMG()) + "x" }

]

// Determines when the game "ends"
function isEndgame() {
    return player.b.points.gte(42) && getLevel().gte(1024000)
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
    if (hasMilestone("c", 15)) atk = atk.mul(1.6); // 1.76
    if (hasMilestone("c", 20)) atk = atk.mul(1.2/1.1); // 1.92
    if (player.b.points.gte(41)) atk = atk.mul(1.25/1.2); // 2


    atk = atk.mul(buyableEffect("c", 12));

    atk = atk.mul(layers.e.equipmentEff(21));
    if (player.b.points.gte(21)) atk = atk.mul(buyableEffect("h", 12));
    if(hasMilestone("i",14)) atk = atk.mul(layers.i.infEff());
    if (player.b.points.gte(30)) atk = atk.mul(1+player.d.challenges[21]/100);



    if (inChallenge("d", 22)) atk = atk.sqrt();
    return atk;
}

function getDEF() {
    let def = new Decimal(0);
    if (inChallenge("d", 11)) return def;
    if (player.b.points.gte(1)) def = def.add(getLevel().mul(0.05));
    if (player.b.points.gte(21)) def = def.add(getLevel().mul(0.02));
    if (hasMilestone("c", 13)) def = def.add(getLevel().mul(0.01));
    if (hasMilestone("c", 2)) def = def.mul(1.1); // 0.088
    if (hasMilestone("c", 20)) def = def.mul(1.2/1.1); // 0.096
    if (player.b.points.gte(41)) def = def.mul(1.25/1.2); // 0.1

    def = def.mul(buyableEffect("c", 13));

    def = def.mul(layers.e.equipmentEff(22));

    if (player.b.points.gte(21)) def = def.mul(buyableEffect("h", 12));
    if(hasMilestone("i",15)) def = def.mul(layers.i.infEff());
    if (player.b.points.gte(30)) def = def.mul(1+player.d.challenges[11]/100);
    return def;
}

function getDMG() {
    if (inChallenge("d", 21)) return new Decimal(1);

    let dmg = new Decimal(1);
    if (player.b.points.gte(13)) dmg = dmg.add(getLevel().mul(0.0001));
    if (player.b.points.gte(19)) dmg = dmg.mul(1.1);
    if (player.b.points.gte(33)) dmg = dmg.mul(1.6); // 0.000176
    if (hasMilestone("c", 20)) dmg = dmg.mul(1.2/1.1); // 0.000192
    if (player.b.points.gte(41)) dmg = dmg.mul(1.25/1.2); // 0.0002

    dmg = dmg.mul(buyableEffect("c", 32));

    dmg = dmg.mul(layers.e.equipmentEff(24));

    if (player.b.points.gte(21)) dmg = dmg.mul(buyableEffect("h", 12));
    if(hasMilestone("i",16)) dmg = dmg.mul(layers.i.infEff());
    if (player.b.points.gte(30)) dmg = dmg.mul(1+player.d.challenges[22]/100);


    return dmg;
}

function getLevel() {
    return getRealLevel().floor();
}

function getLevelCap() {
    if (player.sac.points.gte(5)) return new Decimal(196000).add(player.i.points.pow(1.5).mul(10).floor().min(3900000));
    if (player.sac.points.gte(4)) return new Decimal(110000).add(player.i.points.pow(1.8).mul(10).floor().min(914000));
    if (player.sac.points.gte(3)) return new Decimal(100000).add(player.i.points.pow(2).mul(10).min(156000));
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
    if (inChallenge("d",31))return new Decimal(player.b.points.gte(40)?0.05:0.03);
    let scaling = new Decimal(1);
    if (hasMilestone("c", 6)) scaling = scaling.add(hasUpgrade("c", 31) ? 1 : 0.2);
    if (hasMilestone("c", 7) && player.sac.points.gte(2)) scaling = scaling.add((hasUpgrade("c", 35) && player.sac.points.gte(4)) ? 2 : 0.5);
    if(player.sac.points.gte(5))scaling = scaling.mul(2);
    if (getClickableState("i",32) == 1) scaling = scaling.add(2);
    if (player.b.points.gte(40)) scaling = scaling.add(player.b.points.div(10).pow(2));
    else if (player.b.points.gte(29)) scaling = scaling.add(player.b.points.div(11.5).pow(2));
    else if (player.b.points.gte(16)) scaling = scaling.add(player.b.points.div(16).pow(2));
    else if (player.b.points.gte(13)) scaling = scaling.add(player.b.points.mul(0.05));
    else if (player.b.points.gte(7)) scaling = scaling.add(player.b.points.sub(5).mul(0.05));
    scaling = scaling.add(buyableEffect("c", 22));
    scaling = scaling.add(layers.e.equipmentEff(11));
    return scaling;
}
function getRealLevel() {

    let scaling = getLevelScaling();

    if (player.sac.points.gte(5)) {
        let level = player.a.points.pow(0.06).div(25).div(getLevelScaling().sqrt()).add(1).log(1.04).mul(getLevelScaling().sqrt()).pow(2).add(1);
        if (player.a.points.pow(0.12).lte(scaling)) level = player.a.points.pow(0.12).add(1);
        return level;
    }
    if (player.sac.points.gte(4)) {
        let level = player.a.points.pow(0.0625).div(25).div(getLevelScaling().sqrt()).add(1).log(1.04).mul(getLevelScaling().sqrt()).pow(2).add(1);
        if (player.a.points.pow(0.125).lte(scaling)) level = player.a.points.pow(0.125).add(1);
	level = softcap(level, new Decimal(hasMilestone("j", 10)?5e5:hasMilestone("j", 4)?4e5:3e5), hasMilestone("j", 6)?0.8:0.4).min(getLevelCap());
        return level;
    }
    if (player.sac.points.gte(3)) {
        let level = player.a.points.pow(0.075).div(16).div(scaling.sqrt()).add(1).log(1.0625).mul(scaling.sqrt()).pow(2).add(1);
        if (player.a.points.pow(0.15).lte(scaling)) level = player.a.points.pow(0.15).add(1);
	level = softcap(level, new Decimal(1e5), hasMilestone("i", 12)?1:hasMilestone("i", 9)?0.4:0.2).min(getLevelCap());
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