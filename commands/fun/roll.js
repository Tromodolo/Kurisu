var exports = module.exports = {};

const client = require("../../bot.js").client;

exports.function = async (msg, args) => {
	if(args.length > 0){
		let maxNum = parseInt(args[0]);
		if(isNaN(maxNum)){
			let randomNum = Math.ceil(Math.random() * 100);
			return `:game_die:${randomNum}`;
		}
		else{
			let randomNum = Math.ceil(Math.random() * maxNum);
			return `:game_die:${randomNum}`;
		}
	}
	else{
		let randomNum = Math.ceil(Math.random() * 100);
		return `:game_die:${randomNum}`;
	}
};

exports.description = "Rolls a number from 0 to 100 or a custom max if you specify";
exports.fullDescription = "Rolls a number from 0 to 100 or a custom max if you specify";
exports.usage = "<max>";