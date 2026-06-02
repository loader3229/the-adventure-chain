addLayer("i", {
    name: "imaginary",
    symbol: "I",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            power: new Decimal(0),
            y: new Decimal(1024),
            infDmg: new Decimal(0),
            infTime: new Decimal(0),
        }
    },
    color: "#00CCCC",
    resource: "Imaginary Points", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires() {
        return new Decimal(1e5);
    },
    gainMult() {
        let ret = new Decimal(1);
        if (player.b.points.gte(27)) ret = ret.mul(player.b.points.sub(26).pow(0.6).add(1));
        if (hasUpgrade("c", 45)) ret = ret.mul(1.1);
        if (hasUpgrade("g", 25)) ret = ret.mul(1.1);
        if (hasMilestone("i", 4)) ret = ret.mul(1.25);
        if (hasMilestone("i", 6)) ret = ret.mul(layers.i.infEff());
        if (hasMilestone("j", 9)) ret = ret.mul(player.j.points.add(1).pow(0.02));
        if (getClickableState("i", 42) == 1) ret = ret.mul(1.1);
        return ret;
    },
    getResetGain() {
        if (getLevel().lt(1e5)) return new Decimal(0);
        let ret = getLevel().sub(1e5).div(1e3).root(3).add(1).mul(layers.i.gainMult()).floor();
        return ret;
    },
    getNextAt() {
        let ret = layers.i.getResetGain().add(1).div(layers.i.gainMult()).sub(1).pow(3).mul(1e3).add(1e5).max(1e5);
        return ret;
    },
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {
        return getLevel();
    },
    row: 8, // Row the layer is in on the tree (0 is the first row)
    branches: ['h'],
    layerShown() { return player.b.points.gte(26) || player.i.unlocked },
    hotkeys: [
        { key: "i", description: "i: reset for imaginary points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    effect() {
        let ret = Decimal.pow(10, player.i.points.mul(layers.i.infEff()).add(1).log10().sqrt());
        return ret;
    },
    effectDescription() { // Optional text to describe the effects
        let eff = this.effect();
        return "translated to a " + format(eff) + "x multiplier to EXP gain and damage to bosses"
    },
    milestones: [
        {
            requirementDescription: "1 imaginary point",
            done() { return player.i.points.gte(1) }, // Used to determine when to give the milestone
            effectDescription: "Calm point gain is better, and imaginary points add to max level. Keep helper points when imaginary reset. Autobuy calm buyables and buying calm buyables doesn't reduce your calm points.",
        },
        {
            requirementDescription: "2 imaginary points",
            done() { return player.i.points.gte(2) }, // Used to determine when to give the milestone
            effectDescription: "Keep some of domain completions based on imaginary points. (minimum 25%, reach 100% at 125 imaginary points)",
        },
        {
            requirementDescription: "3 imaginary points",
            done() { return player.i.points.gte(3) }, // Used to determine when to give the milestone
            effectDescription: "Passive Gem is better. Start with a level 10k Passive Gem with 1000% power. Also starts with first 8 calm milestones.",
        },
        {
            requirementDescription: "4 imaginary points",
            done() { return player.i.points.gte(4) }, // Used to determine when to give the milestone
            effectDescription: "Triple helper points gain, keep all helpers when imaginary reset.",
        },
        {
            requirementDescription: "5 imaginary points",
            done() { return player.i.points.gte(5) }, // Used to determine when to give the milestone
            effectDescription: "1.25x imaginary points gain. +5 domain max completions.",
        },
        {
            requirementDescription: "7 imaginary points",
            done() { return player.i.points.gte(7) }, // Used to determine when to give the milestone
            effectDescription: "Imaginary Points effect boost Calm Points.",
        },
        {
            requirementDescription: "10 imaginary points",
            done() { return player.i.points.gte(10) }, // Used to determine when to give the milestone
            effectDescription: "Unlock the Infinity Boss.",
        },
        {
            requirementDescription: "15 imaginary points",
            done() { return player.i.points.gte(15) }, // Used to determine when to give the milestone
            effectDescription: "Imaginary Points effect boost equipment shards.",
        },
        {
            requirementDescription: "20 imaginary points",
            done() { return player.i.points.gte(20) }, // Used to determine when to give the milestone
            effectDescription: "Start with first 7 gold upgrades and first 12 calm milestones.",
        },
        {
            requirementDescription: "30 imaginary points",
            done() { return player.i.points.gte(30) }, // Used to determine when to give the milestone
            effectDescription() { if (player.sac.points.gte(4)) return "Calm buyable 'EXP Gain' is cheaper."; return "Reduce post-100k additional level scaling."; },
        },
        {
            requirementDescription: "50 imaginary points",
            done() { return player.i.points.gte(50) }, // Used to determine when to give the milestone
            effectDescription: "Calm buyable 'Level Scaling' is cheaper.",
        },
        {
            requirementDescription: "75 imaginary points",
            done() { return player.i.points.gte(75) }, // Used to determine when to give the milestone
            effectDescription: "Deal 10x damage to bosses.",
        },
        {
            requirementDescription: "100 imaginary points",
            done() { return player.i.points.gte(100) }, // Used to determine when to give the milestone
            effectDescription() { if (player.sac.points.gte(4)) return "Calm buyable 'Equipment Shard Gain' is cheaper."; return "Remove post-100k additional level scaling."; },
        },
        {
            requirementDescription: "125 imaginary points",
            done() { return player.i.points.gte(125) }, // Used to determine when to give the milestone
            effectDescription: "Infinity Boss Total Damage effect boost HP gain, keep all domain completions.",
        },
        {
            requirementDescription: "150 imaginary points",
            done() { return player.i.points.gte(150) }, // Used to determine when to give the milestone
            effectDescription: "Infinity Boss Total Damage effect boost ATK.",
        },
        {
            requirementDescription: "200 imaginary points",
            done() { return player.i.points.gte(200) }, // Used to determine when to give the milestone
            effectDescription: "Infinity Boss Total Damage effect boost DEF.",
        },
        {
            requirementDescription: "250 imaginary points",
            done() { return player.i.points.gte(250) }, // Used to determine when to give the milestone
            effectDescription: "Infinity Boss Total Damage effect boost DMG.",
        },
        {
            requirementDescription: "300 imaginary points",
            done() { return player.i.points.gte(300) }, // Used to determine when to give the milestone
            effectDescription: "Start with first 15 calm upgrades.",
        },
        {
            requirementDescription: "400 imaginary points",
            done() { return player.i.points.gte(400) }, // Used to determine when to give the milestone
            effectDescription: "Start with first 15 calm milestones.",
        },
        {
            requirementDescription: "500 imaginary points",
            done() { return player.i.points.gte(500) }, // Used to determine when to give the milestone
            effectDescription: "Start with first 8 types of equipments, level 10k and 1000% power.",
        },
        {
            requirementDescription: "650 imaginary points",
            done() { return (player.i.points.gte(650) && player.b.points.gte(37)) }, // Used to determine when to give the milestone
            unlocked() { return player.b.points.gte(37) },
            effectDescription: "Scrap effect is better.",
        },
        {
            requirementDescription: "800 imaginary points",
            done() { return (player.i.points.gte(800) && player.b.points.gte(37)) }, // Used to determine when to give the milestone
            unlocked() { return player.b.points.gte(37) },
            effectDescription: "Unlock Imaginary Power and Imaginary Tree.",
        },
        {
            requirementDescription: "1000 imaginary points",
            done() { return (player.i.points.gte(1000) && player.sac.points.gte(5)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Keep automation status in Helper layer.",
        },
        {
            requirementDescription: "1500 imaginary points",
            done() { return (player.i.points.gte(1500) && player.sac.points.gte(5)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Start with first 10 gold upgrades.",
        },
        {
            requirementDescription: "2000 imaginary points",
            done() { return (player.i.points.gte(2000) && player.sac.points.gte(5)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Start with first 20 calm upgrades.",
        },
        {
            requirementDescription: "3000 imaginary points",
            done() { return (player.i.points.gte(3000) && player.sac.points.gte(5)) }, // Used to determine when to give the milestone
            unlocked() { return player.sac.points.gte(5) },
            effectDescription: "Start with first 20 calm milestones.",
        },
    ],
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones"
            ]
        }, "Infinity Boss": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["column", [["raw-html", function () {
                    let y = Math.ceil(player.i.y.toNumber());
                    return "<div style=width:400px;text-align:right;>x" + y + "</div>";
                }], ["bar", "hp"]]],
                "blank",
                ["display-text", "Damage to boss multiplier is applied to damage to Infinity Boss."],
                ["display-text", "Damage multiplier to Infinity Boss has a time factor, that resets on attack."],
                ["display-text", function () { return "Total Damage Dealt to Infinity Boss: " + format(Decimal.pow(2, Decimal.sub(1024, player.i.y)).sub(1)) }],
                ["display-text", function () { return "Total Damage Dealt to Infinity Boss will increase Imaginary point's effect, and increase Imaginary point" + (hasMilestone("i", 21) ? ", power and essence" : "") + " gain to " + format(layers.i.infEff()) + "x." }],
                ["row", [["clickable", "11"]]],
            ], unlocked: function () { return hasMilestone("i", 6) }
        }, "Imaginary Tree": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                ["display-text", function () { return "You have " + format(player.i.power) + " Imaginary Power. (+" + format(layers.i.getPowerGain()) + "/s)" }],
                ["display-text", function () { return "You have " + format(tmp.i.getEssence.sub(tmp.i.usedEssence)) + "/" + format(tmp.i.getEssence) + " Imaginary Essence." }],
                ["clickable", 12], "blank",
                ["clickables", [2]], "blank",
                ["clickables", [3]], "blank",
                ["clickables", [4]], "blank",
                ["clickables", [5]], "blank",

            ], unlocked: function () { return hasMilestone("i", 21) }
        }
    },
    bars: {
        hp: {
            fillStyle() {
                let y = Math.ceil(player.i.y.toNumber());

                if (y <= 0) return { 'background-color': "#000000" };
                return { 'background-color': "hsl(" + ((y - 1) * 150) + ",100%," + (40 + 60 * Math.pow(1 / 2, y)) + "%)" };
            },
            baseStyle() {
                let y = Math.ceil(player.i.y.toNumber());

                if (y <= 1) return { 'background-color': "#000000", 'transition-duration': '0s' };
                return { 'background-color': "hsl(" + ((y - 2) * 150) + ",100%," + (40 + 60 * Math.pow(1 / 2, y - 1)) + "%)", 'transition-duration': '0s' };
            },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                let y = player.i.y.toNumber();
                return y - Math.ceil(y) + 1;
            },
            unlocked: true, instant: true,
            display() {
                return `${format(Decimal.pow(2, 1024).sub(Decimal.pow(2, Decimal.sub(1024, player.i.y)).sub(1)))} / ${format(Decimal.pow(2, 1024))}`
            },
        }
    },
    update(diff) {
        if (hasMilestone("i", 6)) player.i.infTime = player.i.infTime.add(diff);
        if (hasMilestone("i", 21)) player.i.power = player.i.power.add(layers.i.getPowerGain().mul(diff));
    },
    clickables: {
        11: {
            title() {
                return "Attack"
            },
            display() {
                return "Damage multiplier: " + format(layers.i.infMult(), 2, true) + "x";
            },
            canClick() {
                return true;
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                player.i.infDmg = player.i.infDmg.add(getATK().mul(getDMG()).mul(layers.i.infMult()));
                player.i.infTime = new Decimal(0);
            },
            unlocked: true,
        },
        12: {
            title() {
                return "Respec Tree"
            },
            display() {
                return "Force Imaginary Reset";
            },
            canClick() {
                return true;
            },
            onClick() {
                for (i in player.i.clickables) if (player.i.clickables[i] == 1) player.i.clickables[i] = 0;
                doReset("i", true);
            },
            unlocked: true,
        },
        21: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "Max Domain Completions +5.<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost()))) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked: true,
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
        },
        31: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "+200% Equipment Power<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[21] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[21] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked: true,
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["21"] },

        },
        32: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "+2 Level Scaling<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[21] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[21] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked: true,
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["21"] },

        },
        41: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "Joker gain x2<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[31] == 1 && player.i.clickables[32] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[31] == 1 && player.i.clickables[32] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked: true,
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["31", "32"] },

        },
        42: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "Imaginary Point gain x1.1<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[31] == 1 && player.i.clickables[32] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[31] == 1 && player.i.clickables[32] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked() { return player.sac.points.gte(5) },
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["31", "32"] },

        },
        43: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "Helper Point gain x3<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[31] == 1 && player.i.clickables[32] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[31] == 1 && player.i.clickables[32] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked() { return player.sac.points.gte(5) },
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["31", "32"] },

        },
        51: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "+200% Equipment Power<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[41] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[41] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked: true,
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["41"] },

        },
        52: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "Calm Point gain x2<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[41] == 1 && player.i.clickables[42] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[41] == 1 && player.i.clickables[42] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked() { return player.sac.points.gte(5) },
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["41", "42"] },

        },
        53: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "EXP gain x3<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[42] == 1 && player.i.clickables[43] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[42] == 1 && player.i.clickables[43] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked() { return player.sac.points.gte(5) },
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["42", "43"] },
        },
        54: {
            title() {
                return this.id;
            },
            cost() {
                return new Decimal(4);
            },
            display() {
                return "+2 Level Scaling<br>Cost: 4 Imaginary Essence";
            },
            canClick() {
                return tmp.i.getEssence.gte(tmp.i.usedEssence.add(this.cost())) && player.i.clickables[this.id] != 1 && player.i.clickables[43] == 1;
            },
            onClick() {
                if (layers.i.getEssence().gte(layers.i.usedEssence().add(this.cost())) && player.i.clickables[43] == 1) {
                    player.i.clickables[this.id] = 1;
                }
            },
            unlocked: true,
            style() { return { 'background-color': (getClickableState(this.layer, this.id) == 1) ? "#77BF5F" : tmp.i.clickables[this.id].canClick ? "#00CCCC" : "#BF8F8F" } },
            branches() { return ["43"] },

        },



    },
    infMult() {
        let ret = layers.b.dmgMult();
        ret = ret.mul(1 - Math.pow(0.99996, player.i.infTime.toNumber() ** 2));
        return ret.max(0).div(1e20);
    },
    infEff() {
        return Decimal.sub(1200, player.i.y).div(176).pow(1.2).min(10);
    },
    getEssence() {
        return player.i.points.add(1).log10().mul(player.i.power.add(1).log10()).mul(layers.i.infEff());
    },
    getPowerGain() {
        if (hasMilestone("i", 21)) return player.i.points.div(1000).pow(2).mul(layers.i.infEff());
        return new Decimal(0);
    },
    usedEssence() {
        let u = new Decimal(0);
        for (i in player.i.clickables) if (player.i.clickables[i] == 1) u = u.add(layers.i.clickables[i].cost());
        return u;
    },
    doReset(layer) {
        if (layer == "i") {
            if(hasMilestone("k", 0)){
                addPoints("j", tmp.j.resetGain);
            }
            if(hasMilestone("k", 4)){
                addPoints("k", tmp.k.resetGain);
            }
        }
    },

});


setInterval(function () {
    if (player.i && player.i.y && player.i.infDmg && layers.i) player.i.y = Decimal.sub(1024, player.i.infDmg.add(1).log2()).mul(0.001).add(player.i.y.mul(0.999)).max(0), tmp.i.bars.hp.fillStyle = layers.i.bars.hp.fillStyle(), tmp.i.bars.hp.baseStyle = layers.i.bars.hp.baseStyle(), tmp.i.bars.hp.progress = layers.i.bars.hp.progress(), constructBarStyle("i", "hp");
}, 10);
