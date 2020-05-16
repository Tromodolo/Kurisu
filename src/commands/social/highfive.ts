/**
 * highfive.ts
 *
 * High fives another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { getUserByMessage } from "../../utility/Util";
import { Bot } from "../../bot";

export default class HighFive extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "highfive",
			description: "Highfives another user",
			usage: "highfive {user}",
			aliases: ["ava", "pfp", "proflepicture"],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			const user = getUserByMessage(message, args);

			if (user && message.member){
				message.channel.createMessage(`${message.member.mention}(✿･∀･)／＼(･∀･✿)${user.mention}`);
			}
			else{
				message.channel.createMessage("(✿･∀･)／＼(･∀･✿)");
			}

			return resolve();
		});
	}
}