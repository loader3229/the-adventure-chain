addLayer("sac", {
    name: "sacrifice", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Sac", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#FFFFFF",
    requires() {
        if (player.sac.points.gte(4)) return new Decimal("10^^10");
        return new Decimal(4000);
    }, // Can be a function that takes requirement increases into account
    resource: "sacrifices", // Name of prestige currency
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() { return getLevel() }, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    base: 4,
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "`", description: "`: sacrifice", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return player.b.points.gte(12) || player.sac.unlocked },
    milestones: [
        {
            requirementDescription: "Sacrifice 1 time",
            unlocked() { return player[this.layer].points.gte(0) },
            done() { return player[this.layer].points.gte(1) }, // Used to determine when to give the milestone
            effectDescription: "Increase max level and EXP gain, but increase EXP required to level up. Reduce Tier 1 machine cost in layer F. You can complete domain without exiting domain. Deal 10x damage to bosses.",
        },
        {
            requirementDescription: "Sacrifice 2 times",
            unlocked() { return player[this.layer].points.gte(1) },
            done() { return player[this.layer].points.gte(2) }, // Used to determine when to give the milestone
            effectDescription: "Increase max level and EXP gain, but increase EXP required to level up. Reduce Tier 1 machine cost in layer F. Deal 100x damage to bosses.",
        },
        {
            requirementDescription: "Sacrifice 3 times",
            unlocked() { return player[this.layer].points.gte(2) },
            done() { return player[this.layer].points.gte(3) }, // Used to determine when to give the milestone
            effectDescription: "Increase max level and EXP gain, but increase EXP required to level up. Reduce Enemy DEF when level > 1000. Reduce Tier 1 machine cost in layer F. Unlock all 8 current equipment types and all 4 current domains at the start of the sacrifice. Reduce damage taken from bosses to 0.1x.",
        },
    ],
    doReset(layer) {
        if (layer == "sac") {
            layerDataReset("a");
            layerDataReset("c");
            layerDataReset("d");
            layerDataReset("e");
            layerDataReset("f");
            layerDataReset("g");
            layerDataReset("h");
            layerDataReset("i");

            updateTemp();
            updateTemp();
            updateTemp();
        }
    },
})
