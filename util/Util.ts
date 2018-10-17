/**
 * Util.ts
 *
 * Class full of utility/helper functions
 *
 * Last Edit - Oct 12, 2018 by Elias
 */

import { Guild, Member, Message, Role } from "eris";

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
	if (args.length === 1) {
		user = msg.member;
		return user;
	}
	// if args are passed with command
	if (msg.mentions.length > 0) {
		const channel: any = msg.channel;
		user = channel.guild.members.find((x: Member) => x.id === msg.mentions[0].id);
		return user;
	}
	if (args.length === 2) {
		const guild: Guild | undefined = msg.member ? msg.member.guild : undefined;

		if (!guild){
			user = undefined;
			return user;
		}
		else {
			user = guild.members.find((x: Member) => x.id === args[1]) ||
				   guild.members.find((x: Member) => x.username.toLowerCase().includes(args[1])) ||
				   guild.members.find((x: Member) => x.nick ? x.nick.toLowerCase().includes(args[1]) : false);
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
	const mentionCheck: RegExp = /<!?@[0-9]*>/g;

	if (!guild){
		return users;
	}

	if (args[1]){
		if (args[1].match(mentionCheck)){
			users.first = guild.members.find((x: Member) => x.id === msg.mentions[0].id);
		}
		else {
			users.first = guild.members.find((x: Member) => x.id === args[1]) ||
						  guild.members.find((x: Member) => x.username.toLowerCase().includes(args[1])) ||
						  guild.members.find((x: Member) => x.nick ? x.nick.toLowerCase().includes(args[1]) : false);
		}
	}

	if (args[2]){
		if (args[2].match(mentionCheck)){
			users.second = guild.members.find((x: Member) => x.id === msg.mentions[1].id);
		}
		else {
			users.second = guild.members.find((x: Member) => x.id === args[2]) ||
						   guild.members.find((x: Member) => x.username.toLowerCase().includes(args[2])) ||
						   guild.members.find((x: Member) => x.nick ? x.nick.toLowerCase().includes(args[2]) : false);
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
	let role: Role;

	member.roles.forEach((roleId) => {
		role = guild.roles.get(roleId)!;

		if (!highestRole) {
			highestRole = role;
		}
		else if (!role.position) {
			highestRole = role;
		}
	});

	return highestRole;
}

export {
	getUserByMessage,
	getLoveUsers,
	getHighestRole,
};