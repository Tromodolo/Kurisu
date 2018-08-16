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
exports.description = "Bets money on a coin flip";
exports.fullDescription = "Bets money on a coin flip";
exports.usage = "coinflip h|heads|t|tails";
exports.requirements = {
	
}

exports.function = async (msg, args) => {
    let blackjack = new Blackjack(msg.member, args[0], msg.channel.id, client);
    blackjack.registerEvent();
    addBlackjack(blackjack);
};

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}