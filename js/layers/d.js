addLayer("d", {
    name: "domain", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#999999",
    resource: "Domain Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires: new Decimal(100),
    row: 3, // Row the layer is in on the tree (0 is the first row)
    branches: ['c'],
    layerShown() { return player.b.points.gte(6) || player.d.unlocked },
    tabFormat: {
        "Main Tab": {
            "content": [
                "main-display",
                ["display-text", "Entering a domain will force a calm reset. EXP passive gain is reduced in domains."],
                "challenges"
            ]
        }
    },
    challenges: {
        11: {
            name: "Defenseless",
            challengeDescription() { return "Your DEF is 0.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.challenges[this.id].completionLimit(); },
            goal() { return Decimal.pow(1.1, softcap(new Decimal(player.d.challenges[11]), new Decimal((hasUpgrade("c",34)&&player.sac.points.gte(3))?30:25), 2)).mul(player.sac.points.gte(1) ? 500 : 600); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            onEnter() { doReset("c", true); },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription: "1 domain point per completion."
        },
        12: {
            name: "Glass Cannon",
            challengeDescription() { return "You will have 100 HP at the start of the domain, but you can't gain more.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.challenges[this.id].completionLimit(); },
            goal() { return Decimal.pow(1.1, softcap(new Decimal(player.d.challenges[12]), new Decimal((hasUpgrade("c",34)&&player.sac.points.gte(3))?30:25), 2)).mul(500); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription: "1 domain point per completion.",
            onEnter() {
                doReset("c", true);
                player.points = new Decimal(100);
            }
        },
        21: {
            name: "Weak Attack",
            challengeDescription() { return "Your ATK " + (player.b.points.gte(13) ? "and DMG are" : "is") + " 1.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.challenges[this.id].completionLimit(); },
            goal() { return Decimal.pow(1.1, softcap(new Decimal(player.d.challenges[21]), new Decimal((hasUpgrade("c",34)&&player.sac.points.gte(3))?30:25), 2)).mul(player.sac.points.gte(1) ? 500 : 1000); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription: "1 domain point per completion.",
            onEnter() {
                doReset("c", true);
            },
            unlocked() { return hasUpgrade("c", 21) || player.sac.points.gte(3); }
        },
        22: {
            name: "InstaRoot",
            challengeDescription() { return "You can only 1-attack kill enemies. Attack is square rooted.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.challenges[this.id].completionLimit(); },
            goal() { return Decimal.pow(1.1, softcap(new Decimal(player.d.challenges[22]), new Decimal((hasUpgrade("c",34)&&player.sac.points.gte(3))?30:25), 2)).mul(500); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription: "1 domain point per completion.",
            onEnter() {
                doReset("c", true);
            },
            unlocked() { return hasUpgrade("c", 34) || player.sac.points.gte(3); }
        },
    },
    completionLimit() {
        let d = 12;
        if (player.sac.points.gte(1)) d += 3;
        if (player.sac.points.gte(2)) d += 5;
        if (hasUpgrade("c", 32)) d += 10;
        if (hasUpgrade("g", 15)) d += 5;
        return d;
    },
    update(diff) {
        if (player.b.points.gte(6)) player.d.unlocked = true;
        if (player.sac.points.gte(1)) {
            if (player.d.activeChallenge) {
                if (getLevel().gte(layers.d.challenges[player.d.activeChallenge].goal())) {
                    player.d.challenges[player.d.activeChallenge] = Math.min(layers.d.completionLimit(), player.d.challenges[player.d.activeChallenge] + 1);
                }
            }
            player.d.points = new Decimal(player.d.challenges[11]).add(player.d.challenges[12]).add(player.d.challenges[21]).add(player.d.challenges[22]);

        }
    },
    effect() {
        let ret = Decimal.pow(1.1, player.d.points);
        return ret;
    },
    effect2() {
        let ret = player.d.points.pow(1.5).add(1);
        return ret;
    },
    effectDescription() { // Optional text to describe the effects
        let eff = this.effect();
        let eff2 = this.effect2();
        return "translated to a " + format(eff) + "x multiplier to Calm Point gain and " + format(eff2) + "x multiplier to Boss Damage";
    },

    doReset(layer) { 
        if (layer == "i") {
            layerDataReset("d",["challenges"]);
            keepAmount = 0;
            if(hasMilestone("i",1) || player.i.points.gte(2))keepAmount = 0.25 + 0.15 * player.i.points.cbrt().min(5).toNumber();
         player.d.challenges[11] = Math.floor(player.d.challenges[11]*keepAmount);
         player.d.challenges[12] = Math.floor(player.d.challenges[12]*keepAmount);
         player.d.challenges[21] = Math.floor(player.d.challenges[21]*keepAmount);
         player.d.challenges[22] = Math.floor(player.d.challenges[22]*keepAmount);

            updateTemp();
        }
    },
})
