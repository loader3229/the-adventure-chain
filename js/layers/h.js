addLayer("h", {
    name: "helper", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            autoProgress: new Decimal(0),
            clickables: { 11: new Decimal(0), 12: new Decimal(0) },
        }
    },
    color: "#FF00FF",
    resource: "helper points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 7, // Row the layer is in on the tree (0 is the first row)
    branches: ['g'],
    layerShown() { return player.b.points.gte(20) || player.g.unlocked },
    gainMult() {
        let ret = new Decimal(1);
        if (player.i.points.gte(4) || hasMilestone("i", 3)) ret = ret.mul(3);
        if (getClickableState("i", 43) == 1) ret = ret.mul(3);
        if (player.b.points.gte(29)) ret = ret.mul(player.b.points.div(20));
        return ret;
    },
    buyables: {
        11: {
            title() {
                return "Auto-Helper";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Activate " + format(data.effect) + " ticks per second<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Gold";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a);
                return a;
            },
            canAfford() {
                return player.g.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.g.points = player.g.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)

            },
            effect() {
                let eff = player[this.layer].buyables[this.id].pow(hasMilestone("j", 1) ? 1 : 0.5).mul(0.1);
                return eff;
            }

        },
        12: {
            title() {
                return "Stat Helper";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "HP gain,ATK,DEF,DMG x" + format(data.effect) + " (based on helper points)<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Gold";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(3, a).mul(100);
                return a;
            },
            canAfford() {
                return player.g.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.g.points = player.g.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = player[this.layer].buyables[this.id].mul(player[this.layer].points.add(10).log10()).div(hasMilestone("j", 5) ? 80 : 100).add(1);
                return eff;
            }, unlocked() { return player.b.points.gte(21) }

        },
        13: {
            title() {
                return "Equipment Helper";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Equipment Power +" + format(data.effect.sub(1).mul(100)) + "% (based on helper points)<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Gold";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(4, a).mul(1e4);
                return a;
            },
            canAfford() {
                return player.g.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.g.points = player.g.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = player[this.layer].buyables[this.id].mul(player[this.layer].points.add(10).log10().pow(1.5)).div(player.sac.points.gte(4) ? 40 : 100).add(1);
                return eff;
            }, unlocked() { return player.b.points.gte(25) }

        },
        21: {
            title() {
                return "EXP Helper";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "EXP Gain x" + format(data.effect) + " (based on helper points)<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Gold";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(5, a).mul(1e6);
                return a;
            },
            canAfford() {
                return player.g.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.g.points = player.g.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = player[this.layer].buyables[this.id].mul(player[this.layer].points.add(10).log10().pow(1.5)).div(10).add(1);
                return eff;
            }, unlocked() { return player.b.points.gte(39) }

        },
        22: {
            title() {
                return "Calm Helper";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Calm Point Gain x" + format(data.effect) + " (based on helper points)<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Gold";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(6, a).mul(1e8);
                return a;
            },
            canAfford() {
                return player.g.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.g.points = player.g.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = player[this.layer].buyables[this.id].mul(player[this.layer].points.add(10).log10().pow(1.5)).div(100).add(1);
                return eff;
            }, unlocked() { return player.b.points.gte(42) }

        },
        23: {
            title() {
                return "Respawn Helper";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "Level: " + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "Enemy Respawn Time x" + format(data.effect, 4) + " (based on helper points)<br>" +
                    "Also provide automation for enemy level<br>" +
                    "Cost for Next Level: " + format(data.cost) + " Gold";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(10, a);
                return a;
            },
            canAfford() {
                return player.g.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.g.points = player.g.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = player[this.layer].buyables[this.id].mul(player[this.layer].points.add(10).log10().pow(1.5)).div(1000).add(1).pow(-0.5);
                return eff;
            }, unlocked() { return player.sac.points.gte(3) }

        }

    },
    clickables: {
        11: {
            title() {
                return "Change Auto-Helper Type"
            },
            display() {
                if (player.h.clickables[11].eq(0)) {
                    return "Current Type: None. Gain 2 base helper points per helper tick.";
                } else if (player.h.clickables[11].eq(1)) {
                    return "Current Type: Auto-bulk-attack enemies per tick. Gain 1 base helper point per helper tick.";
                } else if (player.h.clickables[11].eq(2)) {
                    return "Current Type: Auto-bulk-attack bosses per tick. Gain 1 base helper point per helper tick.";
                }
            },
            canClick() {
                return true;
            },
            onClick() {
                player.h.clickables[11] = new Decimal((player.h.clickables[11].toNumber() + 1) % 3);
            },
            style() {
                if (player.h.clickables[11].eq(0)) {
                    return { "background-color": layers.h.color };
                } else if (player.h.clickables[11].eq(1)) {
                    return { "background-color": layers.a.color };

                } else if (player.h.clickables[11].eq(2)) {
                    return { "background-color": layers.b.color };

                }
            },
            unlocked: true,
        },
        12: {
            title() {
                return "Change Respawn Helper Type"
            },
            display() {
                if (player.h.clickables[12].eq(0)) {
                    return "Current Type: None. Gain 2 base helper points per enemy.";
                } else if (player.h.clickables[12].eq(1)) {
                    return "Current Type: Autoset enemy level based on enemy spawn time after enemy defeated. Gain 1 base helper point per enemy.";
                } else if (player.h.clickables[12].eq(2)) {
                    return "Current Type: Autoset enemy level based on auto-helper time after enemy defeated. Gain 1 base helper point per enemy.";
                }
            },
            canClick() {
                return true;
            },
            onClick() {
                player.h.clickables[12] = new Decimal((player.h.clickables[12].toNumber() + 1) % 3);
            },
            style() {
                if (player.h.clickables[12].eq(0)) {
                    return { "background-color": layers.h.color };
                } else if (player.h.clickables[12].eq(1)) {
                    return { "background-color": layers.a.color };
                } else if (player.h.clickables[12].eq(2)) {
                    return { "background-color": layers.b.color };
                }
            },
            unlocked() {
                return player.sac.points.gte(3);
            },
        }
    },
    update(diff) {
        if (player.b.points.gte(20)) player.h.unlocked = true;
        player.h.autoProgress = player.h.autoProgress.add(buyableEffect("h", 11).mul(diff));
        if (player.h.autoProgress.gte(1)) {
            if (player.h.clickables[11].eq(0)) player.h.points = player.h.points.add(player.h.autoProgress.mul(layers.h.gainMult()));
            else if (player.h.clickables[11].eq(1)) layers.a.clickables[12].onClick();
            else if (player.h.clickables[11].eq(2)) layers.b.clickables[12].onClick();
            player.h.points = player.h.points.add(player.h.autoProgress.mul(layers.h.gainMult()));
            player.h.autoProgress = new Decimal(0);
        }
    },
    hotkeys: [
        { key: "h", description: "h: change auto-helper type", onPress() { if (player.b.points.gte(20)) layers.h.clickables[11].onClick(); } },
    ],
    doReset(layer) {
        if (layer == "i" || layer == "j" || layer == "k") {
            if ((player.i.points.gte(1000) && player.sac.points.gte(5)) || hasMilestone("i", 22)) layerDataReset("h", ["points", "clickables", "buyables", "upgrades"]);
            else if (player.i.points.gte(4) || hasMilestone("i", 3)) layerDataReset("h", ["points", "buyables", "upgrades"]);
            else layerDataReset("h", ["points", "upgrades"]);
            updateTemp();
        }
    },
});