var exports = module.exports = {};

const client = require("../../bot.js").client,
      db = require("../../db");
      
const { codes } = require("iso-country-codes");

exports.aliases = [

];
exports.description = "Edits your profile country";
exports.fullDescription = "Sets your profile country, or write 'none' to have unspecified";
exports.usage = "setcountrycode SE";
exports.requirements = {

};

exports.function = async (msg, args) => {
    if(args[0] == "none"){
        db.ProfileData.update({
            countrycode: null
        }, {
            where: { userid: msg.author.id }
        });
        return "Country has been updated";
    }

    if(args[0].length > 2) return "Country code can't be longer than 2 characters";

    let country = codes.find(x => x.alpha2 == args[0]);

    if(!country) return `${args[0]} is not a valid country code`

    db.ProfileData.update({
        countrycode: args[0]
    }, {
        where: { userid: msg.author.id }
    });
    return "Your country has been updated"

};

