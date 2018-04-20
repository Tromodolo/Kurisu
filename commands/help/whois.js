var exports = module.exports = {},
	client = require("../../bot.js").client;

exports.function = async (msg, args) => {
	if(msg.mentions.length > 0){
		var member = msg.channel.guild.members.find(x => x.id === msg.mentions[0].id);
		sendInfo(member, client, msg.channel);
	}
	else{
		return "Please mention a user";
	}
};

exports.description = "Shows information about a user";
exports.fullDescription = "Shows information about a user";
exports.usage = "<user>";

function sendInfo(member, client, channel){
	client.createMessage(channel.id, {
		"embed": {
			"color": 16728385,
			"thumbnail": {
				"url": member.avatarURL
			},
			"author": {
				"name": member.username,
				"icon_url": member.avatarURL
			},
			"fields": [
				{
					"name": "ID",
					"value": member.id,
					"inline": true
				},
				{
					"name": "Playing",
					"value": member.game === null ? "(None)" : member.game.name,
					"inline": true
				},
				{
					"name": "Status",
					"value": member.status,
					"inline": true
				},
				{
					"name": "Nickname",
					"value": member.nick === null ? "(None)" : member.nick,
					"inline": true
				},
				{
					"name": "Account Created",
					"value": new Date(member.user.createdAt).toLocaleDateString("en-US", {  
						weekday: "long", year: "numeric", month: "short",  
						day: "numeric", hour: "2-digit", minute: "2-digit"  
					}),
					"inline": false
				},
				{
					"name": "Join Date",
					"value": new Date(member.joinedAt).toLocaleDateString("en-US", {  
						weekday: "long", year: "numeric", month: "short",  
						day: "numeric", hour: "2-digit", minute: "2-digit"  
					}),
					"inline": false
				}
			]
		}
	});
}