addLayer("b", {
    name: "boss", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            hp: new Decimal(1000),
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
	if(player.b.points.gte(10))return Decimal.pow(10, player.b.points.sub(10)).mul(2e8);
	if(player.b.points.gte(8))return Decimal.pow(8, player.b.points.sub(8)).mul(3125000);
        return Decimal.pow(5, player.b.points).mul(10);
    },
    getBossATK() {
	if(player.b.points.gte(10))return Decimal.pow(2, player.b.points.sub(10)).mul(4e6).div(layers.b.dmgDivide());
	if(player.b.points.gte(8))return Decimal.pow(2.5, player.b.points.sub(8)).mul(655360).div(layers.b.dmgDivide());
        return Decimal.pow(4, player.b.points).mul(10).div(layers.b.dmgDivide());
    },
    tabFormat: [
        "main-display",
        ["column", [["raw-html", function () {
            let y = player.b.hp.div(layers.b.getBossHP());
            y = y.floor().toNumber() + 1;
	    y = Math.ceil(10-Math.sqrt(Math.max(100-y,0)));
            return "<div style=width:400px;text-align:right;>x" + y + "</div>";
        }], ["bar", "hp"]]],
        ["row", [["clickable", "11"], ["clickable", "12"]]],
        "resource-display",
        "milestones"
    ],
    bars: {
        hp: {
            fillStyle() {
                let y = player.b.hp.div(layers.b.getBossHP());
                y = y.floor().toNumber() + 1;
	        y = Math.ceil(10-Math.sqrt(Math.max(100-y,0)));

                if (y <= 0) return { 'background-color': "#000000" };
                return { 'background-color': "hsl(" + (Math.min(y - 1, 10) * 150) + ",100%,40%)" };
            },
            baseStyle() {
                let y = player.b.hp.div(layers.b.getBossHP());
                y = y.floor().toNumber() + 1;
	        y = Math.ceil(10-Math.sqrt(Math.max(100-y,0)));

                if (y <= 1) return { 'background-color': "#000000" };
                return { 'background-color': "hsl(" + (Math.min(y - 2, 10) * 150) + ",100%,40%)" };
            },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                let y = player.b.hp.div(layers.b.getBossHP());
		y = Decimal.sub(10,Decimal.sub(100,y).max(0).sqrt()).max(0);
                return y.toNumber() - y.floor().min(9).toNumber();
            },
            unlocked: true
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
                player.b.hp = player.b.hp.sub(getATK().mul(layers.b.dmgMult()));
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
		player.b.hp = player.b.hp.sub(getATK().mul(layers.b.dmgMult()).mul(bulk));
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
    ],
    update(diff) {
        if (getLevel().gte(10)) player.b.unlocked = true;
        if (player.b.hp.lte(0)) {
            player.b.points = player.b.points.add(1);
            player.b.hp = layers.b.getBossHP().mul(100);
        }
    },
    dmgMult() {
        let ret = new Decimal(1);
        if (hasUpgrade("c", 13)) ret = ret.mul(upgradeEffect("c", 13));
        ret = ret.mul(layers.d.effect2());
        return ret;
    },
    dmgDivide() {
        let ret = new Decimal(1);
        if (hasUpgrade("c", 21)) ret = ret.mul(upgradeEffect("c", 21));
        return ret;
    },
    doReset(layer) { },
    hotkeys: [
        { key: "b", description: "b: attack boss", onPress() { if (player.b.points.gte(3)) layers.b.clickables[12].onClick(); else layers.b.clickables[11].onClick(); } },
    ],

})
