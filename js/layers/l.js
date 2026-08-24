addLayer("l", {
    name: "loot", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#99FF00",
    resource: "loot", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 11, // Row the layer is in on the tree (0 is the first row)
    branches: ['k'],
    layerShown() { return player.b.points.gte(56) || player.l.unlocked },
    gainMult() {
        return new Decimal(1);
    },
    update(diff) {
        if (player.b.points.gte(56)) player.l.unlocked = true;
    },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "upgrades",
                "milestones"
            ]
        }
    },
    upgrades: {
        11: {
            description: "Each loot upgrade double calm point gain.",
            cost: new Decimal(10),
            effect: function () { return Decimal.pow(2, player.l.upgrades.length) },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
        12: {
            description: "Each loot upgrade double damage to bosses.",
            cost: new Decimal(30),
            effect: function () { return Decimal.pow(2, player.l.upgrades.length) },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
        13: {
            description: "Gold gain is boosted by your loot.",
            cost: new Decimal(100),
            effect: function () { return player.l.points.add(100).log10().sqrt(); },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
    },
    doReset(layer) {
        
    },
})
