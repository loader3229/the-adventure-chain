addLayer("b", {
    name: "boss", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            hp: new Decimal(1000),
            y: new Decimal(10)
        }
    },
    color: "#FFCC66",
    resource: "Beaten Bosses", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['a'],
    layerShown() { return player.b.points.gte(1) || getLevel().gte(10) },
    baseResource: "HP", // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    },
    getBossHP() {
        if (player.b.points.gte(10)) return Decimal.pow(10, player.b.points);
        return Decimal.pow(5, player.b.points).mul(1000);
    },
    getBossATK() {
        if (player.b.points.gte(26)) return Decimal.pow(3, player.b.points.sub(26)).mul(1e13).div(layers.b.dmgDivide());
        if (player.b.points.gte(16)) return Decimal.pow(2.5, player.b.points.sub(16)).mul(1e9).div(layers.b.dmgDivide());
        if (player.b.points.gte(10)) return Decimal.pow(2, player.b.points.sub(7)).mul(1e6).div(layers.b.dmgDivide());
        if (player.b.points.gte(8)) return Decimal.pow(4, player.b.points).mul(8).div(layers.b.dmgDivide());
        return Decimal.pow(4, player.b.points).mul(10).div(layers.b.dmgDivide());
    },
    tabFormat: [
        "main-display",
        ["column", [["raw-html", function () {
            let y = Math.ceil(player.b.y.toNumber());
            return "<div style=width:400px;text-align:right;>x" + y + "</div>";
        }], ["bar", "hp"]]],
        ["row", [["clickable", "11"], ["clickable", "12"]]],
        "resource-display",
        "milestones"
    ],
    bars: {
        hp: {
            fillStyle() {
                let y = Math.ceil(player.b.y.toNumber());

                if (y <= 0) return { 'background-color': "#000000" };
                return { 'background-color': "hsl(" + ((y - 1) * 150) + ",100%," + (40 + 60 * Math.pow(1 / 2, y)) + "%)" };
            },
            baseStyle() {
                let y = Math.ceil(player.b.y.toNumber());

                if (y <= 1) return { 'background-color': "#000000", 'transition-duration': '0s' };
                return { 'background-color': "hsl(" + ((y - 2) * 150) + ",100%," + (40 + 60 * Math.pow(1 / 2, y - 1)) + "%)", 'transition-duration': '0s' };
            },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                let y = player.b.y.toNumber();
                return y - Math.ceil(y) + 1;
            },
            unlocked: true, instant: true
        }
    },
    clickables: {
        11: {
            title() {
                return "Attack"
            },
            display() {
                return "Use " + format(layers.b.getBossATK().div(getDEF().add(1))) + " HP to attack"
            },
            canClick() {
                return player.points.gte(layers.b.getBossATK().div(getDEF().add(1)));
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;

                let y = player.b.hp.div(layers.b.getBossHP());
                player.points = player.points.sub(layers.b.getBossATK().div(getDEF().add(1)));
                player.b.hp = player.b.hp.sub(getATK().mul(getDMG()).mul(layers.b.dmgMult()));
            },
            unlocked: true,
        },
        12: {
            title() {
                return "Attack x" + formatWhole(this.bulk());
            },
            bulk() {
                let bulk = player.points.div(layers.b.getBossATK().div(getDEF().add(1))).floor().max(1);
                return bulk;
            },
            display() {
                return "Use " + format(layers.b.getBossATK().div(getDEF().add(1)).mul(this.bulk())) + " HP to attack"
            },
            canClick() {
                return player.points.gte(layers.b.getBossATK().div(getDEF().add(1)));
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;

                let bulk = this.bulk();
                let y = player.b.hp.div(layers.b.getBossHP());
                player.points = player.points.sub(layers.b.getBossATK().div(getDEF().add(1)).mul(bulk));
                player.b.hp = player.b.hp.sub(getATK().mul(getDMG()).mul(layers.b.dmgMult()).mul(bulk));
            },
            unlocked() { return player.b.points.gte(3) },
        },

    },
    milestones: [
        {
            requirementDescription: "Beat 1 boss",
            unlocked() { return player[this.layer].points.gte(0) },
            done() { return player[this.layer].points.gte(1) }, // Used to determine when to give the milestone
            effectDescription: "+0.05 DEF per level.",
        },
        {
            requirementDescription: "Beat 2 bosses",
            unlocked() { return player[this.layer].points.gte(1) },
            done() { return player[this.layer].points.gte(2) }, // Used to determine when to give the milestone
            effectDescription: "Gain more EXP from enemies and unlock Bulk Attack in layer A.",
        },
        {
            requirementDescription: "Beat 3 bosses",
            unlocked() { return player[this.layer].points.gte(2) },
            done() { return player[this.layer].points.gte(3) }, // Used to determine when to give the milestone
            effectDescription: "Unlock layer C and unlock Bulk Attack in layer B.",
        },
        {
            requirementDescription: "Beat 4 bosses",
            unlocked() { return player[this.layer].points.gte(3) },
            done() { return player[this.layer].points.gte(4) }, // Used to determine when to give the milestone
            effectDescription: "Calm point gain is multiplied by beaten bosses count.",
        },
        {
            requirementDescription: "Beat 5 bosses",
            unlocked() { return player[this.layer].points.gte(4) },
            done() { return player[this.layer].points.gte(5) }, // Used to determine when to give the milestone
            effectDescription: "Calm point gain is better, unlock calm upgrades.",
        },
        {
            requirementDescription: "Beat 6 bosses",
            unlocked() { return player[this.layer].points.gte(5) },
            done() { return player[this.layer].points.gte(6) }, // Used to determine when to give the milestone
            effectDescription: "Unlock layer D.",
        },
        {
            requirementDescription: "Beat 7 bosses",
            unlocked() { return player[this.layer].points.gte(6) },
            done() { return player[this.layer].points.gte(7) }, // Used to determine when to give the milestone
            effectDescription: "Reduce level requirement based on beaten bosses count, unlock more calm upgrades.",
        },
        {
            requirementDescription: "Beat 8 bosses",
            unlocked() { return player[this.layer].points.gte(7) },
            done() { return player[this.layer].points.gte(8) }, // Used to determine when to give the milestone
            effectDescription: "Unlock layer E and increase level cap.",
        },
        {
            requirementDescription: "Beat 9 bosses",
            unlocked() { return player[this.layer].points.gte(8) },
            done() { return player[this.layer].points.gte(9) }, // Used to determine when to give the milestone
            effectDescription: "Unlock a new equipment type.",
        },
        {
            requirementDescription: "Beat 10 bosses",
            unlocked() { return player[this.layer].points.gte(9) },
            done() { return player[this.layer].points.gte(10) }, // Used to determine when to give the milestone
            effectDescription: "Increase level cap, and level requirement is reduced.",
        },
        {
            requirementDescription: "Beat 11 bosses",
            unlocked() { return player[this.layer].points.gte(10) },
            done() { return player[this.layer].points.gte(11) }, // Used to determine when to give the milestone
            effectDescription: "Equipment Shard gain is multiplied by beaten bosses count. Each enemy drop 2 equipments. Unlock layer F.",
        },
        {
            requirementDescription: "Beat 12 bosses",
            unlocked() { return player[this.layer].points.gte(11) },
            done() { return player[this.layer].points.gte(12) }, // Used to determine when to give the milestone
            effectDescription: "Unlock Sacrifice.",
        },
        {
            requirementDescription: "Beat 13 bosses",
            unlocked() { return player[this.layer].points.gte(12) },
            done() { return player[this.layer].points.gte(13) }, // Used to determine when to give the milestone
            effectDescription: "+0.0001 DMG per level, unlock some calm upgrades.",
        },
        {
            requirementDescription: "Beat 14 bosses",
            unlocked() { return player[this.layer].points.gte(13) },
            done() { return player[this.layer].points.gte(14) }, // Used to determine when to give the milestone
            effectDescription: "Equipment Shard effect is better.",
        },
        {
            requirementDescription: "Beat 15 bosses",
            unlocked() { return player[this.layer].points.gte(14) },
            done() { return player[this.layer].points.gte(15) }, // Used to determine when to give the milestone
            effectDescription: "Unlock 2 new types of equipments, each enemy drop 3 equipments.",
        },
        {
            requirementDescription: "Beat 16 bosses",
            unlocked() { return player[this.layer].points.gte(15) },
            done() { return player[this.layer].points.gte(16) }, // Used to determine when to give the milestone
            effectDescription: "Unlock layer G.",
        },
        {
            requirementDescription: "Beat 17 bosses",
            unlocked() { return player[this.layer].points.gte(16) },
            done() { return player[this.layer].points.gte(17) }, // Used to determine when to give the milestone
            effectDescription: "Gold gain is boosted by bosses beaten.",
        },
        {
            requirementDescription: "Beat 18 bosses",
            unlocked() { return player[this.layer].points.gte(17) },
            done() { return player[this.layer].points.gte(18) }, // Used to determine when to give the milestone
            effectDescription: "Unlock a new type of equipment. 1.25x HP gain.",
        },
        {
            requirementDescription: "Beat 19 bosses",
            unlocked() { return player[this.layer].points.gte(18) },
            done() { return player[this.layer].points.gte(19) }, // Used to determine when to give the milestone
            effectDescription: "Unlock a new type of equipment. 1.1x DMG.",
        },
        {
            requirementDescription: "Beat 20 bosses",
            unlocked() { return player[this.layer].points.gte(19) },
            done() { return player[this.layer].points.gte(20) }, // Used to determine when to give the milestone
            effectDescription: "Unlock layer H.",
        },
        {
            requirementDescription: "Beat 21 bosses",
            unlocked() { return player[this.layer].points.gte(20) },
            done() { return player[this.layer].points.gte(21) }, // Used to determine when to give the milestone
            effectDescription: "+0.02 DEF per level. Unlock another helper.",
        },
        {
            requirementDescription: "Beat 22 bosses",
            unlocked() { return player[this.layer].points.gte(21) },
            done() { return player[this.layer].points.gte(22) }, // Used to determine when to give the milestone
            effectDescription: "Equipment Shard effect is better.",
        },
        {
            requirementDescription: "Beat 23 bosses",
            unlocked() { return player[this.layer].points.gte(22) },
            done() { return player[this.layer].points.gte(23) }, // Used to determine when to give the milestone
            effectDescription: "You can buy Tier 2 machines using Scraps. Increase Max machine tier by 1.",
        },
        {
            requirementDescription: "Beat 24 bosses",
            unlocked() { return player[this.layer].points.gte(23) },
            done() { return player[this.layer].points.gte(24) }, // Used to determine when to give the milestone
            effectDescription: "1.25x HP gain.",
        },
        {
            requirementDescription: "Beat 25 bosses",
            unlocked() { return player[this.layer].points.gte(24) },
            done() { return player[this.layer].points.gte(25) }, // Used to determine when to give the milestone
            effectDescription: "Unlock a new helper and a gold upgrade.",
        },
        {
            requirementDescription: "Beat 26 bosses",
            unlocked() { return player[this.layer].points.gte(25) },
            done() { return player[this.layer].points.gte(26) }, // Used to determine when to give the milestone
            effectDescription: "Unlock layer I.",
        },
        {
            requirementDescription: "Beat 27 bosses",
            unlocked() { return player[this.layer].points.gte(26) },
            done() { return player[this.layer].points.gte(27) }, // Used to determine when to give the milestone
            effectDescription: "Increase Imaginary Points gain based on beaten bosses count.",
        },
        {
            requirementDescription: "Beat 28 bosses",
            unlocked() { return player[this.layer].points.gte(27) },
            done() { return player[this.layer].points.gte(28) }, // Used to determine when to give the milestone
            effectDescription: "Unlock Forge.",
        },
        {
            requirementDescription: "Beat 29 bosses",
            unlocked() { return player[this.layer].points.gte(28) },
            done() { return player[this.layer].points.gte(29) }, // Used to determine when to give the milestone
            effectDescription: "Boost Helper Points gain based on beaten bosses.",
        },
        {
            requirementDescription: "Beat 30 bosses",
            unlocked() { return player[this.layer].points.gte(29) },
            done() { return player[this.layer].points.gte(30) }, // Used to determine when to give the milestone
            effectDescription: "Unlock another reward for each of the first 4 domains.",
        },
        {
            requirementDescription: "Beat 31 bosses",
            unlocked() { return player[this.layer].points.gte(30) },
            done() { return player[this.layer].points.gte(31) }, // Used to determine when to give the milestone
            effectDescription: "Max domain completions +5.",
        },
        {
            requirementDescription: "Beat 32 bosses",
            unlocked() { return player[this.layer].points.gte(31) },
            done() { return player[this.layer].points.gte(32) }, // Used to determine when to give the milestone
            effectDescription: "Unlock 2nd forge.",
        },
        {
            requirementDescription: "Beat 33 bosses",
            unlocked() { return player[this.layer].points.gte(32) },
            done() { return player[this.layer].points.gte(33) }, // Used to determine when to give the milestone
            effectDescription: "1.6x DMG.",
        },
        {
            requirementDescription: "Beat 34 bosses",
            unlocked() { return player[this.layer].points.gte(33) },
            done() { return player[this.layer].points.gte(34) }, // Used to determine when to give the milestone
            effectDescription: "Current Endgame",
        },
    ],
    update(diff) {
        if (getLevel().gte(10)) player.b.unlocked = true;
        if (player.b.y.lte(0)) {
            player.b.points = player.b.points.add(1);
            player.b.hp = layers.b.getBossHP();
            player.b.y = player.b.points.add(10);
        }
    },
    dmgMult() {
        let ret = new Decimal(1);
        if (hasUpgrade("c", 13)) ret = ret.mul(upgradeEffect("c", 13));
        if (hasUpgrade("g", 21)) ret = ret.mul(upgradeEffect("g", 21));
        ret = ret.mul(layers.d.effect2());
        ret = ret.mul(layers.i.effect());
        if (player.sac.points.gte(1)) ret = ret.mul(10);
        if (player.sac.points.gte(2)) ret = ret.mul(100);
        if (hasMilestone("i", 11)) ret = ret.mul(10);
        return ret;
    },
    dmgDivide() {
        let ret = new Decimal(1);
        if (player.sac.points.gte(3)) ret = ret.mul(10);
        if (hasUpgrade("c", 21)) ret = ret.mul(upgradeEffect("c", 21));
        return ret;
    },
    doReset(layer) { },
    hotkeys: [
        { key: "b", description: "b: attack boss", onPress() { if (player.b.points.gte(3)) layers.b.clickables[12].onClick(); else layers.b.clickables[11].onClick(); } },
    ],

})

setInterval(function () {
    if (player.b && player.b.y && layers.b && layers.b.getBossHP) player.b.y = player.b.points.add(10).mul(Decimal.sub(1, Decimal.sub(1, player.b.hp.div(layers.b.getBossHP()).min(1)).sqrt())).mul(0.01).add(player.b.y.mul(0.99)).max(0), tmp.b.bars.hp.fillStyle = layers.b.bars.hp.fillStyle(), tmp.b.bars.hp.baseStyle = layers.b.bars.hp.baseStyle(), tmp.b.bars.hp.progress = layers.b.bars.hp.progress(), constructBarStyle("b", "hp");
}, 10);