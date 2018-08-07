var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  DiscordEmbed = require("../../utility/DiscordEmbed"),
	  getUserByMessage = require("../../utility/Utility").getUserByMessage,
      moment = require("moment"),
      fs = require("fs");

exports.aliases = [
	"userinfo",
	"whois",
	"info"
]
exports.description = "Gets your or another person's information";
exports.fullDescription = "Gets your or another person's information";
exports.usage = "user tromo";
exports.requirements = {
	
}

exports.function = async (msg, args) => {
	let embed = new DiscordEmbed();
	embed.setColor(color);

	let user;

	user = getUserByMessage(msg, args);

    let embedMessage = ""

	if(!user || user.id == msg.member.id) embedMessage = `*Hugs* ${msg.member.mention}`;
    else embedMessage = `${msg.member.mention} *hugs* ${user.mention}`;
    
    let fileNum = 1;
    fs.readdir("./data/hug", (err, files) => {
        fileNum = files.length;

        let randomFile = Math.floor(Math.random() * fileNum);

        fs.readFile(`./data/hug/${randomFile}.gif`, function (err, data ) {
            embed.setDescription(embedMessage);
            embed.setImage("attachment://hug.gif")
            client.createMessage(msg.channel.id, embed.getEmbed(), { file: data, name: "hug.gif" });
        });
    });
	return;
};