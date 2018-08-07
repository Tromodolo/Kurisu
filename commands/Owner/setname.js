var exports = module.exports = {};

const config = require("../../bot.js").config,
	  client = require("../../bot.js").client;

exports.aliases = [

];
exports.description = "Sets name for bot.";
exports.fullDescription = "Sets name for the bot to whatever you specify.";
exports.usage = "setname Kurisu";
exports.requirements = {
	userIDs: [
		config.ownerId
	]
};

exports.function = (msg, args) => {
	if(args.length < 1){
		return "You need to specify a name";
	}
	else{
		client.editSelf({username: args.join(" ")});
		return "Name changed! :ok_hand:";
	}
};



