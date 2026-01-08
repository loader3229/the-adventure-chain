addLayer("g", {
    name: "gold", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            shop: [
                { type: 11, level: new Decimal(1), power: new Decimal(1) }
            ],
        }
    },
    color: "#FFFF00",
    resource: "gold", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 6, // Row the layer is in on the tree (0 is the first row)
    branches: ['f'],
    layerShown() { return player.b.points.gte(16) || player.g.unlocked },
    gainMult() {
        return new Decimal(1);
    },
    update(diff) {
        if (player.b.points.gte(16)) player.g.unlocked = true;
    },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "upgrades",
                "milestones"
            ]
        }, "Equipment Shop": {
            "content": [
                "main-display",
                ["display-text", function () { return layers.e.clickables[player.g.shop[0].type].title + " Level " + formatWhole(player.g.shop[0].level) + ", Power: " + formatWhole(player.g.shop[0].power.mul(100)) + "%" }],
                ["display-text", function () { return "Cost: " + formatWhole(layers.g.shopcost(0)) + " gold" }],
                ["row", [["clickable", 11], ["clickable", 12]]]
            ], unlocked: function () { return hasUpgrade("g", 12) || player.sac.points.gte(3) }
        }
    },
    upgrades: {
        11: {
            description: "Each gold upgrade double calm point gain.",
            cost: new Decimal(300),
            effect: function () { return Decimal.pow(2, player.g.upgrades.length) },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
        12: {
            description() { if (player.sac.points.gte(3)) return "Equipment Power +30% in Equipment Shop."; return "Unlock Equipment Shop."; },
            cost: new Decimal(2000),
        },
        13: {
            description: "Equipment Power +50% for new equipments, additionally +10% in Equipment Shop.",
            cost: new Decimal(6000),
            unlocked() { return player.sac.points.gte(2) },
        },
        14: {
            description: "Effects of Weapon, Armor, Helmet and Shoes are better.",
            cost: new Decimal(30000),
            unlocked() { return player.sac.points.gte(2) },
        },
        15: {
            description: "Increase max domain completions.",
            cost: new Decimal(100000),
            unlocked() { return player.sac.points.gte(2) },
        },
        21: {
            description: "Deal more damage to bosses based on gold upgrades.",
            cost: new Decimal(3e5),
            effect: function () { return Decimal.pow(2, player.g.upgrades.length) },
            effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
        },
        22: {
            description: "Equipment Power +50% for new equipments, additionally +10% in Equipment Shop.",
            cost: new Decimal(1e6),
            unlocked() { return player.sac.points.gte(2) },
        },
        23: {
            description: "Gain more Equipment Power in Equipment Shop based on your gold.",
            cost: new Decimal(2e6),
            unlocked() { return player.b.points.gte(25) },
        },
    },
    clickables: {
        11: {
            title() {
                return "Refresh Shop"
            },
            onClick() {
                let i = 0;
                let types = layers.e.types();
                let type = types[Math.floor(types.length * Math.random())];
                let x = Decimal.mul(player.e.equipment[type].level, player.e.equipment[type].power).max(1);
                let level = new Decimal(1);
                let power = new Decimal(1);
                while (i <= 5 && level.mul(power).lt(x)) {
                    type = types[Math.floor(types.length * Math.random())];
                    level = getLevel().mul(Math.random() * 0.25 + 1);
                    x = Decimal.mul(player.e.equipment[type].level, player.e.equipment[type].power).max(1);
                    power = x.mul(Math.random() * 0.1 + 1.05).div(level).max(layers.e.effect2().add(layers.e.effect().mul(Math.random() * 0.5))).min(layers.e.effect().add(layers.e.effect2()).mul(Math.random() * 0.05 + 1));
                    if (hasUpgrade("g", 12) && player.sac.points.gte(3)) power = power.add(0.3);
                    if (hasUpgrade("g", 13)) power = power.add(0.1);
                    if (hasUpgrade("g", 22)) power = power.add(0.1);
                    if (hasUpgrade("g", 23)) power = power.mul(player.g.points.div(level.mul(power).pow(1.5).div(100000).add(100)).max(1).pow(0.05));
                    i++;
                }
                player.g.shop[0].type = type;
                player.g.shop[0].level = level;
                player.g.shop[0].power = power;
            },
            canClick: true,
            unlocked: true,

        },
        12: {
            title() {
                return "Buy"
            },
            onClick() {
                player.g.points = player.g.points.sub(layers.g.shopcost(0));
                layers.e.equip(player.g.shop[0].type, player.g.shop[0].level, player.g.shop[0].power);
                layers.g.clickables[11].onClick();
            },
            canClick() {
                return player.g.points.gte(layers.g.shopcost(0));
            },
            unlocked: true,

        },

    },
    shopcost(x) {
        if (x === undefined) x = 0;
        return player.g.shop[x].level.mul(player.g.shop[x].power).pow(1.5).div(100000).add(100);
    },
})
