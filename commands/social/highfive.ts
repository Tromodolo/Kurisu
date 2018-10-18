/**
 * highfive.ts
 *
 * High fives another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import { bot } from "../../bot";
import { getUserByMessage } from "../../util/Util";

const commandName: string = "highfive";
const aliases: string[] = [];
const description: string = "High fives another user";
const fullDescription: string = "High fives another user";
const usage: string = "highfive [user]";
const requirements: object = {};
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const user = getUserByMessage(message, args);

		if (user && message.member){
			bot.createMessage(message.channel.id, `${message.member.mention}(✿･∀･)／＼(･∀･✿)${user.mention}`);
		}
		else{
			bot.createMessage(message.channel.id, "(✿･∀･)／＼(･∀･✿)");
		}

		return resolve();
	});
}

export {
	aliases,
	description,
	fullDescription,
	commandFunc,
	commandName,
	usage,
	requirements,
	deleteCommand,
};