addLayer("b", {
    name: "boss", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        hp: new Decimal(499.999),
    }},
    color: "#FFCC66",
    resource: "Beaten Bosses", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['a'],
    layerShown(){return player.b.points.gte(1) || getLevel().gte(10)},
    getBossHP(){
        return Decimal.pow(50,player.b.points.add(1));
    },
    getBossATK(){
        return Decimal.pow(10,player.b.points.add(1));
    },
    tabFormat: [
        "main-display",
        ["bar","hp"],
        ["clickable","11"]
    ],
    bars: {
        hp: {
            fillStyle(){
                let y = player.b.hp.div(layers.b.getBossHP());
                y=y.floor();
                return {'background-color' : "hsl("+(Math.min(y.toNumber(),10)*30)+",100%,50%)"};
            },
            baseStyle(){
                let y = player.b.hp.div(layers.b.getBossHP());
                y=y.floor();
                if(y==0)return {'background-color' : "#000000"};
                return {'background-color' : "hsl("+((y.toNumber()-1)*30)+",100%,50%)"};
            },
            textStyle: {'color': '#ffffff'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                let y = player.b.hp.div(layers.b.getBossHP());
                return y.toNumber()-y.floor().toNumber();
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
                return "Use "+format(layers.b.getBossATK())+" HP to attack"
            },
            canClick(){
                return player.points.gte(layers.b.getBossATK());
            },
            onClick() {
                let y = player.b.hp.div(layers.b.getBossHP());
                player.points = player.points.sub(layers.b.getBossATK());
                player.b.hp = player.b.hp.sub(getATK().div(new Decimal(10).sub(y.floor()).max(1))).max(y.floor().sub(0.0001).mul(layers.b.getBossHP()));
            },
            unlocked: true,
        }
    },
    update(diff){
        
    }
})
