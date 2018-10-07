var exports = module.exports = {};

const client = require("../../bot.js").client;

exports.aliases = [

];
exports.description = "Looks up a term on youtube";
exports.fullDescription = "Looks up a term on youtube";
exports.usage = "youtube search term";
exports.requirements = {

};

exports.function = async (msg, args) => {
    if(args.length > 0){
        let query = args.join(" ");
		util.youtubeLookup(client, msg, query, false);
		return;
    }
    else{
        return "You need to specify a search term"
    }

};

