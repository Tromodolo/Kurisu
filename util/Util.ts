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
function getUserByMessage(msg: Message, args: string[]) {
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

	return null;
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

export default{
	getUserByMessage,
	getHighestRole,
};