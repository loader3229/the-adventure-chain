addLayer("j", {
    name: "joker",
    symbol: "J",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            unused: new Decimal(0),
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
        if (getClickableState("i", 62) == 1) ret = ret.mul(2);
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
            effectDescription() {
                if (player.sac.points.gte(6)) return "Stat Helper is cheaper.";
                return "Post-1.5M level scaling starts 100k later.";
            },
        },
        {
            requirementDescription: "65536 jokers",
            done() { return player.j.points.gte(65536) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription() {
                if (player.sac.points.gte(6)) return "Equipment Helper is cheaper.";
                return "Post-1.5M level scaling is weaker.";
            },
        },
        {
            requirementDescription: "131072 jokers",
            done() { return player.j.points.gte(131072) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "EXP helper is cheaper.",
        },
        {
            requirementDescription: "262144 jokers",
            done() { return player.j.points.gte(262144) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Calm point gain is better.",
        },
        {
            requirementDescription: "524288 jokers",
            done() { return player.j.points.gte(524288) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Gain 20% of Imaginary Point gain per second.",
        },
        {
            requirementDescription: "1048576 jokers",
            done() { return player.j.points.gte(1048576) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Calm Helper is better.",
        },
        {
            requirementDescription: "2097152 jokers",
            done() { return player.j.points.gte(2097152) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Respawn Helper is cheaper.",
        },
        {
            requirementDescription: "4194304 jokers",
            done() { return player.j.points.gte(4194304) && player.sac.points.gte(5) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Machine max tier is cheaper.",
        },
        {
            requirementDescription: "8388608 jokers",
            done() { return player.j.points.gte(8388608) && player.sac.points.gte(6) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(6) },
            effectDescription: "Helper Points boost Auto Helper.",
        },
        {
            requirementDescription: "16777216 jokers",
            done() { return player.j.points.gte(16777216) && player.sac.points.gte(6) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(6) },
            effectDescription: "Autobuy Simple Forge.",
        },
        {
            requirementDescription: "33554432 jokers",
            done() { return player.j.points.gte(33554432) && player.sac.points.gte(6) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(6) },
            effectDescription: "Autobuy Advanced Forge.",
        },
        {
            requirementDescription: "67108864 jokers",
            done() { return player.j.points.gte(67108864) && player.sac.points.gte(6) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(6) },
            effectDescription: "Post-4M level scaling starts later.",
        },

    ],

    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text", "J reset is same as I reset except you gain J instead of I. Anything kept in I reset will be kept in J resets."],
                "milestones"
            ]
        }, "Cards": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["buyable",11],"blank",
                ["display-text", function(){return "You have "+formatWhole(player.j.unused)+" Unused Cards."}],"blank",
                ["clickable",11],"blank",
                "upgrades",
            ], unlocked: function () { return player.b.points.gte(52) }
        },
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
    clickables: {
        11: {
            title() {
                return "Respec Cards"
            },
            display() {
                return "Force Joker Reset";
            },
            canClick() {
                return true;
            },
            onClick() {
                player.j.upgrades=[];
                doReset("j", true);
            },
            unlocked: true,
        },
   },
   buyables: {
	11:  {
            title() {
                return "Card";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Amount: " +formatWhole(player[this.layer].unused)+" / " + formatWhole(player[this.layer].buyables[this.id]) + "<br>" +
                    "Cost: " + format(data.cost) + " Jokers";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(4, a.add(10));
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
		player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            }
        },

	},
  getCardLevel(x){
    return player.j.upgrades.filter(function(a){return a>=x*10 && a < (x+1)*10}).length;
  },
  upgrades: {
        11: {
	title: "♠A",
            description: "EXP gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",
        },
        12: {
	title: "♥A",
            description: "EXP gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",
        },
        13: {
	title: "♦A",
            description: "EXP gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",unlocked: false,
        },
        14: {
	title: "♣A",
            description: "EXP gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",unlocked: false,
        },
        21: {
	title: "♠2",
            description: "Deal 2x damage to bosses.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",
        },
        22: {
	title: "♥2",
            description: "Deal 2x damage to bosses.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",
        },
        23: {
	title: "♦2",
            description: "Deal 2x damage to bosses.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",unlocked: false,
        },
        24: {
	title: "♣2",
            description: "Deal 2x damage to bosses.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",unlocked: false,
        },
        31: {
	title: "♠3",
            description: "Calm Point gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",
        },
        32: {
	title: "♥3",
            description: "Calm Point gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",
        },
        33: {
	title: "♦3",
            description: "Calm Point gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",unlocked: false,
        },
        34: {
	title: "♣3",
            description: "Calm Point gain x2.",
            cost() { return new Decimal(1); },
            currencyLayer: "j",
            currencyDisplayName: "Unused Card",
            currencyInternalName: "unused",unlocked: false,
        },
  },
   update(diff){
player.j.unused = player.j.buyables[11].sub(player.j.upgrades.length);
if(player.j.unused.lt(0)){
player.j.upgrades=[];
                doReset("j", true);
}
    },
   

});
