const config = require("../config.json");

const google = require("googleapis").google,
	  customSearch = google.customsearch("v1"),
	  youtube = google.youtube({
	  	  version: "v3",
		  auth: config.googleApiKey
	  });


module.exports.getUserByMessage = (msg, args) => {
	let user;
	
	if(args.length == 0){
		user = msg.member;
		return user;
	}

	let mentionRegex = /(<@!?[0-9]*>)(?:\s?\w*)*/gi;

	let mentionCheck = mentionRegex.exec(args.join(" "));

	if(mentionCheck){
		user = msg.mentions[0];

		//Workaround to get member object instead of just user
		user = msg.channel.guild.members.find(x => x.id == user.id);
	}
	else if(!user){
		let guild = msg.channel.guild;
		user = guild.members.find(x => x.id == args[0]);

		if(!user){
			user = guild.members.find(x => x.username.toLowerCase() == args[0]);
			if(!user){
				user = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[0];
					}
					else{
						return false;
					}
				});
				if(!user){
					user = guild.members.find(x => x.username.toLowerCase().includes(args[0]));
					if(!user){
						user = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[0]);
							}
							else{
								return false;
							}
						});
						if(!user){
							return null;
						}
					}
				}
			}
		}
	}
	return user;
}

module.exports.getHighestRole = (guild, member) => {
	let highestRole = null;

    member.roles.forEach(roleId => {
        let role = guild.roles.get(roleId);

        if(!highestRole) highestRole = role;
        else if(role.position > highestRole.position) highestRole = role;
	});
	
	return highestRole;
}

module.exports.getLoveUsers = (msg, args) => {
	let users = { first: null, second: null };
	
	if(args.length == 0){
		return users;
	}

	let firstuser = msg.mentions[0];
	if(firstuser) users.first = msg.channel.guild.members.find(x => x.id == firstuser.id);

	let seconduser = msg.mentions[1];
	if(seconduser) users.second = msg.channel.guild.members.find(x => x.id == seconduser.id);

	let guild = msg.channel.guild;

	if(!users.first){
		users.first = guild.members.find(x => x.id == args[0]);

		if(!users.first){
			users.first = guild.members.find(x => x.username.toLowerCase() == args[0]);

			if(!users.first){
				users.first = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[0];
					}
					else{
						return false;
					}
				});
				if(!users.first){
					users.first = guild.members.find(x => x.username.toLowerCase().includes(args[0]));
					if(!users.first){
						users.first = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[0]);
							}
							else{
								return false;
							}
						});
						if(!users.first){
							users.first = null;
						}
					}
				}
			}
		}
	}

	if(!users.second){
		users.second = guild.members.find(x => x.id == args[1]);

		if(!users.second){
			users.second = guild.members.find(x => x.username.toLowerCase() == args[1]);

			if(!users.second){
				users.second = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[1];
					}
					else{
						return false;
					}
				});
				if(!users.second){
					users.second = guild.members.find(x => x.username.toLowerCase().includes(args[1]));
					if(!users.second){
						users.second = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[1]);
							}
							else{
								return false;
							}
						});
						if(!users.second){
							users.second = null;
						}
					}
				}
			}
		}
	}
	return users;
}

module.exports.googleLookup = async (bot, message, query, inMessage) =>{
	//Doing this to get an index between 0 and 5 for the reactions
	let search = Math.floor(Math.random() * (searchReactions.length - 1));

	//Found and Not Found do the same thing here, only with other indexes
	let notFound = Math.floor(Math.random() * (notFoundReactions.length - 1));
	let found = Math.floor(Math.random() * (foundReactions.length - 1));

	bot.createMessage(message.channel.id, searchReactions[search]);

	const res = await customSearch.cse.list({
		cx: config.googleCustomSearchId,
		q: query,
		auth: config.googleApiKey
	});

	data = res.data;

	if(data.searchInformation.totalResults == 0){
		if(inMessage) bot.createMessage(message.channel.id, notFoundReactions[notFound]);
		else bot.createMessage(message.channel.id, "No results found");
	}
	else{
		if(inMessage) bot.createMessage(message.channel.id, foundReactions[found]);

		let embed = new DiscordEmbed();

		embed.setColor(color);
		embed.setTitle(data.items[0].title);
		embed.setUrl(data.items[0].formattedUrl);
		embed.setDescription(`${data.items[0].snippet.replace("\n", " ")}`);
		embed.setAuthor(`Google Search for '${query}'`);

        bot.createMessage(message.channel.id, embed.getEmbed())
	}
}

module.exports.youtubeLookup = async (bot, message, query, inMessage) =>{
	//Doing this to get an index between 0 and 5 for the reactions
	let search = Math.floor(Math.random() * (searchReactions.length - 1));

	//Found and Not Found do the same thing here, only with other indexes
	let notFound = Math.floor(Math.random() * (notFoundReactions.length - 1));
	let found = Math.floor(Math.random() * (foundReactions.length - 1));

	if(inMessage) bot.createMessage(message.channel.id, searchReactions[search]);

	const res = await youtube.search.list({
		part: "id,snippet",
		q: query,
	});
	
	let data = res.data;

	if(data.pageInfo.totalResults == 0){
		if(inMessage) bot.createMessage(message.channel.id, notFoundReactions[notFound]);
		else bot.createMessage(message.channel.id, "No results found");
	}
	else{
		if(inMessage) bot.createMessage(message.channel.id, foundReactions[found]);

		let embed = new DiscordEmbed();

		embed.setColor(color);
		embed.setTitle(data.items[0].snippet.title);
		embed.setUrl("https://www.youtube.com/watch?v=" + data.items[0].id.videoId);
		embed.setDescription(`${data.items[0].snippet.description}`);
		embed.setThumbnail(data.items[0].snippet.thumbnails.high.url);
		embed.setAuthor(`Youtube search for '${query}'`);
		
		bot.createMessage(message.channel.id, embed.getEmbed());
	}
}

let searchReactions = 
[
	"Sure, give me a second.",
	"I'll see what I can do.",
	"This better not be something perverted.",
	"Why do I always have to do stuff for you, ugh. Just wait, I'll look.",
	"I'm not doing this for you, I'm just bored okay.",
	"Fine, but you owe me a drink.",
	"I'm not doing this cause I like you okay, you owe me."
]

let foundReactions = 
[
	"Hey something came up, is this it?",
	"Here you go, have fun.",
	"Found it, look here"
]

let notFoundReactions = 
[
	"Look, I tried the best I could, but nothing came up.",
	"What was it about, cause nothing came up when I searched for it.",
	"Nullpo, couldn't find it.",
	"It came up with nothing, don't tell me this is one of your delusions again."
]