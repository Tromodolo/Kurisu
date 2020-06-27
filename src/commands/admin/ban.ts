import { Member, Message, PrivateChannel } from "eris";
import moment from "moment";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getHighestRole, getUserByMessage } from "../../utility/Util";

export default class Ban extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "ban",
			description: "Bans a specified user from the server.",
			usage: "ban {user} {reason}",
			aliases: ["b"],
			requirements: ["banMembers"],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			let user: Member | undefined;

			user = getUserByMessage(message, [args[0]]);

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
					return reject({title: "Action failed", message: "You can't ban someone with equal or higher role position than you"});
				}
				if (targetedUserRole.position >= botRole.position){
					return reject({title: "Action failed", message: "I can't ban someone with equal or higher role position than me"});
				}

				args.shift();
				const reason = args.join(" ") ?? "None specified";

				const embed = new DiscordEmbed();
				embed.setColor(parseInt(config.bot.color));
				embed.setTitle(`**You were banned from ${message.member?.guild.name ?? "_Unavailable_"}**`);
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
								await user.ban(1, reason);
							}
						});
					});
					await message.channel.createMessage(`${user.username}#${user.discriminator} was successfully banned`);
				}
				catch (e){
					return reject({title: "Action failed", message: "User couldn't be banned"});
				}
			}
			return resolve();
		});
	}
}