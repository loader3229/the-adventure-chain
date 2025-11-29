addLayer("c", {
	name: "calm", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() {
		return {
			unlocked: false,
			points: new Decimal(0),
		}
	},
	color: "#66FF66",
	resource: "Calm Points", // Name of prestige currency
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	requires: new Decimal(100),
	exponent() {
		ret = new Decimal(2);
		if (hasMilestone("c", 5)) ret = ret.add(0.6);
		if (player.b.points.gte(5)) ret = ret.add(0.4);
		return ret;
	},
	baseResource: "levels", // Name of resource prestige is based on
	baseAmount() {
		return getLevel();
	},
	row: 2, // Row the layer is in on the tree (0 is the first row)
	branches: ['b'],
	layerShown() { return player.b.points.gte(3) || player.c.unlocked },
	tabFormat: {
		"Main Tab": {
			"content": [
				"main-display",
				"prestige-button",
				"resource-display",
				"upgrades",
				"milestones"
			]
		}, "Buyables": {
			"content": [
				"main-display",
				"prestige-button",
				"resource-display",

				"buyables"
			], unlocked: function () { return hasMilestone("c", 4) }
		}
	},
	roundUpCost: true,
	hotkeys: [
		{ key: "c", description: "c: reset for calm points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
	],
	gainMult() {
		let ret = new Decimal(1);
		if (player.b.points.gte(4)) ret = ret.mul(player.b.points);
		ret = ret.mul(buyableEffect("c", 11));
		if (hasUpgrade("c", 11)) ret = ret.mul(upgradeEffect("c", 11));
		ret = ret.mul(layers.d.effect());
		return ret;
	},
	effect() {
		let ret = player.c.points.add(1);
		if (ret.gte(10)) ret = Decimal.pow(10, ret.log10().sqrt().mul(2).sub(1));
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
		let eff = this.effect();
		return "translated to a " + format(eff) + "x multiplier to EXP gain"
	},
	milestones: [
		{
			requirementDescription: "1st calm reset",
			done() { return player.c.unlocked }, // Used to determine when to give the milestone
			effectDescription: "Gain more EXP from enemies.",
		},
		{
			requirementDescription: "5 calm points",
			done() { return player.c.points.gte(5) }, // Used to determine when to give the milestone
			effectDescription: "Passively gain EXP based on your level.",
		},
		{
			requirementDescription: "20 calm points",
			done() { return player.c.points.gte(20) }, // Used to determine when to give the milestone
			effectDescription: "1.1x HP gain, ATK and DEF.",
		},
		{
			requirementDescription: "100 calm points",
			done() { return player.c.points.gte(100) }, // Used to determine when to give the milestone
			effectDescription: "Reduce level requirement and increase level cap.",
		},
		{
			requirementDescription: "300 calm points",
			done() { return player.c.points.gte(300) }, // Used to determine when to give the milestone
			effectDescription: "Unlock calm buyables.",
		},
		{
			requirementDescription: "1000 calm points",
			done() { return player.c.points.gte(1000) }, // Used to determine when to give the milestone
			effectDescription: "Calm point gain is better.",
		},
		{
			requirementDescription: "4000 calm points",
			done() { return player.c.points.gte(4000) }, // Used to determine when to give the milestone
			effectDescription: "Reduce level requirement.",
		},
	],
	update(diff) {
		if (hasMilestone("c", 1)) player.a.points = player.a.points.add(getLevel().pow(player.d.activeChallenge ? 0.5 : 2).mul(diff).mul(layers.a.getEXPMult()));
	},
	upgrades: {
		11: {
			description: "Each calm upgrade double calm point gain.",
			cost: new Decimal(1e4),
			effect: function () { return Decimal.pow(2, player.c.upgrades.length) },
			effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
		},
		12: {
			description: "Unlock a new calm buyable.",
			cost: new Decimal(1e5)
		},
		13: {
			description: "Deal more damage to bosses based on calm upgrades.",
			cost: new Decimal(1e6),
			effect: function () { return Decimal.pow(2, player.c.upgrades.length) },
			effectDisplay: function () { return format(upgradeEffect(this.layer, this.id)) + "x" }
		},
		14: {
			description: "Unlock a new calm buyable.",
			cost: new Decimal(1e7),
			unlocked(){return player.b.points.gte(7)}
		},
		15: {
			description: "Unlock a new equipment type, equipment shard effect is better.",
			cost: new Decimal(3e8),
			unlocked(){return player.e.unlocked}
		},
		21: {
			description: "Unlock a new domain. Domain Points reduce damage taken when attacking boss.",
			cost: new Decimal(1e10),
			unlocked(){return player.e.unlocked},
			effect: function () { return player.d.points.mul(0.05).add(1) },
			effectDisplay: function () { return "/"+format(upgradeEffect(this.layer, this.id)) }
		}
	},
	buyables: {
		11: {
			title() {
				return "Calm Point";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"Calm Point gain x" + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Calm Points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(2, a).mul(100);
				return a;
			},
			canAfford() {
				return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
			},
			buy() {
				player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

			},
			effect() {
				let eff = new Decimal(1).add(player[this.layer].buyables[this.id]);
				return eff;
			}
		},
		12: {
			title() {
				return "ATK";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"ATK x" + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Calm Points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(3, a).mul(100);
				return a;
			},
			canAfford() {
				return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
			},
			buy() {
				player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

			},
			effect() {
				let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
				return eff;
			}
		},
		13: {
			title() {
				return "DEF";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"DEF x" + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Calm Points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(3, a).mul(150);
				return a;
			},
			canAfford() {
				return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
			},
			buy() {
				player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

			},
			effect() {
				let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
				return eff;
			}
		},
		21: {
			title() {
				return "HP Gain";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"HP gain x" + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Calm Points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(3, a).mul(200);
				return a;
			},
			canAfford() {
				return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
			},
			buy() {
				player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

			},
			effect() {
				let eff = new Decimal(1).add(player[this.layer].buyables[this.id].div(20));
				return eff;
			}
		},
		22: {
			title() {
				return "Level Scaling";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"Level scaling factor +" + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Calm Points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(4, a).mul(1e4);
				return a;
			},
			canAfford() {
				return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
			},
			buy() {
				player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

			},
			effect() {
				let eff = new Decimal(0).add(player[this.layer].buyables[this.id].div(20));
				return eff;
			},
			unlocked() { return hasUpgrade("c", 12) }
		},
		23: {
			title() {
				return "EXP Gain";
			},
			display() {
				let data = tmp[this.layer].buyables[this.id];
				return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
					"EXP gain x" + format(data.effect) + "<br>" +
					"Cost for Next Level: " + format(data.cost) + " Calm Points";
			},
			cost() {
				let a = player[this.layer].buyables[this.id];
				a = Decimal.pow(3, a).mul(1e6);
				return a;
			},
			canAfford() {
				return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost())
			},
			buy() {
				player[this.layer].points = player[this.layer].points.sub(layers[this.layer].buyables[this.id].cost())
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
			effect() {
				let eff = new Decimal(1).add(player[this.layer].buyables[this.id]);
				return eff;
			},
			unlocked() { return hasUpgrade("c", 14) }
		},

	},


		doReset(layer) { },
passiveGeneration(){
if(player.b.points.gte(9))return layers.e.equipmentEff(13).toNumber();
else return 0;
},
})
