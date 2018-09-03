var exports = module.exports = {};

const client = require("../../bot.js").client,
	  db = require("../../db");

exports.aliases = [
    "setdescription",
    "setdesc",
    "description"
];
exports.description = "Sets your profile description";
exports.fullDescription = "Sets your profile description to a specified text";
exports.usage = "setdescription hello im a person";
exports.requirements = {

};

exports.function = async (msg, args) => {
    if(args.length < 1) return "You need to specify a a description";

    db.ProfileData.update({
        profiledescription: args.join(" ")
    }, {
        where: { userid: msg.author.id }
    });
    return "Your description has been updated";
};