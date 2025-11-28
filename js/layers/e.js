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
gainMult(x){
	if(x === undefined)x = new Decimal(0);
	x = x.pow(2).div(300000);
	return x;
},
    update(diff) {
        if (player.b.points.gte(8)) player.e.unlocked = true;
    },
    drop(level) {
        if (level === undefined)return "Haha";
        let types = [11];
	if(hasUpgrade("c",15))types.push(12);
	if(player.b.points.gte(9))types.push(13);
	let type=types[Math.floor(types.length*Math.random())];
        let power = layers.e.effect().mul(Math.random()).add(1);
        let x = Decimal.mul(player.e.equipment[type].level,player.e.equipment[type].power);
	let y = level.mul(power);
	player.e.drop = "Enemy drop: "+layers.e.clickables[type].title+" Level "+formatWhole(level)+", Power: "+formatWhole(power.mul(100))+"%"
	if(y.gte(x)){
		player.e.equipment[type].level=level;
		player.e.equipment[type].power=power;
	}
	player.e.points = player.e.points.add(layers.e.gainMult(x.min(y)));
	return player.e.drop;
    },
    equipmentEff(type){
	if(type === undefined)return new Decimal(0);
	let x = Decimal.mul(player.e.equipment[type].level,player.e.equipment[type].power);
	if(type==11){
		return x.div(60000);
	}
	if(type==12){
		return Decimal.pow(1.01,x.pow(0.5));
	}
	if(type==13){
		return new Decimal(1).sub(Decimal.pow(0.995,x.pow(0.5)));
	}

	return new Decimal(0);
},
effect(){
	return player.e.points.add(10).log10().div(hasUpgrade("c",15)?4:10);
},
effectDescription(){
	return "Max equipment power: "+formatWhole(layers.e.effect().mul(100).add(100))+"%";
},
    clickables: {
        11: {
            title: "Level Gem",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: Level Scaling +${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"}
        },
        12: {
            title: "EXP Gem",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: EXP Gain x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return hasUpgrade("c",15);}
        },
        13: {
            title: "Passive Gem",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: Gain ${format(layers[this.layer].equipmentEff(this.id).mul(100))}% of Calm Point gain per second.`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return player.b.points.gte(9);}
        },
    },
})
