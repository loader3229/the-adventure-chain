addLayer("k", {
    name: "keys",
    symbol: "K",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
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
        }
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
});
