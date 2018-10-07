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
	let user;
    user = getUserByMessage(msg, args);

    let targetSomeone = true;
    if(!user) {
        user = msg.member;
        targetSomeone = false;
    }

    let userData = await db.ProfileData.find({ where: { userid: user.id }, raw: true });

	if(targetSomeone){
        return `${user.username} has $${userData.money}:moneybag:`;
    }
    else{
        return `You have $${userData.money}:moneybag:`;
    }
};