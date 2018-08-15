var exports = module.exports = {};

const client = require("../../bot.js").client,
      color = require("../../bot.js").kurisuColour,
      db = require("../../db"),
	  getUserByMessage = require("../../utility/Utility").getUserByMessage;

exports.aliases = [
	"cash",
	"dollars",
	"bucks"
]
exports.description = "Gets your or another person's money balance";
exports.fullDescription = "Gets your or another person's money balance";
exports.usage = "money (tromo)";
exports.requirements = {
	
}

exports.function = async (msg, args) => {
    let userData = await db.ProfileData.find({ where: { userid: msg.member.id }, raw: true });

    let sideChoice;
    if(!args[0]) return "You need to choose heads or tails."

    switch(args[0]){
        case "h":
        case "heads":
            sideChoice = 0;
            break;
        case "t":
        case "tails":
            sideChoice = 1;
            break;
    }

    let moneyBet;
    if(args[1]){
        moneyBet = parseInt(args[1]);
        
        if(userData.money < moneyBet) return "You can't afford that bet";

        await db.ProfileData.update(
        {
            money: db.sequelize.literal(`money - ${moneyBet}`)
        }, 
        {
            where: {
                userid: message.author.id
            }
        });
    }

    let coinFlip = Math.round(Math.random());
    if(coinFlip == sideChoice){
        if(moneyBet){
            let winRng = randomIntFromInterval(40, 60);
            let winnings = Math.round(moneyBet * (1 + (winRng / 100)));
            
            await db.ProfileData.update(
            {
                money: db.sequelize.literal(`money + ${winnings}`)
            }, 
            {
                where: {
                    userid: message.author.id
                }
            });
            return `You got it right. You won 1.${winRng}x your bet, ${winnings}`;
        }
        else{
            return "You won, but you didn't bet anything, which means no winnings";
        }
    }
    else{
        if(moneyBet){
            return "You lost the bet, and your winnings";
        }
        else{
            return "You lost, but since you didn't bet, you lost no money";
        }
    }
};

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}