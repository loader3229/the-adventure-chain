addLayer("e", {
    name: "equipment", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            drop: "",
            equipment: {
                11: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                12: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                13: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                14: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                21: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                22: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                23: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
                24: {
                    level: new Decimal(0),
                    power: new Decimal(0)
                },
            },
        }
    },
    color: "#6699FF",
    resource: "Equipment Shards", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 4, // Row the layer is in on the tree (0 is the first row)
    branches: ['d'],
    layerShown() { return player.b.points.gte(8) || player.e.unlocked },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                ["display-text", "Enemies in adventure will drop equipments now."],
                ["display-text", "Equipments will be converted to Equipment Shards when removed."],
                "clickables"
            ]
        }
    },
    gainMult(x) {
        if (x === undefined) x = new Decimal(0);
        x = x.pow(2).div(300000);
        x = x.mul(buyableEffect("c", 31));
        if (player.b.points.gte(11)) x = x.mul(player.b.points);
        x = x.mul(layers.f.effect());
        if (hasMilestone("i", 7)) x = x.mul(layers.i.effect());

        return x;
    },
    getResetGain(){
        let power = layers.e.effect().add(layers.e.effect2());
        let gain = layers.e.gainMult(player.a.bestLevel.max(1).mul(power)).mul(layers.e.equipmentEff(13).max(1));
        return gain;
    },
    passiveGeneration(){
        if (hasMilestone("c", 19))return 1; return 0;
    },
    update(diff) {
        if (player.b.points.gte(8)) player.e.unlocked = true;
    },
    types() {
        let types = [11];
        if (hasUpgrade("c", 15) || player.sac.points.gte(3)) types.push(12);
        if (player.b.points.gte(9)) types.push(13);
        if (hasUpgrade("c", 22) || player.sac.points.gte(3)) types.push(14);
        if (player.b.points.gte(15)) types.push(21);
        if (player.b.points.gte(15)) types.push(22);
        if (player.b.points.gte(18)) types.push(23);
        if (player.b.points.gte(19)) types.push(24);
        return types;
    },
    drop(level) {
        if (level === undefined) return "Haha";
        player.e.drop = "Enemy drop: ";
        let types = layers.e.types();
        let count = 1;
        if (player.b.points.gte(11)) count++;
        if (player.b.points.gte(15)) count++;
        if (player.a.equipmentShard) {
            let power = layers.e.effect().add(layers.e.effect2());
            let gain = layers.e.gainMult(level.mul(power)).mul(count ** 1.1).mul(1.1);
            player.e.points = player.e.points.add(gain);
            player.e.drop += format(gain) + " Equipment Shards";
            return player.e.drop;
        }
        for (i = 0; i < count; i++) {
            let type = types[Math.floor(types.length * Math.random())];
            let power = layers.e.effect().mul(Math.random()).add(layers.e.effect2());

            if (i) player.e.drop += "; ";
            player.e.drop += layers.e.clickables[type].title + " Level " + formatWhole(level) + ", Power: " + formatWhole(power.mul(100)) + "%";
            layers.e.equip(type, level, power);
        }
        return player.e.drop;
    },
    equip(type, level, power) {
        if (type === undefined) return new Decimal(0);
        let x = Decimal.mul(player.e.equipment[type].level, player.e.equipment[type].power);
        let y = level.mul(power);
        if (y.gte(x)) {
            player.e.equipment[type].level = level;
            player.e.equipment[type].power = power;
        }
        player.e.points = player.e.points.add(layers.e.gainMult(x.min(y)));
    },
    equipmentEff(type) {
        if (type === undefined) return new Decimal(0);
        let x = Decimal.mul(player.e.equipment[type].level, player.e.equipment[type].power);
        if (type == 11) {
            if (inChallenge("d",31))return new Decimal(0);
            return softcap(softcap(x.div(hasUpgrade("c", 33) ? 50000 : 60000), new Decimal(2)), new Decimal(8), 1/3);
        }
        if (type == 12) {
            if (inChallenge("d",31))return new Decimal(1);
            return Decimal.pow(1.01, softcap(x.pow(0.5), new Decimal(1000))).min(x.add(1));
        }
        if (type == 13) {
            if (inChallenge("d",31))return new Decimal(0);
            if(player.sac.points.gte(5))return Decimal.sub(10,Decimal.div(10,x.add(1).log10().pow(2).div(200).add(1)));
            if(hasMilestone("i",2))return Decimal.sub(10,Decimal.div(10,x.add(1).log10().pow(1.8).div(200).add(1)));
            return new Decimal(1).sub(Decimal.pow(0.995, x.pow(0.5)));
        }
        if (type == 14) {
            if (inChallenge("d",31))return new Decimal(1);
            return x.div(hasMilestone("j", 8) ? 1000 : hasUpgrade("c", 33) ? 2000 : 3000).add(1);
        }
        if (type >= 21 && type <= 24) {
            if (inChallenge("d",31))return new Decimal(1);
            if (player.sac.points.gte(3)) return Decimal.pow(1.01, x.pow(hasUpgrade("g", 14) ? 0.306 : 0.302));
            if (hasUpgrade("g", 14)) return Decimal.pow(1.01, x.pow(0.3)).max(x.pow(0.3).div(90).add(1));
            return Decimal.pow(1.01, x.pow(0.3).sub(20)).max(x.pow(0.3).div(100).add(1));
        }
        return new Decimal(0);
    },
    effect() {
        let ret = player.e.points.add(10).log10().div(hasUpgrade("c", 15) ? 4 : 10);
        return ret;
    },
    effect2() {
        let ret = new Decimal(1);
        if (hasUpgrade("c", 24)) ret = ret.add(0.5);
        if (hasUpgrade("g", 13)) ret = ret.add(0.5);
        if (hasUpgrade("g", 22)) ret = ret.add(0.5);
        if (hasMilestone("c", 14)) ret = ret.add(0.5);
        if (hasMilestone("c", 16)) ret = ret.add(1);
        if (hasUpgrade("g", 24)) ret = ret.add(1);
	if (hasMilestone("c", 21)) ret = ret.add(1);
        if (getClickableState("i",31) == 1) ret = ret.add(2);
        if (player.b.points.gte(14)) ret = ret.add(player.e.points.add(10).log10().div(player.b.points.gte(22) ? 8 : 10));
        if (player.b.points.gte(25)) ret = ret.add(buyableEffect("h",13).sub(1));
        if (player.b.points.gte(28)) ret = ret.add(buyableEffect("f",21).sub(1));
        if (player.b.points.gte(32)) ret = ret.add(buyableEffect("f",22).sub(1));
        return ret;
    },
    effectDescription() {
        return "equipment power range: " + formatWhole(layers.e.effect2().mul(100)) + "% - " + formatWhole(layers.e.effect().add(layers.e.effect2()).mul(100)) + "%";
    },
    clickables: {
        11: {
            title: "Level Gem",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: Level Scaling +${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" }
        },
        12: {
            title: "EXP Gem",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: EXP Gain x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return hasUpgrade("c", 15) || player.sac.points.gte(3); }
        },
        13: {
            title: "Passive Gem",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: Gain ${format(layers[this.layer].equipmentEff(this.id).mul(100))}% of Calm Point gain per second.`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return player.b.points.gte(9); }
        },
        14: {
            title: "Calm Gem",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: Calm Point Gain x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return hasUpgrade("c", 22) || player.sac.points.gte(3); }
        },
        21: {
            title: "Weapon",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: ATK x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return player.b.points.gte(15); }
        },
        22: {
            title: "Armor",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: DEF x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return player.b.points.gte(15); }
        },
        23: {
            title: "Helmet",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: HP gain x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return player.b.points.gte(18); }
        },
        24: {
            title: "Shoes",
            display: function () {
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: DMG x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: { "background-color": "#6699FF" },
            unlocked() { return player.b.points.gte(19); }
        },
    },
    doReset(layer) { 
        if (layer == "i" || layer == "j") {
            layerDataReset("e");
            if(player.i.points.gte(3) || hasMilestone("i",2))player.e.equipment[13].level=new Decimal(10000),player.e.equipment[13].power=new Decimal(10);
            if(player.i.points.gte(500) || hasMilestone("i",19))for(i in layers.e.clickables)if(parseInt(i)<=24)player.e.equipment[i].level=new Decimal(10000),player.e.equipment[i].power=new Decimal(10);
            updateTemp();
        }
    },
})
