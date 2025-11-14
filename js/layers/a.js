addLayer("a", {
    name: "adventure", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        hp: new Decimal(5.05),
        level: new Decimal(1),
        nextEnemyTime: new Decimal(0)
    }},
    color: "#FF6666",
    resource: "EXP", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    getEnemyHP(){
        return player.a.level.mul(Decimal.pow(1.01,player.a.level.pow(0.5))).mul(5);
    },
    getEnemyATK(){
        return player.a.level.mul(Decimal.pow(1.01,player.a.level.pow(0.5)));
    },
    getEnemyEXP(){
        return player.a.level.pow(2.1).mul(Decimal.pow(1.021,player.a.level.pow(0.5)));
    },
    tabFormat: [
        "main-display",
        ["row",[["display-text",function(){return "Current Enemy Level: "+formatWhole(player.a.level)}],["clickable",21],["clickable",22]]],
        ["bar","hp"],
        ["display-text",function(){return "ATK: "+format(layers.a.getEnemyATK())+", EXP: "+format(layers.a.getEnemyEXP())}],
        ["clickable","11"]
    ],
    bars: {
        hp: {
            fillStyle(){
                if(player.a.nextEnemyTime.gte(0)){
                    return {'background-color' : "#999999"}
                }
                return {'background-color' : "#ff6666"}
            },
            baseStyle: {'background-color' : "#000000"},
            textStyle: {'color': '#ffffff'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                if(player.a.nextEnemyTime.gte(0)){
                    return (2-player.a.nextEnemyTime.toNumber())/2;
                }
                return (player.a.hp.div(layers.a.getEnemyHP())).toNumber()
            },
            display() {
                if(player.a.nextEnemyTime.gte(0)){
                    return "Next enemy in "+format(player.a.nextEnemyTime)+" seconds"
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
                return "Use "+format(layers.a.getEnemyATK())+" HP to deal "+format(getATK())+" damage"
            },
            canClick(){
                return player.points.gte(layers.a.getEnemyATK()) && player.a.nextEnemyTime.lte(0);
            },
            onClick() {
                player.points = player.points.sub(layers.a.getEnemyATK());
                player.a.hp = player.a.hp.sub(getATK());
            },
            unlocked: true,
        },
        21: {
            title() {
                return "-1"
            },
            canClick(){
                return player.a.level.gte(2);
            },
            onClick() {
                player.a.level = player.a.level.sub(1);
                player.a.nextEnemyTime = new Decimal(2);
                player.a.hp = layers.a.getEnemyHP();
            },
            unlocked: true,
        },
        22: {
            title() {
                return "+1"
            },
            canClick(){
                return true;
            },
            onClick() {
                player.a.level = player.a.level.add(1);
                player.a.nextEnemyTime = new Decimal(2);
                player.a.hp = layers.a.getEnemyHP();
            },
            unlocked: true,
        }
    },
    update(diff){
        if(player.a.hp.lte(0)){
            player.a.nextEnemyTime = new Decimal(2);
            player.a.hp = layers.a.getEnemyHP();
            player.a.points = player.a.points.add(layers.a.getEnemyEXP());
        }
        player.a.nextEnemyTime = player.a.nextEnemyTime.sub(diff);
    }
})
