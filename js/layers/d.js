addLayer("d", {
    name: "domain", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#999999",
    resource: "Domain Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 3, // Row the layer is in on the tree (0 is the first row)
    branches: ['c'],
    layerShown() { return player.b.points.gte(6) || player.d.unlocked },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                ["display-text", "Entering a domain will force a calm reset. EXP passive gain is reduced in domains."],
                "challenges"
            ]
        }
    },
    challenges: {
        11: {
            name: "Defenseless",
            challengeDescription() { return "Your DEF is 0.<br>Completions: "+formatWhole(player.d.challenges[11])+"/10"; },
            goal() { return Decimal.pow(1.1,player.d.challenges[11]).mul(600); },
            goalDescription(){return "Reach Level " + formatWhole(this.goal().ceil());},
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            onEnter() { doReset("c", true); },
            completionLimit: 10,
            rewardDescription: "1 domain point per completion."
        },
        12: {
            name: "Glass Cannon",
            challengeDescription() { return "You will have 100 HP at the start of the domain, but you can't gain more.<br>Completions: "+formatWhole(player.d.challenges[12])+"/10"; },
            goal() { return Decimal.pow(1.1,player.d.challenges[12]).mul(500); },
            goalDescription(){return "Reach Level " + formatWhole(this.goal().ceil());},
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit: 10,
            rewardDescription: "1 domain point per completion.",
            onEnter(){
                doReset("c", true);
                player.points=new Decimal(100);
            }
        },

    },
    update(diff) {
        if (player.b.points.gte(6)) player.d.unlocked = true;
        player.d.points=new Decimal(player.d.challenges[11]).add(player.d.challenges[12]);
    },
	effect() {
		let ret = Decimal.pow(1.1,player.d.points);
		return ret;
	},
	effect2() {
		let ret = player.d.points.pow(1.5).add(1);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
		let eff = this.effect();
		let eff2 = this.effect2();
		return "translated to a " + format(eff) + "x multiplier to Calm Point gain and " + format(eff2) + "x multiplier to Boss Damage";
	},

})
