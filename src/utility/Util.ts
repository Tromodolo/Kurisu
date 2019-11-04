/**
 * Util.ts
 *
 * Class full of utility/helper functions
 *
 * Last Edit - March 29, 2019 by Tromo
 */

import { Client, Guild, Member, Message, Role, TextChannel } from "eris";
import Fuse from "fuse.js";
import { google } from "googleapis";
import config from "../config";
import { DiscordEmbed } from "./DiscordEmbed";

import image2base64 from "image-to-base64";
import * as ColorThief from "colorthief";

const youtube = google.youtube({
	version: "v3",
	auth: config.bot.googleApiKey,
});
const customSearch = google.customsearch("v1");

const userSearchOpts = {
	shouldSort: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: [
		"username",
		"nick",
		"id",
	],
};

/**
 * Grabs the user that sent a message if args == 1. Grabs first mentioned user if args > 1
 *
 * @param msg a message object sent by a user
 * @param args args in the message sent by the user
 * @returns returns the user that sent the message, or the first person mentioned in the message
 */
export function getUserByMessage(msg: Message, args: string[]): Member | undefined {
	const mentionRegex = /<@!?[0-9]*>/;

	// if no args were passed with command
	if (args.length === 0) {
		return msg.member;
	}

	if (args[0].match(mentionRegex)){
		const channel = msg.channel;
		return (channel as TextChannel).guild.members.find((x: Member) => x.id === msg.mentions[0].id);
	}
	else{
		const guild: Guild | undefined = msg.member ? msg.member.guild : undefined;
		if (!guild){
			return undefined;
		}
		else{
			const guildMembs = new Fuse(guild.members.map((x) => x), userSearchOpts);
			const found = guildMembs.search(args.join(" "));
			return found[0];
		}
	}
}

/**
 * Grabs two users that are mentioned or specified in the message
 *
 * @param msg a message object sent by a user
 * @param args args in the message sent by the user
 * @returns returns two members that are mentioned or specified in args
 */
export function getLoveUsers(msg: Message, args: string[]): { first?: Member, second?: Member }{
	const users: { first?: Member, second?: Member } = {};
	const guild: Guild = msg.member!.guild;
	const mentionCheck: RegExp = /<@!?[0-9]*>/g;

	if (!guild){
		return users;
	}

	if (args[0]){
		if (args[0].match(mentionCheck)){
			users.first = guild.members.find((x: Member) => x.id === msg.mentions[0].id);
		}
		else {
			const guildMembs = new Fuse(guild.members.map((x) => x), userSearchOpts);
			const found = guildMembs.search(args[0]);
			users.first = found[0];
		}
	}
	if (args[1]){
		if (args[1].match(mentionCheck)){
			// A bit tricky here because the second user could be the first mention
			users.second =
				args[0].match(mentionCheck) ?
					guild.members.find((x: Member) => x.id === msg.mentions[1].id)
					: guild.members.find((x: Member) => x.id === msg.mentions[0].id);
		}
		else {
			const guildMembs = new Fuse(guild.members.map((x) => x), userSearchOpts);
			const found = guildMembs.search(args[1]);
			users.second = found[0];
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
export function getHighestRole(guild: Guild, member: Member) {
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

export function getChannelByName(channels: TextChannel[], searchWord: string){
	const guildChannels = new Fuse(channels, {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
			"id",
			"name",
		],
	});
	const found = guildChannels.search(searchWord);
	return found[0];
}

export async  function getPrimaryColorFromImageUrl(url: string): Promise<number> {
	const base64 = "data:image/png;base64," + await image2base64(url);
	const mainColour = await ColorThief.getColor(base64);
	let hexColor = "";
	if (mainColour){
		hexColor = `0x${mainColour[0].toString(16)}${mainColour[1].toString(16)}${mainColour[2].toString(16)}`;
	}
	else{
		hexColor = config.bot.color;
	}
	return parseInt(hexColor);
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
