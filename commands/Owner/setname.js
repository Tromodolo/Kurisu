var exports = module.exports = {},
	config = require("../../bot.js").config,
	client = require("../../bot.js").client;

exports.function = (msg, args) => {
	if(msg.member.id === config.ownerId){
		if(args.length < 1){
			return "You need to specify a name";
		}
		else{
			client.editSelf({username: args.join(" ")});
			return "Name changed! :ok_hand:";
		}
	}
	else{
		return "You don't have permission to use this command.";
	}
};

exports.description = "Sets name for bot.";
exports.fullDescription = "Sets name for the bot to whatever you specify.";
exports.usage = "[name]";

