import { Member, Message, PrivateChannel } from "eris";
import moment from "moment";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getHighestRole, getUserByMessage } from "../../utility/Util";

export default new KurisuCommand (
	{
		name: "kick",
		description: "Kicks a specified user from the server.",
		usage: "kick {user} {reason}",
		aliases: [
			"k",
			"boot",
		],
		requirements: ["kickMembers"],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			let user: Member | undefined;

			user = getUserByMessage(message, [args[0]]);

			if (!user){
				message.channel.createMessage("User not found.");
			}
			else{
				if (!message.member){
					return resolve(null);
				}
				const targetedUserRole = getHighestRole(user.guild, user);
				const kickerRole = getHighestRole(message.member.guild, message.member);
				const botUser = message.member.guild.members.get(bot.client.user.id);

				if (!botUser){
					return resolve(null);
				}
				const botRole = getHighestRole(botUser.guild, botUser);

				if (!targetedUserRole || !kickerRole || !botRole){
					return resolve(null);
				}

				if (targetedUserRole.position >= kickerRole.position){
					return reject({title: "Action failed", message: "You can't kick someone with equal or higher role position than you"});
				}
				if (targetedUserRole.position >= botRole.position){
					return reject({title: "Action failed", message: "I can't kick someone with equal or higher role position than me"});
				}

				args.shift();
				const reason = args.join(" ") ?? "None specified";

				const embed = new DiscordEmbed();
				embed.setColor(parseInt(config.bot.color));
				embed.setTitle(`**You were kicked from ${message.member?.guild.name ?? "_Unavailable_"}**`);
				embed.addField("Reason", `
\`\`\`
${reason}
\`\`\`
`);

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
					return reject({title: "Action failed", message: "User couldn't be banned"});
				}
			}
			return resolve(null);
		});
	},
);
