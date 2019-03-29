var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
	  DiscordEmbed = require("../../utility/DiscordEmbed");

exports.aliases = [
	"e"
];
exports.description = "Shows info about a discord emote";
exports.fullDescription = "Shows information about a custom discord emote";
exports.usage = "emote :SataniaGun:";
exports.requirements = {

};

exports.function = async (msg, args) => {
	let emoteText = args[0];
	let emoteRegex = /:(\d.*?[0-9])>/;
	let notId = emoteText.match(emoteRegex);
	let id = notId[1];

	let nameRegex = /:(.*?):/;
	let emoteNameResult = emoteText.match(nameRegex);
	let emoteName = emoteNameResult[1];


	let embed = new DiscordEmbed();

	embed.setColor(color);
	embed.addField("Name", emoteName, true);
	embed.addField("ID", id, true);
	
	if(imageExists("https://cdn.discordapp.com/emojis/" + id + ".gif")){
		embed.setThumbnail("https://cdn.discordapp.com/emojis/" + id + ".gif");
		embed.addField("Animated", "True", true);
		embed.addField("Link", "[Here](https://cdn.discordapp.com/emojis/" + id + ".gif)", true);
	}
	else{
		embed.setThumbnail("https://cdn.discordapp.com/emojis/" + id + ".png");
		embed.addField("Animated", "False", true);
		embed.addField("Link", "[Here](https://cdn.discordapp.com/emojis/" + id + ".png)", true);
	}

	client.createMessage(msg.channel.id, embed.getEmbed());
};

function imageExists(image_url){
	let http = new XMLHttpRequest();

	http.open("HEAD", image_url, false);
	http.send();
	return http.status == 200;
}