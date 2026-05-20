modInfo.name = "冒险链";
modInfo.pointsName = "生命值";
VERSION.name = "作者汉化版（基于22222的汉化版修改）";
VERSION.cnum = "2.0";
VERSION.withoutName = "v" + VERSION.num + "c" + VERSION.cnum;
VERSION.withName = "v" + VERSION.num + "c" + VERSION.cnum + " 作者汉化版（基于22222的汉化版修改）";
modInfo.useChinese = true;

displayThings = [
    "本MOD的作者：loader3229，QQ：1010903229",
    "当前残局：打败42个首领，且达到1024000级",
    function () { if (getLevel().gte(200000)) return "等级：" + formatWhole(getLevel()) + "/" + formatWhole(getLevelCap()) + " （等级缩放：" + format(getLevelScaling()) + "）"; return "等级：" + formatWhole(getLevel()) + "/" + formatWhole(getLevelCap()) + "（" + format(getLevelProgress().mul(100)) + "%）" },
    function () { return "攻击：" + format(getATK()) },
    function () { if (player.b.points.gte(1)) return "防御：" + format(getDEF()) },
    function () { if (player.b.points.gte(13)) return "伤害倍率：" + format(getDMG()) + "x" },
    "本汉化版是作者loader3229的汉化版，基于22222的汉化版修改。本汉化版与英文版共用存档。",
]

winText = "你暂时已经达到了这个树MOD的残局，但是现在...";

function initChinese() {
    layers.a.tabFormat[4][1] = function () { return "攻击：" + format(layers.a.getEnemyATK()) };
    layers.a.tabFormat[5][1] = function () { if (player.a.level.gte(20)) return "防御：" + format(layers.a.getEnemyDEF()) };
    layers.a.tabFormat[6][1] = function () { if (player.a.level.gte(4960)) return "伤害倍率：" + format(layers.a.getEnemyDMG()) };
    layers.a.tabFormat[7][1] = function () { return "经验：" + format(layers.a.getEnemyEXP()) };
    layers.a.tabFormat[8][1] = function () { if (player.b.points.gte(16)) return "金币：" + format(layers.a.getEnemyGold()) };
    layers.a.tabFormat[9][1] = function () { if (!player.b.unlocked) return "达到10级以解锁下一层" };
}

window.addEventListener("load", initChinese);