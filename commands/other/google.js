var exports = module.exports = {};

const client = require("../../bot.js").client,
	  util = require("../../utility/Utility");

exports.function = async (msg, args) => {
    if(args.length > 0){
		let query = args.join(" ");
		util.googleLookup(client, msg, query, false);
		return;
    }
    else{
        return "You need to specify a search term"
    }

};

exports.description = "Googles a specified term";
exports.fullDescription = "Googles a specified term";
exports.usage = "<search term>";