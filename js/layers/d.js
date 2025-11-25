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
            challengeDescription: "Your DEF is 0.",
            goal() { return new Decimal(600); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            onEnter() { doReset("c", true); }
        },

    },
    update(diff) {
        if (player.b.points.gte(6)) player.d.unlocked = true;
    },

})
