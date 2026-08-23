addLayer("bonus1", {
    name: "bonus1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B1", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            hp: new Decimal(729),
            php: new Decimal(0),
            dp: 0,
            phpmax: new Decimal(1),
            cd: 0,
            setLevel: new Decimal(1),
            level: new Decimal(1),
            running: false,
            aprog: 0,
            aspeed: 0,
  status: 0,
heal: 0,
        }
    },
    color: "#FFFFFF",
    resource() { return modInfo.useChinese ? "最佳小游戏1等级" : "Best Minigame 1 Level"; }, // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() { return true },
    baseResource() { return modInfo.useChinese ? "生命值" : "HP"; }, // Name of resource prestige is based on
    baseAmount() {
        return player.points;
    },
    getEnemyHP(level) {
        if (level === undefined) level = player.bonus1.level;
        return Decimal.pow(1.5, level).mul(486);
    },
    getEnemyATK(level) {
        if (level === undefined) level = player.bonus1.level;
        return Decimal.pow(1.5, level).mul(player.bonus1.phpmax).div(player.bonus1.phpmax.add(2).log10()).div(getDEF().add(2).log10());
    },
    getSkip(){
        return getPointGen().add(2).log10().mul(getATK().add(2).log10()).mul(getDEF().add(2).log10()).mul(getDMG().add(2).log10()).log(2.25).sub(7).floor().max(player.bonus1.points);
    },
    tabFormat: [
        "main-display",
        //["row", [["display-text", function () { return modInfo.useChinese ? "设置小游戏等级：" : "Set Minigame Level: " }], ["text-input", "setLevel"], ["clickable", 21], ["clickable", 22]]],
        ["row", [["display-text", function () { return (modInfo.useChinese ? "当前小游戏等级：" : "Current Minigame Level: ") + formatWhole(player.bonus1.level) }], ["clickable", 21], ["clickable", 22]]],["display-text", function () { return (modInfo.useChinese ? "可设置的等级范围：1-" : "Selectable Minigame Level Range: 1-") + formatWhole(layers.bonus1.getSkip().add(1)) }],
        ["bar", "dp"],
        ["bar", "hp"],
        ["bar", "ap"],
        ["row", [["clickable", "11"],["clickable", "14"]]],
        ["blank"],
        ["display-text", function () { return (player.bonus1.running ? (modInfo.useChinese ? "小游戏正在进行中" : "Minigame is running") : (player.bonus1.php.lte(0) ? (modInfo.useChinese ? "你失败了！" : "You Lose!") : player.bonus1.hp.lte(0) ? (modInfo.useChinese ? "你胜利了！" : "You Win!") : (modInfo.useChinese ? "你失败了！" : "You Lose!")) )  }],
        ["blank"],
        ["bar", "php"],
        ["row", [["clickable", "12"],["clickable", "13"]]],
    ],
    bars: {
        hp: {
            fillStyle() {
                return { 'background-color': "#ff6666" }
            },
            baseStyle: { 'background-color': "#000000" },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                return (player.bonus1.hp.div(layers.bonus1.getEnemyHP())).toNumber()
            },
            unlocked: true
        },
        ap: {
            fillStyle() {
                return { 'background-color': "#999999" }
            },
            baseStyle: { 'background-color': "#000000" },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                return (player.bonus1.aprog ** 2);
            },
            unlocked: true
        },
        dp: {
            fillStyle() {
                return { 'background-color': "#ddbb00" }
            },
            baseStyle: { 'background-color': "#000000" },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                return (player.bonus1.dp ** 1.5);
            },
            unlocked: true
        },
        php: {
            fillStyle() {
                return { 'background-color': "#ff6666" }
            },
            baseStyle: { 'background-color': "#000000" },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                return (player.bonus1.php.div(player.bonus1.phpmax)).toNumber()
            },
            display() {
                return (modInfo.useChinese ? "小游戏生命值：" : "Minigame HP: ")+`${format(player.bonus1.php)} / ${format(player.bonus1.phpmax)}`
            },
            unlocked: true
        }
    },
    clickables: {
        11: {
            title() {
                return (modInfo.useChinese ? "攻击（E）" : "Attack (E)")
            },
            display() {
                return (modInfo.useChinese ? "冷却：" : "Cooldown: ") + format(player.bonus1.cd) + (modInfo.useChinese ? "秒" : " seconds")
            },
            canClick() {
                return player.bonus1.running == true && player.bonus1.cd <= 0;
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                player.bonus1.cd = 0.6;
		if(player.bonus1.aprog < 0.95){
			player.bonus1.hp = player.bonus1.hp.sub(getATK().add(2).log10().mul(getDMG().add(2).log10()));
			if(player.bonus1.status == 1)player.bonus1.hp = player.bonus1.hp.sub(getATK().add(2).log10().mul(getDMG().add(2).log10()).mul(4));
			player.bonus1.dp += (getATK().add(2).log10().cbrt().toNumber() + getDMG().add(2).log10().cbrt().toNumber()) / player.bonus1.level.sqrt().toNumber() * 0.01;
		}else{
			player.bonus1.dp += (getATK().add(2).log10().cbrt().toNumber() + getDMG().add(2).log10().cbrt().toNumber()) / player.bonus1.level.sqrt().toNumber() * (player.bonus1.aprog - 0.91) / 2;
			player.bonus1.aprog = 0;
			player.bonus1.aspeed = 0.18 + Math.random() * 0.4;
		}
		if(player.bonus1.hp.lte(0)){
			player.bonus1.running = false;
			player.bonus1.points = player.bonus1.points.max(player.bonus1.level);
		}
            },
            unlocked: true,
        },
        12: {
            title() {
                return (modInfo.useChinese ? "开始小游戏" : "Start Minigame")
            },
            display() {
                return (modInfo.useChinese ? "使用50%的生命值开始游戏" : "Use 50% of your HP to start")
            },
            canClick() {
                return player.bonus1.running == false;
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                player.bonus1.php = player.bonus1.phpmax = player.points = player.points.div(2);
                player.bonus1.hp = layers.bonus1.getEnemyHP();
		player.bonus1.dp = 0;
		player.bonus1.cd = 0;
                player.bonus1.aspeed = 0.5;
                player.bonus1.aprog = 0;
		player.bonus1.running = true;
		player.bonus1.status = 0;
		player.bonus1.heal = 5;
            },
            unlocked: true,
        },
        13: {
            title() {
                return (modInfo.useChinese ? "停止小游戏" : "Stop Minigame")
            },
            display() {
                return (modInfo.useChinese ? "停止小游戏" : "Stop Minigame")
            },
            canClick() {
                return player.bonus1.running == true;
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                player.bonus1.php = new Decimal(0);
            },
            unlocked: true,
        },
        14: {
            title() {
                return (modInfo.useChinese ? "治疗" : "Heal")
            },
            display() {
                return (modInfo.useChinese ? "剩余次数：" : "Time Remaining: ") + player.bonus1.heal + "/5" 
            },
            canClick() {
                return player.bonus1.running == true && player.bonus1.cd <= 0 && player.bonus1.heal > 0;
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
		player.bonus1.heal--;
                player.bonus1.cd = 0.45;
		player.bonus1.php = player.bonus1.php.add(player.bonus1.phpmax.mul(0.4)).min(player.bonus1.phpmax);
            },
            unlocked: true,
        },
        21: {
            title() {
                return "-1"
            },
            canClick() {
                return player.bonus1.level.gte(2) && player.bonus1.running == false;
            },
            onClick() {
                player.bonus1.setLevel = player.bonus1.level = player.bonus1.level.sub(1);
                player.bonus1.hp = layers.bonus1.getEnemyHP();
		player.bonus1.dp = 0;
                player.bonus1.php = new Decimal(0);
                player.bonus1.phpmax = new Decimal(1);
                player.bonus1.aprog = 0;
		player.bonus1.status = 0;
		player.bonus1.heal = 0;
            },
            style: { 'width': "60px", 'min-height': "60px" },
            unlocked: true,
        },
        22: {
            title() {
                return "+1"
            },
            canClick() {
                return player.bonus1.level.lte(layers.bonus1.getSkip()) && player.bonus1.running == false;
            },
            onClick() {
                player.bonus1.setLevel = player.bonus1.level = player.bonus1.level.add(1);
                player.bonus1.hp = layers.bonus1.getEnemyHP();
		player.bonus1.dp = 0;
                player.bonus1.php = new Decimal(0);
                player.bonus1.phpmax = new Decimal(1);
                player.bonus1.aprog = 0;
		player.bonus1.status = 0;
		player.bonus1.heal = 0;
            },
            style: { 'width': "60px", 'min-height': "60px" },
            unlocked: true,
        }
    },
    update(diff) {
	if(player.bonus1.running){
		player.bonus1.cd = Math.max(player.bonus1.cd - diff, 0);
		player.bonus1.aprog = player.bonus1.aprog + diff * (1 + Math.random()) * player.bonus1.aspeed;
		player.bonus1.dp = player.bonus1.dp - diff * 0.01;
		if(player.bonus1.dp >= 1){
			player.bonus1.status = 1;
		}
		if(player.bonus1.status == 1){
			player.bonus1.dp = player.bonus1.dp - diff * 0.15;
			player.bonus1.aprog = 0;
			if(player.bonus1.dp <= 0)player.bonus1.status = 0;
		}
                if(player.bonus1.aprog >= 1.05){
			player.bonus1.php = player.bonus1.php.sub(layers.bonus1.getEnemyATK().mul(Math.random()+1)).max(0);
			player.bonus1.aprog = 0;
			player.bonus1.aspeed = 0.2 + Math.random() * 0.5;
			player.bonus1.cd = Math.max(player.bonus1.cd,0.3);
                }
		if(player.bonus1.php.lte(0)){
			player.bonus1.running = false;
		}
	}
    },
    hotkeys: [
        { key: "e", description: "e: attack enemy in minigame", onPress() { layers.bonus1.clickables[11].onClick(); } },
    ],

})
