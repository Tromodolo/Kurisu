var exports = module.exports = {};

const client = require("../../bot.js").client,
	  db = require("../../db");

exports.aliases = [
    "setprimarycolor",
    "setprimary"
];
exports.description = "Edits your primary profile colour";
exports.fullDescription = "Sets your primary profile colour to a specified hexcode";
exports.usage = "setprimarycolour #aaaaaa";
exports.requirements = {

};

exports.function = async (msg, args) => {
    let hexCheck  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

    if(args.length < 1) return "You need to specify a colour in hexcode";

    let result = hexCheck.exec(args[0]);

    if(result){
        let colour = result[0];

        db.ProfileData.update({
            primarycolour: colour
        }, {
            where: { userid: msg.author.id }
        });
        return "Your primary profile colour has been updated"
    }
    else return "The colour needs to be in hexcode. If you don't know what that is, you can pick a colour from here: **https://htmlcolorcodes.com/**"
};

