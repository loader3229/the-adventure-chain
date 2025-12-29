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
gainMult(x){
	if(x === undefined)x = new Decimal(0);
	x = x.pow(2).div(300000);
	x = x.mul(buyableEffect("c",31));
if(player.b.points.gte(11))x = x.mul(player.b.points);
		x = x.mul(layers.f.effect());

	return x;
},
    update(diff) {
        if (player.b.points.gte(8)) player.e.unlocked = true;
    },
    types() {
        let types = [11];
	if(hasUpgrade("c",15))types.push(12);
	if(player.b.points.gte(9))types.push(13);
	if(hasUpgrade("c",22))types.push(14);
	if(player.b.points.gte(15))types.push(21);
	if(player.b.points.gte(15))types.push(22);
	if(player.b.points.gte(18))types.push(23);
	if(player.b.points.gte(19))types.push(24);
    return types;
},
    drop(level) {
        if (level === undefined)return "Haha";
	player.e.drop = "Enemy drop: ";
	let types = layers.e.types();
	let count = 1;
	if(player.b.points.gte(11))count++;
	if(player.b.points.gte(15))count++;
        if(player.a.equipmentShard){
              let power = layers.e.effect().add(layers.e.effect2());
              let gain=layers.e.gainMult(level.mul(power)).mul(count**1.1).mul(1.1);
             player.e.points = player.e.points.add(gain);
             player.e.drop += format(gain) +" Equipment Shards";
              return player.e.drop;
        }
	for(i=0;i<count;i++){
		let type=types[Math.floor(types.length*Math.random())];
        	let power = layers.e.effect().mul(Math.random()).add(layers.e.effect2());
        	
		if(i)player.e.drop += "; ";
		player.e.drop += layers.e.clickables[type].title+" Level "+formatWhole(level)+", Power: "+formatWhole(power.mul(100))+"%";
layers.e.equip(type,level,power);
	}
	return player.e.drop;
    },
    equip(type,level,power){
        if(type === undefined)return new Decimal(0);
        let x = Decimal.mul(player.e.equipment[type].level,player.e.equipment[type].power);
	let y = level.mul(power);
	if(y.gte(x)){
			player.e.equipment[type].level=level;
			player.e.equipment[type].power=power;
		}
		player.e.points = player.e.points.add(layers.e.gainMult(x.min(y)));
    },
    equipmentEff(type){
	if(type === undefined)return new Decimal(0);
	let x = Decimal.mul(player.e.equipment[type].level,player.e.equipment[type].power);
	if(type==11){
		return softcap(x.div(hasUpgrade("c",33)?50000:60000),new Decimal(2));
	}
	if(type==12){
		return Decimal.pow(1.01,x.pow(0.5));
	}
	if(type==13){
		return new Decimal(1).sub(Decimal.pow(0.995,x.pow(0.5)));
	}
	if(type==14){
		return x.div(hasUpgrade("c",33)?2000:3000).add(1);
	}
	if(type>=21 && type<=24){
		if(hasUpgrade("g",14))return Decimal.pow(1.01,x.pow(0.3)).max(x.pow(0.3).div(90).add(1));
		return Decimal.pow(1.01,x.pow(0.3).sub(20)).max(x.pow(0.3).div(100).add(1));
	}
	return new Decimal(0);
},
effect(){
	let ret=player.e.points.add(10).log10().div(hasUpgrade("c",15)?4:10);
	return ret;
},
effect2(){
	let ret=new Decimal(1);
	if(hasUpgrade("c",24))ret = ret.add(0.5);
	if(hasUpgrade("g",13))ret = ret.add(0.5);
	if(hasUpgrade("g",22))ret = ret.add(0.5);
	if(hasMilestone("c",14))ret = ret.add(0.5);
	if(player.b.points.gte(14))ret = ret.add(player.e.points.add(10).log10().div(player.b.points.gte(22)?8:10));
	return ret;
},
effectDescription(){
	return "equipment power range: "+formatWhole(layers.e.effect2().mul(100))+"% - "+formatWhole(layers.e.effect().add(layers.e.effect2()).mul(100))+"%";
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
        14: {
            title: "Calm Gem",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: Calm Point Gain x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return hasUpgrade("c",22);}
        },
        21: {
            title: "Weapon",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: ATK x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return player.b.points.gte(15);}
        },
        22: {
            title: "Armor",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: DEF x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return player.b.points.gte(15);}
        },
        23: {
            title: "Helmet",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: HP gain x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return player.b.points.gte(18);}
        },
        24: {
            title: "Shoes",
            display: function(){
                return `Level: ${formatWhole(player[this.layer].equipment[this.id].level)}<br>Power: ${formatWhole(player[this.layer].equipment[this.id].power.mul(100))}%<br>Effect: DMG x${format(layers[this.layer].equipmentEff(this.id))}`;
            },
            canClick: false,
            style: {"background-color": "#6699FF"},
unlocked(){return player.b.points.gte(19);}
        },
    },
})
