addLayer("c", {
    name: "calm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#66FF66",
    resource: "Calm Points", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires() {
        if (player.sac.points.gte(3)) return new Decimal(1);
        if (player.sac.points.gte(2)) return new Decimal(10);
        if (player.sac.points.gte(1)) return new Decimal(20);
        return new Decimal(100);
    },
    exponent() {
        let ret = new Decimal(2);
        if (hasMilestone("c", 5)) ret = ret.add(player.sac.points.gte(1) ? 0.1 : 0.6);
        if (player.b.points.gte(5) && player.sac.points.lte(2)) ret = ret.add(player.sac.points.gte(2) ? 0.1 : 0.4);
        return ret;
    },
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {
        return getLevel();
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    branches: ['b'],
    layerShown() { return player.b.points.gte(3) || player.c.unlocked },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones"
            ]
        }, "Buyables": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",

                "buyables"
            ], unlocked: function () { return hasMilestone("c", 4) }
        }
    },
    roundUpCost: true,
    hotkeys: [
        { key: "c", description: "c: reset for calm points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    gainMult() {
        let ret = new Decimal(1);
        if (player.b.points.gte(4)) ret = ret.mul(player.b.points);
        ret = ret.mul(buyableEffect("c", 11));
        if (hasUpgrade("c", 11)) ret = ret.mul(upgradeEffect("c", 11));
        if (hasUpgrade("g", 11)) ret = ret.mul(upgradeEffect("g", 11));
        ret = ret.mul(layers.d.effect());
        ret = ret.mul(layers.e.equipmentEff(14));
        ret = ret.mul(layers.f.effect());
        if (player.sac.points.gte(3)) ret = ret.div(1000);
        else if (player.sac.points.gte(1)) ret = ret.div(12);
        return ret;
    },
    effect() {
        let ret = player.c.points.add(1);
        if (ret.gte(10)) ret = Decimal.pow(10, ret.log10().sqrt().mul(2).sub(1));
        if (hasUpgrade("c", 35)) ret = Decimal.pow(10, player.c.points.add(1).log10().sqrt().mul(2));
        return ret;
    },
    effectDescription() { // Optional text to describe the effects
        let eff = this.effect();
        return "translated to a " + format(eff) + "x multiplier to EXP gain"
    },
    milestones: [
        {
            requirementDescription: "1 calm point",
            done() { return player.c.points.gte(1) }, // Used to determine when to give the milestone
            effectDescription: "Gain more EXP from enemies.",
        },
        {
            requirementDescription: "5 calm points",
            done() { return player.c.points.gte(5) }, // Used to determine when to give the milestone
            effectDescription: "Passively gain EXP based on your level.",
        },
        {
            requirementDescription: "20 calm points",
            done() { return player.c.points.gte(20) }, // Used to determine when to give the milestone
            effectDescription: "1.1x HP gain, ATK and DEF.",
        },
        {
            requirementDescription: "100 calm points",
            done() { return player.c.points.gte(100) }, // Used to determine when to give the milestone
            effectDescription() {
                if (player.sac.points.gte(1)) return "Gain more EXP from enemies.";
                return "Reduce level requirement and increase level cap.";
            },
        },
        {
            requirementDescription: "300 calm points",
            done() { return player.c.points.gte(300) }, // Used to determine when to give the milestone
            effectDescription: "Unlock calm buyables.",
        },
        {
            requirementDescription: "1000 calm points",
            done() { return player.c.points.gte(1000) }, // Used to determine when to give the milestone
            effectDescription: "Calm point gain is better.",
        },
        {
            requirementDescription: "4000 calm points",
            done() { return player.c.points.gte(4000) }, // Used to determine when to give the milestone
            effectDescription: "Reduce level requirement.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(3)) return "1e5 calm points"; if (player.sac.points.gte(2)) return "1e6 calm points"; return "1e14 calm points"; },
            done() { return (player.c.points.gte(1e14) && player.sac.points.gte(1)) || (player.c.points.gte(1e6) && player.sac.points.gte(2)) || (player.c.points.gte(1e5) && player.sac.points.gte(3)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(1) },
            effectDescription: "Reduce level requirement.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(2)) return "1e8 calm points"; return "1e16 calm points"; },
            done() { return (player.c.points.gte(1e16) && player.sac.points.gte(1)) || (player.c.points.gte(1e8) && player.sac.points.gte(2)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(1) },
            effectDescription: "Scrap effect boost EXP.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(2)) return "1e11 calm points"; return "1e18 calm points"; },
            done() { return (player.c.points.gte(1e18) && player.sac.points.gte(1)) || (player.c.points.gte(1e11) && player.sac.points.gte(2)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(1) },
            effectDescription: "Gain more EXP from enemies.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(2)) return "1e14 calm points"; return "1e20 calm points"; },
            done() { return (player.c.points.gte(1e20) && player.sac.points.gte(1)) || (player.c.points.gte(1e14) && player.sac.points.gte(2)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(1) },
            effectDescription: "Gain more EXP from enemies.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(3)) return "1e17 calm points"; return "1e18 calm points"; },
            done() { return (player.c.points.gte(1e18) && player.sac.points.gte(2)) || (player.c.points.gte(1e17) && player.sac.points.gte(3)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(2) },
            effectDescription: "Gain more EXP from enemies.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(3)) return "1e20 calm points"; return "1e21 calm points"; },
            done() { return (player.c.points.gte(1e21) && player.sac.points.gte(2)) || (player.c.points.gte(1e20) && player.sac.points.gte(3)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(2) },
            effectDescription: "Scrap effect is better.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(3)) return "1e23 calm points"; return "1e24 calm points"; },
            done() { return (player.c.points.gte(1e24) && player.sac.points.gte(2)) || (player.c.points.gte(1e23) && player.sac.points.gte(3)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(2) },
            effectDescription: "+0.01 DEF per level.",
        },
        {
            requirementDescription() { if (player.sac.points.gte(3)) return "1e26 calm points"; return "1e29 calm points"; },
            done() { return (player.c.points.gte(1e29) && player.sac.points.gte(2)) || (player.c.points.gte(1e26) && player.sac.points.gte(3)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(2) },
            effectDescription: "+50% Equipment Power.",
        },
    ],
    update(diff) {
        if (hasMilestone("c", 1)) player.a.points = player.a.points.add(getLevel().pow(player.d.activeChallenge ? 0.5 : 2).pow(player.sac.points.gte(1) ? 1.75 : 1).mul(diff).mul(layers.a.gainMult()));
    },
    upgrades: {
        11: {
            description: "Each calm upgrade double calm point gain.",
            cost: new Decimal(1e4),
            effect: function () { return Decimal.pow(2, player.c.upgrades.length) },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
        12: {
            description: "Unlock a new calm buyable.",
            cost: new Decimal(1e5)
        },
        13: {
            description: "Deal more damage to bosses based on calm upgrades.",
            cost: new Decimal(1e6),
            effect: function () { return Decimal.pow(2, player.c.upgrades.length) },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
        14: {
            description: "Unlock a new calm buyable.",
            cost: new Decimal(1e7),
            unlocked() { return player.b.points.gte(7) }
        },
        15: {
            description() { if (player.sac.points.gte(3)) return "Equipment shard effect is better."; return "Unlock a new equipment type, equipment shard effect is better."; },
            cost() { if (player.sac.points.gte(3)) return new Decimal(1e9); return new Decimal(3e8) },
            unlocked() { return player.e.unlocked }
        },
        21: {
            description: "Unlock a new domain. Domain Points reduce damage taken when attacking boss.",
            cost: new Decimal(1e10),
            unlocked() { return player.e.unlocked },
            effect: function () { return player.d.points.mul(0.05).add(1) },
            effectDisplay: function () { return "/" + format(upgradeEffect(this.layer, this.id)) }
        },
        22: {
            description() { if (player.sac.points.gte(3)) return "Unlock a new calm buyable."; return "Unlock a new equipment type and a new calm buyable."; },
            cost: new Decimal(3e11),
            unlocked() { return player.e.unlocked },
        },
        23: {
            description: "Unlock more tiers of machines.",
            cost: new Decimal(2e13),
            unlocked() { return player.f.unlocked },
        },
        24: {
            description: "Equipment Power +50% for new equipments.",
            cost: new Decimal(5e14),
            unlocked() { return player.f.unlocked },
        },
        25: {
            description: "Scrap effect is better.",
            cost: new Decimal(3e10),
            unlocked() { return player.sac.points.gte(1) },
        },
        31: {
            description: "4000 Calm Points milestone is better.",
            cost: new Decimal(1e17),
            unlocked() { return player.b.points.gte(13) }
        },
        32: {
            description: "Increase max domain completions.",
            cost: new Decimal(3e18),
            unlocked() { return player.b.points.gte(13) }
        },
        33: {
            description: "Level Gem and Calm Gem effects are better.",
            cost: new Decimal(4e20),
            unlocked() { return player.b.points.gte(13) }
        },
        34: {
            description: "Unlock a new domain.",
            cost: new Decimal(2e22),
            unlocked() { return player.b.points.gte(16) }
        },
        35: {
            description: "Calm Point effect is better.",
            cost: new Decimal(1e24),
            unlocked() { return player.b.points.gte(16) }
        },
        41: {
            description: "Unlock a new calm buyable.",
            cost: new Decimal(1e26),
            unlocked() { return player.sac.points.gte(2) },
        },
        42: {
            description: "You can let enemies drop equipment shards instead of equipments in adventure. Equipment shards drop in this mode is more than equipment shards from equipments.",
            cost: new Decimal(1e28),
            unlocked() { return player.sac.points.gte(2) },
        },
        43: {
            description: "Unlock a new calm buyable.",
            cost: new Decimal(3e29),
            unlocked() { return player.sac.points.gte(2) },
        },
        44: {
            description: "HP gain, ATK, DEF and DMG calm buyables are cheaper.",
            cost: new Decimal(3e31),
            unlocked() { return player.sac.points.gte(2) },
        },
    },
    buyables: {
        11: {
            title() {
                return "Calm Point";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Calm Point gain x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a).mul(100);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id]);
                if (player.sac.points.gte(3)) eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(2));
                return eff;
            }
        },
        12: {
            title() {
                return "ATK";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "ATK x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(hasUpgrade("c", 44) ? 1 : 100);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
                return eff;
            }
        },
        13: {
            title() {
                return "DEF";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "DEF x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(hasUpgrade("c", 44) ? 1.5 : 150);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
                return eff;
            }
        },
        21: {
            title() {
                return "HP Gain";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "HP gain x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(hasUpgrade("c", 44) ? 2 : 200);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
                return eff;
            }
        },
        22: {
            title() {
                return "Level Scaling";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Level scaling factor +" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(4, a).mul(1e4);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(0).add(player[this.layer].buyables[this.id].div(20));
                return eff;
            },
            unlocked() { return hasUpgrade("c", 12) }
        },
        23: {
            title() {
                return "EXP Gain";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "EXP gain x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(1e6);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked() { return hasUpgrade("c", 14) }
        },
        31: {
            title() {
                return "Equipment Shard Gain";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Equipment Shard gain x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a).mul(1e10);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked() { return hasUpgrade("c", 22) }
        },
        32: {
            title() {
                return "DMG";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "DMG x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(hasUpgrade("c", 44) ? 2.5 : 250);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
                return eff;
            },
            unlocked() { return hasUpgrade("c", 41) }
        },
        33: {
            title() {
                return "All Factory Machine Speed";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "All Factory Machine Speed x" + format(data.effect) + "<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Calm Points";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(10, a).mul(1e25);
                return a;
            },
            canAfford() {
                return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = new Decimal(1).add(player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked() { return hasUpgrade("c", 43) }
        },
    },


    doReset(layer) { },
    passiveGeneration() {
        if (player.b.points.gte(9)) return layers.e.equipmentEff(13).toNumber();
        else return 0;
    },
})
