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
                ["display-text", function(){return "You have "+formatWhole(player.f.t1)+" Tier 1 machines"}],
                ["display-text", function(){if(player.f.maxTier.gte(2))return "You have "+formatWhole(player.f.t2)+" Tier 2 machines";return ""}],
                ["display-text", function(){if(player.f.maxTier.gte(3))return "You have 1 Tier "+formatWhole(player.f.maxTier)+" machine";return ""}],
                "buyables"
            ]
        }
    },
gainMult(){
	return new Decimal(1);
},
gainMultT1(){
	return new Decimal(1);
},
gainMultT2(){
	return new Decimal(1);
},
    update(diff) {
        if (player.b.points.gte(11)){
player.f.unlocked = true;
player.f.points=player.f.points.add(layers.f.gainMult().mul(diff).mul(player.f.t1));
player.f.t1=player.f.t1.add(layers.f.gainMultT1().mul(diff).mul(player.f.t2));
if(player.f.maxTier.gte(3))player.f.t2=player.f.t2.root(player.f.maxTier.sub(2)).add(layers.f.gainMultT2().mul(diff)).pow(player.f.maxTier.sub(2));
}
    },
effect(){
	return Decimal.pow(2,player.f.points.add(1).log10().sqrt());
},
effectDescription(){
	return "translated to "+format(layers.f.effect())+"x Calm Points and Equipment Shards";
},
buyables: {
}
})
