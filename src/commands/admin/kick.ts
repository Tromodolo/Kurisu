import { Member, Message, PrivateChannel } from "eris";
import moment from "moment";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getHighestRole, getUserByMessage } from "../../utility/Util";

export default class Kick extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "kick",
			description: "Kicks a specified user from the server.",
			usage: "kick {user} {reason}",
			aliases: [
				"k",
				"boot",
			],
			requirements: ["kickMembers"],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let user: Member | undefined;

			user = getUserByMessage(message, args);

			if (!user){
				message.channel.createMessage("User not found.");
			}
			else{
				if (!message.member){
					return resolve();
				}
				const targetedUserRole = getHighestRole(user.guild, user);
				const kickerRole = getHighestRole(message.member.guild, message.member);
				const botUser = message.member.guild.members.get(this.bot.client.user.id);

				if (!botUser){
					return resolve();
				}
				const botRole = getHighestRole(botUser.guild, botUser);

				if (!targetedUserRole || !kickerRole || !botRole){
					return resolve();
				}

				if (targetedUserRole.position >= kickerRole.position){
					message.channel.createMessage("You can't kick someone with equal or higher role position than you");
					return resolve();
				}
				if (targetedUserRole.position >= botRole.position){
					message.channel.createMessage("I can't kick someone with equal or higher role position than me");
					return resolve();
				}

				const reason = args[1] || "None specified";

				const embed = new DiscordEmbed();
				embed.setColor(parseInt(config.bot.color));
				embed.setTitle(`**You were kicked from ${message.member ? message.member.guild.name : "_Unavailable_"}**`);
				embed.addField("Reason", `${reason}`);

				embed.setTimestamp(moment().toDate());

				try{
					user.user.getDMChannel().then(async (channel: PrivateChannel) => {
						channel.createMessage(embed.getEmbed()).then(async () => {
							if (user){
								await user.kick(reason);
							}
						});
					});
					await message.channel.createMessage(`${user.username}#${user.discriminator} was successfully kicked`);
				}
				catch (e){
					await message.channel.createMessage("User couldn't be kicked");
				}
			}
			return resolve();
		});
	}
}