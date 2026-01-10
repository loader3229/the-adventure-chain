addLayer("f", {
    name: "factory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            t1: new Decimal(0),
            t2: new Decimal(0),
            maxTier: new Decimal(1),
        }
    },
    color: "#CCCCCC",
    resource: "scraps", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 5, // Row the layer is in on the tree (0 is the first row)
    branches: ['e'],
    layerShown() { return player.b.points.gte(11) || player.f.unlocked },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                ["display-text", function () { return "Factory, Foundry and Forge. You can use equipment shards to buy machines and generate scraps." }],
                ["display-text", function () { return "You have " + formatWhole(player.f.t1.add(player.f.buyables[11])) + " Tier 1 machines" }],
                ["display-text", function () { if (player.f.maxTier.gte(2)) return "You have " + formatWhole(player.f.t2.add(player.f.buyables[13])) + " Tier 2 machines"; return "" }],
                ["display-text", function () { if (player.f.maxTier.gte(3)) return "You have 1 Tier " + formatWhole(player.f.maxTier) + " machine"; return "" }],
                ["row", [["buyable", 11], ["buyable", 13], ["buyable", 12]]],
            ]
        }
    },
    gainMult() {
        let ret = buyableEffect("f", 11);
        if (hasUpgrade("c", 43)) ret = ret.mul(buyableEffect("c", 33));
        return ret;
    },
    gainMultT1() {
        let ret = buyableEffect("f", 13);
        if (hasUpgrade("c", 43)) ret = ret.mul(buyableEffect("c", 33));
        return ret;


    },
    gainMultT2() {
        let ret = new Decimal(1);
        if (hasUpgrade("c", 43)) ret = ret.mul(buyableEffect("c", 33));
        return ret;


    },
    update(diff) {
        if (player.b.points.gte(11)) {
            player.f.unlocked = true;
            player.f.points = player.f.points.add(layers.f.gainMult().mul(diff).mul(player.f.t1.add(player.f.buyables[11])));
            player.f.t1 = player.f.t1.add(layers.f.gainMultT1().mul(diff).mul(player.f.t2.add(player.f.buyables[13])));
            player.f.maxTier = player.f.maxTier.max(player.f.buyables[12].add(player.b.points.gte(23) ? 2 : 1));
            if (player.f.maxTier.gte(2) && player.b.points.lt(23)) player.f.t2 = player.f.t2.max(1);
            if (player.f.maxTier.gte(3)) player.f.t2 = player.f.t2.root(player.f.maxTier.sub(2)).add(layers.f.gainMultT2().mul(diff)).pow(player.f.maxTier.sub(2));
        }
    },
    effect() {
        let base = new Decimal(2);
        if (hasUpgrade("c", 25)) base = base.add(1);
        if (hasMilestone("c", 12)) base = base.add(1);
        return Decimal.pow(base, player.f.points.add(1).log10().sqrt());
    },
    effectDescription() {
        return "translated to " + format(layers.f.effect()) + "x Calm Points and Equipment Shards";
    },
    buyables: {
        11: {
            title() {
                return "Tier 1 Machine";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Bought " + formatWhole(player[this.layer].buyables[this.id]) + " times<br>" +
                    "Tier 1 Machine speed x" + format(data.effect) + "<br>" +
                    "Cost: " + format(data.cost) + " Equipment Shards";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(player.sac.points.gte(3) ? 1 : player.sac.points.gte(2) ? 100 : player.sac.points.gte(1) ? 1e3 : 1e5);
                return a;
            },
            canAfford() {
                return player.e.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.e.points = player.e.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2, player[this.layer].buyables[this.id]);
                return eff;
            }
        },
        12: {
            title() {
                return "Increase Max Tier";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Bought " + formatWhole(player[this.layer].buyables[this.id]) + " times<br>" +
                    "Max Tier: " + formatWhole(player[this.layer].maxTier) + "<br>" +
                    "Cost: " + format(data.cost) + " Equipment Shards";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(10, a.pow(2)).mul(1e6);
                return a;
            },
            canAfford() {
                return player.e.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.e.points = player.e.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            unlocked() { return hasUpgrade("c", 23) }
        },
        13: {
            title() {
                return "Tier 2 Machine";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Bought " + formatWhole(player[this.layer].buyables[this.id]) + " times<br>" +
                    "Tier 2 Machine speed x" + format(data.effect) + "<br>" +
                    "Cost: " + format(data.cost) + " Scraps";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(4, a.pow(1.5));
                return a;
            },
            canAfford() {
                return player.f.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.f.points = player.f.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2, player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked() { return player.b.points.gte(23) }
        },

    },
    doReset(layer) { 
        if (layer == "i") {
            layerDataReset("f");
            updateTemp();
        }
    },
})
