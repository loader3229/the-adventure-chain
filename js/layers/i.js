addLayer("i", {
    name: "imaginary",
    symbol: "I",
    position: 0,
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
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
        if(player.b.points.gte(27))ret = ret.mul(player.b.points.sub(26).pow(0.6).add(1));
        return ret;
    },
    getResetGain() {
        if(getLevel().lt(1e5))return new Decimal(0);
        let ret=getLevel().sub(1e5).div(1e3).root(3).add(1).mul(layers.i.gainMult()).floor();
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
        let ret = Decimal.pow(10, player.i.points.add(1).log10().sqrt());
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
            effectDescription: "1.25x imaginary points gain.",
        },
    ],

});
