var exports = module.exports = {};

const client = require("../../bot.js").client,
      addBlackjack = require("../../bot").addBlackjack,
      color = require("../../bot.js").kurisuColour,
      db = require("../../db"),
      Blackjack = require("../../utility/Blackjack");

exports.aliases = [
	"cf",
	"coin"
]
exports.description = "Bets money on a blackjack session";
exports.fullDescription = "Bets money on a blackjack session";
exports.usage = "blackjack 10";
exports.requirements = {
	
}

exports.function = async (msg, args) => {
    let userData = await db.ProfileData.find({ where: { userid: msg.member.id }, raw: true });
    if(args[0]){
        moneyBet = parseInt(args[0]);

        if(userData.money < moneyBet) return "You can't afford that bet";
        if(moneyBet < 0) return "You can't bet a negative amount";

        let blackjack = new Blackjack(msg.member, moneyBet, msg.channel.id, client);
        blackjack.registerEvent();
        addBlackjack(blackjack);
    }
    else{
        let blackjack = new Blackjack(msg.member, 0, msg.channel.id, client);
        blackjack.registerEvent();
        addBlackjack(blackjack);
    }
};

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}