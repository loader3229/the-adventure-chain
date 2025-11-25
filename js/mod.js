let modInfo = {
	name: "The Adventure Chain",
	id: "the-adventure-chain",
	author: "loader3229",
	pointsName: "HP",
	modFiles: ["layers/a.js", "layers/b.js", "layers/c.js", "layers/d.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "3.1",
	name: "Calm Points",
}

let changelog = `<h1>Changelog:</h1><br>
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

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = getLevel()
	if(hasMilestone("c",2))gain = gain.mul(1.1);
gain = gain.mul(buyableEffect("c",21));

	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return "Level: "+formatWhole(getLevel())+" ("+format(getLevelProgress().mul(100))+"%)"},
	function(){return "ATK: "+format(getATK())},
	function(){if(player.b.points.gte(1))return "DEF: "+format(getDEF())}

]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function getATK(){
	let atk=getLevel();
	if(hasMilestone("c",2))atk = atk.mul(1.1);
atk = atk.mul(buyableEffect("c",12));

	return atk;
}

function getDEF(){
	let def=new Decimal(0);
	if(inChallenge("d",11))return def;
	if(player.b.points.gte(1))def = getLevel().mul(0.05);
	if(hasMilestone("c",2))def = def.mul(1.1);
def = def.mul(buyableEffect("c",13));

	return def;
}

function getLevel(){
	return getRealLevel().floor();
}

function getLevelProgress(){
	return getRealLevel().sub(getLevel());
}

function getRealLevel(){
	if(hasMilestone("c",3)){
		let tmp=new Decimal(1);
		if(hasMilestone("c",6))tmp = tmp.add(0.2);
		tmp = tmp.add(buyableEffect("c",22));
		if(player.a.points.lte(tmp))return player.a.points.cbrt().add(1);
		return player.a.points.cbrt().div(100).div(tmp).add(1).log(1.01).mul(tmp).add(1);
	}
	return player.a.points.cbrt().add(100).log10().sub(2).mul(200).add(1);
}