/**
 * Util.ts
 *
 * Class full of utility/helper functions
 *
 * Last Edit - Oct 12, 2018 by Elias
 */

import { Client, Guild, Member, Message, Role } from "eris";
import { google } from "googleapis";
import * as config from "../config.json";
import { DiscordEmbed } from "./DiscordEmbed";

const customSearch = google.customsearch("v1");
const youtube = google.youtube({
	  version: "v3",
	auth: config.googleApiKey,
});

/**
 * Grabs the user that sent a message if args == 1. Grabs first mentioned user if args > 1
 *
 * @param msg a message object sent by a user
 * @param args args in the message sent by the user
 * @returns returns the user that sent the message, or the first person mentioned in the message
 */
function getUserByMessage(msg: Message, args: string[]): Member | undefined {
	let user: Member | undefined;

	// if no args were passed with command
	if (args.length === 0) {
		user = msg.member;
		return user;
	}
	// if args are passed with command
	if (msg.mentions.length > 0) {
		const channel: any = msg.channel;
		user = channel.guild.members.find((x: Member) => x.id === msg.mentions[0].id);
		return user;
	}
	if (args.length === 1) {
		const guild: Guild | undefined = msg.member ? msg.member.guild : undefined;

		if (!guild){
			user = undefined;
			return user;
		}
		else {
			user = guild.members.find((x: Member) => x.id === args[0]) ||
				   guild.members.find((x: Member) => x.username.toLowerCase().includes(args[0])) ||
				   guild.members.find((x: Member) => x.nick ? x.nick.toLowerCase().includes(args[0]) : false);
			return user;
		}
	}

	return undefined;
}

/**
 * Grabs two users that are mentioned or specified in the message
 *
 * @param msg a message object sent by a user
 * @param args args in the message sent by the user
 * @returns returns two members that are mentioned or specified in args
 */
function getLoveUsers(msg: Message, args: string[]): { first?: Member, second?: Member }{
	const users: { first?: Member, second?: Member } = {};
	const guild: Guild | undefined = msg.member ? msg.member.guild : undefined;
	const mentionCheck: RegExp = /<@!?[0-9]*>/g;

	if (!guild){
		return users;
	}

	if (args[0]){
		if (args[0].match(mentionCheck)){
			users.first = guild.members.find((x: Member) => x.id === msg.mentions[0].id);
		}
		else {
			users.first = guild.members.find((x: Member) => x.id === args[0]) ||
						  guild.members.find((x: Member) => x.username.toLowerCase().includes(args[0])) ||
						  guild.members.find((x: Member) => x.nick ? x.nick.toLowerCase().includes(args[0]) : false);
		}
	}

	if (args[1]){
		if (args[1].match(mentionCheck)){
			users.second = guild.members.find((x: Member) => x.id === msg.mentions[1].id);
		}
		else {
			users.second = guild.members.find((x: Member) => x.id === args[1]) ||
						   guild.members.find((x: Member) => x.username.toLowerCase().includes(args[1])) ||
						   guild.members.find((x: Member) => x.nick ? x.nick.toLowerCase().includes(args[1]) : false);
		}
	}

	return users;
}

/**
 * Gets the highest role that is assigned to a user
 *
 * @param guild the guild that the user is in
 * @param member the user whos roles are going to be checked
 * @returns returns a the highest Role of the specified member
 */
function getHighestRole(guild: Guild, member: Member) {
	let highestRole: Role | undefined;

	member.roles.forEach((roleId) => {
		const role: Role | undefined = guild.roles.get(roleId);

		if (role){
			if (!highestRole) {
				highestRole = role;
			}
			else if (role.position > highestRole.position) {
				highestRole = role;
			}
		}

	});

	return highestRole;
}

/**
 * Looks up a google query and sends out messages with the result
 * @param bot eris.js Client object to handle the messages
 * @param message Message object of the chat message that created the query
 * @param query Query string to pass to api
 * @param inMessage Whether or not the query was in-line of a message or through a command
 */
