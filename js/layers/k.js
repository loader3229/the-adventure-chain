addLayer("k", {
    name: "keys",
    symbol: "K",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            bonuses: [
		new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0), new Decimal(0)
            ],
            best: new Decimal(0),
            total: new Decimal(0),
        }
    },
    color: "#CC9933",
    resource: "Keys", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires() {
        return new Decimal(1e45);
    },
    gainMult() {
        let ret = new Decimal(1);
        if (player.b.points.gte(46)) ret = ret.mul(player.b.points.pow(0.75).div(10));
        return ret;
    },
    baseResource: "scraps", // Name of resource prestige is based on
    baseAmount() {
        return player.f.points;
    },
    exponent: 0.2,
    row: 10, // Row the layer is in on the tree (0 is the first row)
    branches: ['j'],
    layerShown() { return player.b.points.gte(44) || player.k.unlocked },
    hotkeys: [
        { key: "k", description: "k: reset for keys", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    effect() {
        let ret = player.k.points.div(2).add(1);
        if (ret.gte(10)) ret = Decimal.pow(10, ret.log10().sqrt().mul(2).sub(1));
        return ret;
    },
    effectDescription() { // Optional text to describe the effects
        let eff = this.effect();
        return "translated to " + format(eff) + "x calm point gain and damage to bosses"
    },
    milestones: [
        {
            requirementDescription: "1 key",
            done() { return player.k.points.gte(1) }, // Used to determine when to give the milestone
            effectDescription: "When you do an I reset or a J reset, you will gain both I and J.",
        },
        {
            requirementDescription: "2 keys",
            done() { return player.k.points.gte(2) }, // Used to determine when to give the milestone
            effectDescription: "+100% Equipment Power.",
        },
        {
            requirementDescription: "4 keys",
            done() { return player.k.points.gte(4) }, // Used to determine when to give the milestone
            effectDescription: "Equipment Shard effect is better.",
        },
        {
            requirementDescription: "8 keys",
            done() { return player.k.points.gte(8) }, // Used to determine when to give the milestone
            effectDescription: "All factory machine speed x2.",
        },
        {
            requirementDescription: "16 keys",
            done() { return player.k.points.gte(16) }, // Used to determine when to give the milestone
            effectDescription: "When you do an I, J or K reset, you will gain I, J and K at once.",
        },
        {
            requirementDescription: "32 keys",
            done() { return player.k.points.gte(32) }, // Used to determine when to give the milestone
            effectDescription: "Calm Buyable 'Calm Buyable Base' is cheaper.",
        },
        {
            requirementDescription: "64 keys",
            done() { return player.k.points.gte(64) }, // Used to determine when to give the milestone
            effectDescription: "Unlock Bonus Boxes.",
        },
    ],

    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text", "K reset is same as I reset except you gain K instead of I. Anything kept in I reset will be kept in K resets."],
                "upgrades",
                "milestones"
            ]
        }, "Bonus Boxes": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text", function(){return "You have "+formatWhole(player.k.bonuses[0])+" Stat Bonuses, multiplying HP gain, ATK, DEF, DMG by "+format(layers.k.getBonus(0))}],
                ["display-text", function(){return "You have "+formatWhole(player.k.bonuses[1])+" EXP Bonuses, multiplying EXP  by "+format(layers.k.getBonus(1))}],
                ["display-text", function(){return "You have "+formatWhole(player.k.bonuses[2])+" Calm Bonuses, multiplying Calm Points by "+format(layers.k.getBonus(2))}],
                ["display-text", function(){return "You have "+formatWhole(player.k.bonuses[3])+" Equipment Shard Bonuses, multiplying Equipment Shard by "+format(layers.k.getBonus(3))}],
                ["display-text", function(){return "You have "+formatWhole(player.k.bonuses[4])+" Factory Bonuses, multiplying all machine speed by "+format(layers.k.getBonus(4))}],
                ["display-text", "You can use your keys to unlock Bonus Boxes now."],
                ["row", [["clickable", "11"]]],
            ], unlocked: function () { return hasMilestone("k", 6) }
        },
    },
    getBonus(id=0){
        let base=[new Decimal(1.1),new Decimal(1.8),new Decimal(2),new Decimal(3),new Decimal(1.5)][id];
        return Decimal.pow(base, player.k.bonuses[id].add(1).log10().sqrt());
    },
    doReset(layer) {
        if (layer == "k") {
            if(hasMilestone("k", 4)){
                addPoints("i", tmp.i.resetGain);
            }
            if(hasMilestone("k", 4)){
                addPoints("j", tmp.j.resetGain);
            }
        }
    },
    clickables: {
        11: {
            title: "Open a box",
            display: function () {
                return "Cost: 1 key";
            },
            canClick(){return player.k.points.gte(1)},
            onClick() {
                if (player.k.points.gte(1)){
			player.k.points = player.k.points.sub(1)
			a = Math.floor(Math.random()*5)
			player.k.bonuses[a] = player.k.bonuses[a].add(1)
		}
            },


        },
},
});
