addLayer("a", {
    name: "adventure", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            hp: new Decimal(5.05),
            level: new Decimal(1),
            setLevel: new Decimal(1),
            nextEnemyTime: new Decimal(0),
            equipmentShard: false,
        }
    },
    color: "#FF6666",
    resource: "EXP", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
baseResource: "HP", // Name of resource prestige is based on
	baseAmount() {
		return player.points;
	},
    getEnemyHP(level) {
	if(level === undefined)level = player.a.level;
        return level.mul(Decimal.pow(1.01, level.pow(0.5))).mul(5);
    },
    getEnemyATK(level) {
	if(level === undefined)level = player.a.level;
        return level.mul(Decimal.pow(1.01, level.pow(0.5)));
    },
    getEnemyDEF(level) {
	if(level === undefined)level = player.a.level;
        return level.mul(Decimal.pow(1.01, level.pow(0.5))).mul(0.05).sub(1.05).max(0).max(level.mul(Decimal.pow(1.01, level.pow(0.5))).mul(0.1).sub(70));
    },
    getEnemyDMG(level) {
	if(level === undefined)level = player.a.level;
        return level.mul(Decimal.pow(1.01, level.pow(0.5))).mul(0.0001).max(1);
    },
    getEnemyEXP(level) {
	if(level === undefined)level = player.a.level;
	let exp = level.pow(20 / 9).max(level.pow(3.1).mul(Decimal.pow(1.031, level.pow(0.5))).div(player.b.points.gte(2) ? 5 : 15));
        if (player.c.unlocked) exp = level.pow(3.1).mul(Decimal.pow(1.031, level.pow(0.5))).max(level.pow(3.2).mul(Decimal.pow(1.031, level.pow(0.5))).sub(54e8)).max(level.pow(4.1).mul(Decimal.pow(1.041, level.pow(0.5))).div(4000));
	if (player.sac.points.gte(1)){
		exp = level.pow(3.1).mul(Decimal.pow(1.031, level.pow(0.5))).mul(20).max(level.pow(4.1).mul(Decimal.pow(1.041, level.pow(0.5))).div(hasMilestone("c",9)?1:60));
		if(hasMilestone("c",0))exp = exp.mul(3);
		if(hasMilestone("c",3))exp = exp.mul(2);
		if(hasMilestone("c",10))exp = level.pow(4.1).mul(Decimal.pow(1.041, level.pow(0.5))).mul(100);
	}
	if (player.sac.points.gte(2)){
		exp = level.pow(4.1).mul(Decimal.pow(1.041, level.pow(0.5))).mul(20);
		if(hasMilestone("c",0))exp = exp.mul(2.5);
		if(hasMilestone("c",3))exp = exp.mul(2);
		if(hasMilestone("c",9))exp = exp.mul(2.5);
		if(hasMilestone("c",10))exp = exp.mul(2);
		if(hasMilestone("c",11))exp = exp.mul(2);
	}
        exp = exp.mul(layers.a.gainMult());
        return exp;
    },
    getEnemyGold(level) {
	if(level === undefined)level = player.a.level;
	let gold=level.div(1000).mul(player.b.points.sub(15).max(0).pow(0.5)).add(1).pow(1.5).mul(player.b.points.sub(15).max(0).pow(0.5));
        gold= gold.mul(layers.g.gainMult());
        return gold;
    },

    gainMult() {
        if (!player.c.unlocked) return new Decimal(1);
        let exp = new Decimal(1);
        exp = exp.mul(layers.c.effect());
        exp = exp.mul(buyableEffect("c",23));
	exp = exp.mul(layers.e.equipmentEff(12));
        if(hasMilestone("c",8))exp = exp.mul(layers.f.effect());
        return exp;
    },
    tabFormat: [
        "main-display",
        ["row", [["display-text", function () { return "Set Enemy Level: " }], ["text-input", "setLevel"], ["clickable", 21], ["clickable", 22]]],
        ["row", [["display-text", function () { return "Current Enemy Level: " + formatWhole(player.a.level) }]]],
        ["bar", "hp"],
        ["display-text", function () { return "ATK: " + format(layers.a.getEnemyATK()) }],
        ["display-text", function () { if (player.a.level.gte(20)) return "DEF: " + format(layers.a.getEnemyDEF()) }],
        ["display-text", function () { if (player.a.level.gte(4960)) return "DMG: " + format(layers.a.getEnemyDMG()) +"x" }],
        ["display-text", function () { return "EXP: " + format(layers.a.getEnemyEXP()) }],
        ["display-text", function () { if (player.b.points.gte(16)) return "Gold: " + format(layers.a.getEnemyGold()) }],
        ["display-text", function () { if (!player.b.unlocked) return "Reach Level 10 to unlock layer B" }],
        ["row", [["clickable", "11"], ["clickable", "12"]]],
        "resource-display",
        ["display-text", function () { return player.e.drop }],["clickable", "13"]

    ],
    bars: {
        hp: {
            fillStyle() {
                if (player.a.nextEnemyTime.gte(0)) {
                    return { 'background-color': "#999999" }
                }
                return { 'background-color': "#ff6666" }
            },
            baseStyle: { 'background-color': "#000000" },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                if (player.a.nextEnemyTime.gte(0)) {
                    return (2 - player.a.nextEnemyTime.toNumber()) / 2;
                }
                return (player.a.hp.div(layers.a.getEnemyHP())).toNumber()
            },
            display() {
                if (player.a.nextEnemyTime.gte(0)) {
                    return "Next enemy in " + format(player.a.nextEnemyTime) + " seconds"
                }
                return `${format(player.a.hp)} / ${format(layers.a.getEnemyHP())}`
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
                return "Use " + format(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1))) + " HP to deal " + format(getATK().mul(getDMG()).div(layers.a.getEnemyDEF().add(1))) + " damage"
            },
            canClick() {
                return player.points.gte(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1))) && player.a.nextEnemyTime.lte(0);
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                player.points = player.points.sub(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1)));
                player.a.hp = player.a.hp.sub(getATK().mul(getDMG()).div(layers.a.getEnemyDEF().add(1)));
		if(inChallenge("d",22) && player.a.hp.gt(0))player.a.hp = layers.a.getEnemyHP();
            },

            unlocked: true,
        },
        12: {
            title() {
                return "Attack x" + formatWhole(this.bulk());
            },
            bulk() {
		if(inChallenge("d",22))return new Decimal(1);
                let bulk = player.points.div(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1))).floor();
                let dmg = player.a.hp.div(getATK().mul(getDMG()).div(layers.a.getEnemyDEF().add(1))).ceil();
                bulk = bulk.min(dmg).max(1);
                return bulk;
            },
            display() {
                return "Use " + format(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1)).mul(this.bulk())) + " HP to deal " + format(getATK().mul(getDMG()).div(layers.a.getEnemyDEF().add(1)).mul(this.bulk())) + " damage"
            },
            canClick() {
                return player.points.gte(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1))) && player.a.nextEnemyTime.lte(0);
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                let bulk = this.bulk();
                player.points = player.points.sub(layers.a.getEnemyATK().mul(layers.a.getEnemyDMG()).div(getDEF().add(1)).mul(bulk));
                player.a.hp = player.a.hp.sub(getATK().mul(getDMG()).div(layers.a.getEnemyDEF().add(1)).mul(bulk));
		if(inChallenge("d",22) && player.a.hp.gt(0))player.a.hp = layers.a.getEnemyHP();
            },
            unlocked() { return player.b.points.gte(2) },
        },
        13: {
            title() {
                return "Enemy Drop Mode";
            },
             display(){if(player.a.equipmentShard)return "Equipment Shard";return "Equipment";},
            canClick() {
                return hasUpgrade("c",42);
            },
            onClick() {
                player.a.equipmentShard = !player.a.equipmentShard;
            },
            unlocked() {return hasUpgrade("c",42)},
        },

        21: {
            title() {
                return "-1"
            },
            canClick() {
                return player.a.level.gte(2);
            },
            onClick() {
                player.a.setLevel = player.a.level = player.a.level.sub(1);
                player.a.nextEnemyTime = new Decimal(2);
                player.a.hp = layers.a.getEnemyHP();
            },
            style: { 'width': "60px", 'min-height': "60px" },
            unlocked: true,
        },
        22: {
            title() {
                return "+1"
            },
            canClick() {
                return true;
            },
            onClick() {
                player.a.setLevel = player.a.level = player.a.level.add(1);
                player.a.nextEnemyTime = new Decimal(2);
                player.a.hp = layers.a.getEnemyHP();
            },
            style: { 'width': "60px", 'min-height': "60px" },
            unlocked: true,
        }
    },
    update(diff) {
        if (player.a.hp.lte(0)) {
            layers.e.drop(player.a.level);
            player.a.nextEnemyTime = new Decimal(2);
            player.a.hp = layers.a.getEnemyHP();
            player.a.points = player.a.points.add(layers.a.getEnemyEXP());
            player.g.points = player.g.points.add(layers.a.getEnemyGold());
        }else if(inChallenge("d",22))player.a.hp = layers.a.getEnemyHP();

        player.a.nextEnemyTime = player.a.nextEnemyTime.sub(diff);
        player.a.setLevel = player.a.setLevel.max(1);
        if (player.a.level.neq(player.a.setLevel)) {
            player.a.level = player.a.setLevel;
            player.a.nextEnemyTime = new Decimal(2);
            player.a.hp = layers.a.getEnemyHP();
        }
    },
    doReset(layer) {
        if (layer == "c" || layer == "d") {
            player.a.points = new Decimal(0);
            player.a.nextEnemyTime = new Decimal(2);
            player.a.hp = layers.a.getEnemyHP();
            updateTemp();
        }
    },
    hotkeys: [
        { key: "a", description: "a: attack enemy", onPress() { if (player.b.points.gte(2)) layers.a.clickables[12].onClick(); else layers.a.clickables[11].onClick(); } },
    ],

})
