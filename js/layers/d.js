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
    dgoal(x) {
        let base = new Decimal(1.1);
        let sc = new Decimal(25);
        if (hasUpgrade("c", 34) && player.sac.points.gte(3)) sc = sc.add(5);
        if (hasUpgrade("c", 53) && player.sac.points.gte(3)) sc = sc.add(5);
        if (hasMilestone("c", 17) && player.sac.points.gte(5)) sc = sc.add(5);
        let ret = Decimal.pow(base, softcap(new Decimal(player.d.challenges[x] || 0), sc, 2)).mul(500);
        if (player.sac.points.eq(0) && x == 11) ret = ret.mul(1.2);
        if (player.sac.points.eq(0) && x == 21) ret = ret.mul(2);
        return ret;
    },
    challenges: {
        11: {
            name: "Defenseless",
            challengeDescription() { return "Your DEF is 0.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.completionLimit(); },
            goal() { return layers.d.dgoal(this.id); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription() { if (player.b.points.gte(30)) return "1 domain point and +1% DEF per completion."; return "1 domain point per completion."; },
            onEnter() { doReset("c", true); }
        },
        12: {
            name: "Glass Cannon",
            challengeDescription() { return "You will have 100 HP at the start of the domain, but you can't gain more.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.completionLimit(); },
            goal() { return layers.d.dgoal(this.id); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription() { if (player.b.points.gte(30)) return "1 domain point and +1% HP gain per completion."; return "1 domain point per completion."; },
            onEnter() {
                doReset("c", true);
                player.points = new Decimal(100);
            }
        },
        21: {
            name: "Weak Attack",
            challengeDescription() { return "Your ATK " + (player.b.points.gte(13) ? "and DMG are" : "is") + " 1.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.completionLimit(); },
            goal() { return layers.d.dgoal(this.id); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription() { if (player.b.points.gte(30)) return "1 domain point and +1% ATK per completion."; return "1 domain point per completion."; },
            onEnter() {
                doReset("c", true);
            },
            unlocked() { return hasUpgrade("c", 21) || player.sac.points.gte(3); }
        },
        22: {
            name: "InstaRoot",
            challengeDescription() { return "You can only 1-attack kill enemies. Attack is square rooted.<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.completionLimit(); },
            goal() { return layers.d.dgoal(this.id); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription() { if (player.b.points.gte(30)) return "1 domain point and +1% DMG per completion."; return "1 domain point per completion."; },
            onEnter() {
                doReset("c", true);
            },
            unlocked() { return hasUpgrade("c", 34) || player.sac.points.gte(3); }
        },
        31: {
            name: "No Equipments and Scaling",
            challengeDescription() { return "Your equipments has no effect. Level scaling factor is fixed at " + (player.b.points.gte(45) ? 0.1 : player.b.points.gte(40) ? 0.05 : 0.03) + "<br>Completions: " + formatWhole(player.d.challenges[this.id]) + "/" + layers.d.completionLimit(); },
            goal() { return layers.d.dgoal(this.id); },
            goalDescription() { return "Reach Level " + formatWhole(this.goal().ceil()); },
            currencyDisplayName: "Level",
            canComplete() { return getLevel().gte(this.goal()) },
            completionLimit() { return layers.d.completionLimit(); },
            rewardDescription() { return "1 domain point per completion."; },
            onEnter() {
                doReset("c", true);
            },
            unlocked() { return player.b.points.gte(37); }
        },
    },
    completionLimit() {
        let d = 12;
        if (player.sac.points.gte(1)) d += 3;
        if (player.sac.points.gte(2)) d += 5;
        if (hasUpgrade("c", 32)) d += 10;
        if (hasUpgrade("g", 15)) d += 5;
        if (hasMilestone("i", 4)) d += 5;
        if (player.b.points.gte(31)) d += 5;
        if (getClickableState("i", 21) == 1) d += 5;
        if (hasMilestone("j", 10) && player.sac.points.gte(5)) d += 10;
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
        }
        player.d.points = new Decimal(player.d.challenges[11]).add(player.d.challenges[12]).add(player.d.challenges[21]).add(player.d.challenges[22]).add(player.d.challenges[31]);
    },
    effect() {
        let ret = Decimal.pow(1.1, player.d.points);
        return ret;
    },
    effect2() {
        let ret = player.d.points.pow(1.5).add(1);
        if (player.sac.points.gte(4)) ret = Decimal.pow(1.1, player.d.points);
        return ret;
    },
    effectDescription() { // Optional text to describe the effects
        let eff = this.effect();
        let eff2 = this.effect2();
        return "translated to a " + format(eff) + "x multiplier to Calm Point gain and " + format(eff2) + "x multiplier to Boss Damage";
    },

    doReset(layer) {
        if (layer == "i" || layer == "j" || layer == "k") {
            layerDataReset("d", ["challenges"]);
            keepAmount = 0;
            if (hasMilestone("i", 1) || player.i.points.gte(2)) keepAmount = 0.25 + 0.15 * player.i.points.cbrt().min(5).toNumber();
            player.d.challenges[11] = Math.floor(player.d.challenges[11] * keepAmount);
            player.d.challenges[12] = Math.floor(player.d.challenges[12] * keepAmount);
            player.d.challenges[21] = Math.floor(player.d.challenges[21] * keepAmount);
            player.d.challenges[22] = Math.floor(player.d.challenges[22] * keepAmount);
            player.d.challenges[31] = Math.floor(player.d.challenges[31] * keepAmount);


            updateTemp();
        }
    },
})
