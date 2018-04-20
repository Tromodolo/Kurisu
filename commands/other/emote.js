var exports = module.exports = {},
	client = require("../../bot.js").client,
	color = require("../../bot.js").kurisuColour,
	XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


exports.function = async (msg, args) => {
	var emoteText = args[0];
	var emoteRegex = /:(\d.*?[0-9])>/;
	var notId = emoteText.match(emoteRegex);
	var id = notId[1];

	var nameRegex = /:(.*?):/;
	var emoteNameResult = emoteText.match(nameRegex);
	var emoteName = emoteNameResult[1];

	var animated = false;
	if(imageExists("https://cdn.discordapp.com/emojis/" + id + ".gif")){
		animated = true;
		client.createMessage(msg.channel.id, {
			"embed": {
				"color": color,
				"thumbnail": {
					"url": "https://cdn.discordapp.com/emojis/" + id + ".gif"
				},
				"fields": [
					{
						"name": "Name",
						"value": emoteName,
						"inline": true
					},
					{
						"name": "ID",
						"value": id,
						"inline": true
					},
					{
						"name": "Animated",
						"value": animated,
						"inline": true
					},
					{
						"name": "Link",
						"value": "[Here](https://cdn.discordapp.com/emojis/" + id + ".gif)",
						"inline": true
					}
				]
			}
		});
	}
	else{
		client.createMessage(msg.channel.id, {
			"embed": {
				"color": color,
				"thumbnail": {
					"url": "https://cdn.discordapp.com/emojis/" + id + ".png"
				},
				"fields": [
					{
						"name": "Name",
						"value": emoteName,
						"inline": true
					},
					{
						"name": "ID",
						"value": id,
						"inline": true
					},
					{
						"name": "Animated",
						"value": animated,
						"inline": true
					},
					{
						"name": "Link",
						"value": "[Here](https://cdn.discordapp.com/emojis/" + id + ".png)",
						"inline": true
					}
				]
			}
		});
	}
};

exports.description = "Shows info about a discord emote";
exports.fullDescription = "Shows information about a custom discord emote";
exports.usage = "<emote>";


function imageExists(image_url){

	var http = new XMLHttpRequest();

	http.open("HEAD", image_url, false);
	http.send();
	return http.status == 200;
}