function googleLookup(bot: Client, message: Message, query: string, inMessage: boolean): Promise<{}>{
	return new Promise(async (resolve) => {
		// Doing this to get an index between 0 and 5 for the reactions
		const search = Math.floor(Math.random() * (searchReactions.length - 1));

		// Found and Not Found do the same thing here, only with other indexes
		const notFound = Math.floor(Math.random() * (notFoundReactions.length - 1));
		const found = Math.floor(Math.random() * (foundReactions.length - 1));

		if (inMessage){
			message.channel.createMessage(searchReactions[search]);
		}

		const res = await customSearch.cse.list({
			cx: config.googleCustomSearchId,
			q: query,
			auth: config.googleApiKey,
		});

		const data = res.data;

		if (data.searchInformation === 0){
			if (inMessage){
				message.channel.createMessage(notFoundReactions[notFound]);
			}
			else{
				message.channel.createMessage("No results found");
			}
		}
		else{
			if (inMessage){
				message.channel.createMessage(foundReactions[found]);
			}
			const embed = new DiscordEmbed();

			if (data.items){

				embed.setColor(parseInt(config.color));
				embed.setTitle(data.items[0].title || "Unavailable");
				embed.setUrl(data.items[0].formattedUrl || "https://google.com/");
				embed.setDescription(`${data.items[0].snippet ? data.items[0].snippet.replace("\n", " ") : "Description unavailable"}`);
				embed.setAuthor(`Google Search for '${query}'`, data.items[0].formattedUrl || "https://google.com/", bot.user.avatarURL);
			}

			await message.channel.createMessage(embed.getEmbed());
		}
		return resolve();
	});
}

/**
 * Looks up a youtube query and sends out messages with the result
 * @param bot eris.js Client object to handle the messages
 * @param message Message object of the chat message that created the query
 * @param query Query string to pass to api
 * @param inMessage Whether or not the query was in-line of a message or through a command
 */
function youtubeLookup(bot: Client, message: Message, query: string, inMessage: boolean): Promise<{}>{
	return new Promise(async (resolve) => {
		// Doing this to get an index between 0 and 5 for the reactions
		const search = Math.floor(Math.random() * (searchReactions.length - 1));

		// Found and Not Found do the same thing here, only with other indexes
		const notFound = Math.floor(Math.random() * (notFoundReactions.length - 1));
		const found = Math.floor(Math.random() * (foundReactions.length - 1));

		if (inMessage){
			message.channel.createMessage(searchReactions[search]);
		}
		const res = await youtube.search.list({
			part: "id,snippet",
			q: query,
		});

		const data = res.data;

		if (data.pageInfo){
			if (data.pageInfo.totalResults === 0){
				if (inMessage){
					message.channel.createMessage(notFoundReactions[notFound]);
				}
				else{
					message.channel.createMessage("No results found");
				}
			}
			else{
				if (inMessage){
					message.channel.createMessage(foundReactions[found]);
				}
				if (data.items){
					message.channel.createMessage(`https://www.youtube.com/watch?v=${data.items[0].id ? data.items[0].id.videoId : "6n3pFFPSlW4"}`);
				}
			}
		}

		return resolve();
	});
}

const searchReactions: string[] =
[
	"Sure, give me a second.",
	"I'll see what I can do.",
	"This better not be something perverted.",
	"Why do I always have to do stuff for you, ugh. Just wait, I'll look.",
	"I'm not doing this for you, I'm just bored okay.",
	"Fine, but you owe me a drink.",
	"I'm not doing this cause I like you okay, you owe me.",
];

const foundReactions: string[] =
[
	"Hey something came up, is this it?",
	"Here you go, have fun.",
	"Found it, look here",
];

const notFoundReactions: string[] =
[
	"Look, I tried the best I could, but nothing came up.",
	"What was it about, cause nothing came up when I searched for it.",
	"Nullpo, couldn't find it.",
	"It came up with nothing, don't tell me this is one of your delusions again.",
];

export {
	googleLookup,
	getUserByMessage,
	getLoveUsers,
	getHighestRole,
	youtubeLookup,
};