addLayer("j", {
    name: "joker",
    symbol: "J",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#993300",
    resource: "Jokers", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires() {
        return new Decimal(1e40);
    },
    gainMult() {
        let ret = new Decimal(1);
        if (hasMilestone("j", 2)) ret = ret.mul(player.i.points.add(1).pow(0.1));
        if (hasUpgrade("g", 31)) ret = ret.mul(1.5);
        if (player.b.points.gte(36)) ret = ret.mul(player.b.points.sqrt().div(3));
        if (getClickableState("i", 41) == 1) ret = ret.mul(2);
        return ret;
    },
    baseResource: "calm points", // Name of resource prestige is based on
    baseAmount() {
        return player.c.points;
    },
    exponent: 0.2,
    row: 9, // Row the layer is in on the tree (0 is the first row)
    branches: ['i'],
    layerShown() { return player.b.points.gte(34) || player.j.unlocked },
    hotkeys: [
        { key: "j", description: "j: reset for jokers", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    effect() {
        let ret = player.j.points.div(2).add(1);
        if (ret.gte(10)) ret = Decimal.pow(10, ret.log10().sqrt().mul(2).sub(1));
        if (player.sac.points.gte(5) && hasMilestone("j", 6) && ret.gte(10)) ret = Decimal.pow(10, player.j.points.add(1).log10().sqrt().mul(2).sub(0.8));
        if (player.sac.points.gte(5) && hasMilestone("j", 12) && ret.gte(10)) ret = Decimal.pow(10, player.j.points.add(1).log10().sqrt().mul(2).sub(0.6));
        if (player.sac.points.gte(5) && hasMilestone("j", 13) && ret.gte(10)) ret = Decimal.pow(10, player.j.points.add(1).log10().sqrt().mul(2).sub(0.3));
        if (player.sac.points.gte(5) && hasMilestone("j", 14)) ret = Decimal.pow(10, player.j.points.add(1).log10().sqrt().mul(2));
        ret = ret.sqrt();
        return ret;
    },
    effectDescription() { // Optional text to describe the effects
        let eff = this.effect();
        return "translated to /" + format(eff) + " normal enemy stats and boss ATK"
    },
    milestones: [
        {
            requirementDescription: "1 joker",
            done() { return player.j.points.gte(1) }, // Used to determine when to give the milestone
            effectDescription: "Autobuy Tier 1/2 machines, and buying them doesn't reduce your resources.",
        },
        {
            requirementDescription: "2 jokers",
            done() { return player.j.points.gte(2) }, // Used to determine when to give the milestone
            effectDescription: "Auto-helper formula is better.",
        },
        {
            requirementDescription: "4 jokers",
            done() { return player.j.points.gte(4) }, // Used to determine when to give the milestone
            effectDescription: "Imaginary points boost jokers.",
        },
        {
            requirementDescription: "8 jokers",
            done() { return player.j.points.gte(8) }, // Used to determine when to give the milestone
            effectDescription: "Simple Forge is better.",
        },
        {
            requirementDescription: "16 jokers",
            done() { return player.j.points.gte(16) }, // Used to determine when to give the milestone
            effectDescription() {
                if (player.sac.points.gte(5)) return "Autobuy and sell equipments.";
                return "Post-300k level scaling starts 100k later.";
            },
        },
        {
            requirementDescription: "32 jokers",
            done() { return player.j.points.gte(32) }, // Used to determine when to give the milestone
            effectDescription: "Stat Helper's effect is better.",
        },
        {
            requirementDescription: "64 jokers",
            done() { return player.j.points.gte(64) }, // Used to determine when to give the milestone
            effectDescription() {
                if (player.sac.points.gte(5)) return "Joker effect is better.";
                return "Post-300k level scaling is weaker.";
            },
        },
        {
            requirementDescription: "128 jokers",
            done() { return player.j.points.gte(128) }, // Used to determine when to give the milestone
            effectDescription: "Autobuy increase machine max tier, and it is cheaper, buying it doesn't reduce your Equipment Shard.",
        },
        {
            requirementDescription: "256 jokers",
            done() { return player.j.points.gte(256) }, // Used to determine when to give the milestone
            effectDescription: "Calm Gem's effect is better.",
        },
        {
            requirementDescription: "512 jokers",
            done() { return player.j.points.gte(512) }, // Used to determine when to give the milestone
            effectDescription: "Jokers boost Imaginary points.",
        },
        {
            requirementDescription: "1024 jokers",
            done() { return player.j.points.gte(1024) }, // Used to determine when to give the milestone
            effectDescription() {
                if (player.sac.points.gte(5)) return "+10 Max Domain Completions";
                return "Post-300k level scaling starts 100k later.";
            },
        },
        {
            requirementDescription: "2048 jokers",
            done() { return player.j.points.gte(2048) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "The 8th gold upgrade is slightly better.",
        },
        {
            requirementDescription: "4096 jokers",
            done() { return player.j.points.gte(4096) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Joker effect is better.",
        },
        {
            requirementDescription: "8192 jokers",
            done() { return player.j.points.gte(8192) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Joker effect is better.",
        },
        {
            requirementDescription: "16384 jokers",
            done() { return player.j.points.gte(16384) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Joker effect is better.",
        },
        {
            requirementDescription: "32768 jokers",
            done() { return player.j.points.gte(32768) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Post-1.5M level scaling starts later.",
        },
        {
            requirementDescription: "65536 jokers",
            done() { return player.j.points.gte(65536) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Post-1.5M level scaling is weaker.",
        },
        {
            requirementDescription: "131072 jokers",
            done() { return player.j.points.gte(131072) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "EXP helper is cheaper.",
        },

    ],

    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text", "J reset is same as I reset except you gain J instead of I. Anything kept in I reset will be kept in J resets."],
                "upgrades",
                "milestones"
            ]
        }
    },
    doReset(layer) {
        if (layer == "j") {
            if(hasMilestone("k", 0)){
                addPoints("i", tmp.i.resetGain);
            }
            if(hasMilestone("k", 4)){
                addPoints("k", tmp.k.resetGain);
            }
        }
    },
});
