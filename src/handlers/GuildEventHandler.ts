import eris, { Guild, Member, Message, TextChannel, User } from "eris";
import moment from "moment";
import { Bot } from "../bot";
import { ConfigFeature } from "../database/models/GuildConfig";
import { DiscordEmbed } from "../utility/DiscordEmbed";
import { DatabaseEntities } from "./DatabaseHandler";
import { GuildRoleMenu } from "../database/models/GuildRoleMenu";

export class GuildEventHandler {
	private bot: Bot;

	constructor(){
		this.userLeft = this.userLeft.bind(this);
		this.userJoin = this.userJoin.bind(this);
		this.userBanned = this.userBanned.bind(this);
		this.messageDelete = this.messageDelete.bind(this);
		this.messageBulkDelete = this.messageBulkDelete.bind(this);
		this.messageEdit = this.messageEdit.bind(this);
		this.messageReactionAdd = this.messageReactionAdd.bind(this);
		this.messageReactionRemove = this.messageReactionRemove.bind(this);
	}

	initialize(bot: Bot){
		this.bot = bot;
	}

	public hookEvent(){
		this.bot.client.on("guildMemberRemove", this.userLeft);
		this.bot.client.on("guildMemberAdd", this.userJoin);
		this.bot.client.on("guildBanAdd", this.userBanned);
		this.bot.client.on("messageDelete", this.messageDelete);
		this.bot.client.on("messageDeleteBulk", this.messageBulkDelete);
		this.bot.client.on("messageUpdate", this.messageEdit);
		this.bot.client.on("messageReactionAdd", this.messageReactionAdd);
		this.bot.client.on("messageReactionRemove", this.messageReactionRemove);
	}

	public unhookEvent(){
		this.bot.client.off("guildMemberRemove", this.userLeft);
		this.bot.client.off("guildMemberAdd", this.userJoin);
		this.bot.client.off("guildBanAdd", this.userBanned);
		this.bot.client.off("messageDelete", this.messageDelete);
		this.bot.client.off("messageDeleteBulk", this.messageBulkDelete);
		this.bot.client.off("messageUpdate", this.messageEdit);
		this.bot.client.off("messageReactionAdd", this.messageReactionAdd);
		this.bot.client.off("messageReactionRemove", this.messageReactionRemove);
	}

	private async messageReactionAdd(message: Message, emoji: {id?: string, name: string}, member: User | { id: string }){
		const guild = (message.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const MenuRepo = this.bot.db.connection.getRepository(GuildRoleMenu);
		const menu = await MenuRepo.findOne({
			relations: [
				"roles",
			],
			where: {
				activeMessageId: message.id,
			},
		});
		if (menu){
			const foundReaction = menu.roles.find((x) => x.emoji === emoji.name);
			if (foundReaction){
				let user: Member | undefined;
				if (Object.hasOwnProperty("user")) {
					user = (member as Member);
				} else {
					user = (message.channel as TextChannel).guild?.members.get(member.id);
				}
				user?.addRole(foundReaction.roleId);
			}
		}
	}

	private async messageReactionRemove(message: Message, emoji: {id?: string, name: string}, userID: string){
		const guild = (message.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const MenuRepo = this.bot.db.connection.getRepository(GuildRoleMenu);
		const menu = await MenuRepo.findOne({
			relations: [
				"roles",
			],
			where: {
				activeMessageId: message.id,
			},
		});
		if (menu){
			const foundReaction = menu.roles.find((x) => x.emoji === emoji.name);
			if (foundReaction){
				const user = (message.channel as TextChannel).guild?.members.get(userID);
				user?.removeRole(foundReaction.roleId);
			}
		}
	}

	private async messageDelete(message: Message | {id: string}){
		// Quick and dirty check to see if it's cached or not.
		// Ignore messages that aren't cached.
		if (!message.hasOwnProperty("content")){
			return;
		}
		const msg = message as Message;
		const guild = (msg.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.EditMessageNotification);
		if (config){
			if (config.enabled){
				const embed = new DiscordEmbed();

				embed.setAuthor(`Message Deleted (${msg.author.username}#${msg.author.discriminator})`, "", msg.author.avatarURL);
				embed.setColor(0xfa5f5f);
				embed.setDescription(msg.content);
				embed.setTimestamp(new Date());

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async messageBulkDelete(messages: Array<Partial<Message> | {id: string}>){
		// Quick and dirty check to see if it's cached or not.
		// Ignore messages that aren't cached.
		// if (!message.hasOwnProperty("content")){
		// 	return;
		// }
		const msg = messages.find((x) => {
			if (!x.hasOwnProperty("channel")) {
				return false;
			}
			if (!((x as Message).channel as TextChannel).guild) {
				return false;
			}
			return true;
		}) as Message;
		const guild = (msg.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);
		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.EditMessageNotification);
		if (config){
			if (config.enabled){
				let msgStr = "";
				for (const mes of messages) {
					if (mes.hasOwnProperty("content")) {
					msgStr += `Id: ${mes.id} Time: ${new Date((mes as Message).timestamp).toLocaleString()} 
${(mes as Message).author?.username ?? "??"}#${(mes as Message).author?.discriminator ?? "??"}
  ${(mes as Message).content}

`;

					} else {
						msgStr += `Id: ${mes.id} 
  *Message not cached

`;
					}
				}

				let buff = Buffer.from(msgStr, "utf-8");
				await this.bot.client.createMessage(config.value, "", { file: buff, name: `bulk-deleted-messages-${msg.author.id}.txt`});
			}
		}
	}

	private async messageEdit(newMessage: Message | {id: string}, oldMessage?: Message | {id: string}){
		// Quick and dirty check to see if it's cached or not.
		// Ignore messages that aren't cached.
		if (!newMessage.hasOwnProperty("content") || !oldMessage?.hasOwnProperty("content")){
			return;
		}

		let oldMsg = oldMessage as Message;
		let newMsg = newMessage as Message;
		if (!oldMsg || !newMsg || newMsg.author.bot){
			return;
		}
		// This is to make sure it doesn't trigger when embeds pop up for links.
		// Because apparently that is a message edit.
		if (oldMsg.embeds.length === 0 && newMsg.embeds.length > 0){
			return;
		}
		const guild = (newMsg.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.EditMessageNotification);
		if (config){
			if (config.enabled){
				const embed = new DiscordEmbed();

				embed.setAuthor(`Message Edited (${newMsg.author.username}#${newMsg.author.discriminator})`, "", newMsg.author.avatarURL);
				embed.setColor(0x5faafa);

				embed.addField("Old", oldMsg.content.length > 250 ? oldMsg.content.substring(0, 249) + "..." : oldMsg.content ?? "");
				embed.addField("New", newMsg.content.length > 250 ? newMsg.content.substring(0, 249) + "..." : newMsg.content ?? "");
				embed.addField(
					"Channel",
					`[Open Channel](https://discordapp.com/channels/${(newMsg.channel as TextChannel).guild.id}/${newMsg.channel.id} )`,
					true);

				embed.addField(
					"Message",
					`[Open Message](https://discordapp.com/channels/${(newMsg.channel as TextChannel).guild.id}/${newMsg.channel.id}/${newMsg.id})`,
					true);

				embed.setTimestamp(new Date());

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async userLeft(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.bot.db.getOrCreateUser(member);
		const dbGuild = await this.bot.db.getOrCreateGuild(guild, ["configs", "userList"]);

		if (dbGuild.userList.find((x) => x.id === dbUser.id)){
			const index = dbGuild.userList.findIndex((x) => x.id === dbUser.id);
			dbGuild.userList.splice(index, 1);
			await this.bot.db.saveEntity(dbGuild, DatabaseEntities.Guild);
		}

		if (dbUser.guilds.find((x) => x.id === dbGuild.id)){
			const index = dbUser.guilds.findIndex((x) => x.id === dbGuild.id);
			dbUser.guilds.splice(index, 1);
			await this.bot.db.saveEntity(dbUser, DatabaseEntities.User);
		}

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.JoinLeaveNotification);
		if (config){
			if (config.enabled){
				const embed = new DiscordEmbed();
				const audit = await this.getAuditLog(guild, member);

				embed.setColor(0xfa5f5f);
				embed.addField("Username", `${member.username}#${member.discriminator}`, true);
				embed.setTimestamp(new Date());

				if (audit){
					if (audit.actionType === 22){
						return;
					}
					embed.setAuthor("User Kicked", "", member.avatarURL);
					embed.addField("Kicked by", `${audit.user.mention}`, true);
					embed.addField("ID", `${member.id}`, true);
					embed.addField("Reason", `
\`\`\`
${audit.reason ?? "Unspecified"}
\`\`\`
`, false);
				}
				else{
					embed.addField("ID", `${member.id}`, true);
					embed.setAuthor("User Left", "", member.avatarURL);
				}

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async userJoin(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.bot.db.getOrCreateUser(member);
		const dbGuild = await this.bot.db.getOrCreateGuild(guild, ["configs", "userList"]);

		if (!dbGuild.userList.find((x) => x.id === dbUser.id)){
			dbGuild.userList.push(dbUser);
			await this.bot.db.saveEntity(dbGuild, DatabaseEntities.Guild);
		}
		if (!dbUser.guilds.find((x) => x.id === dbGuild.id)){
			dbUser.guilds.push(dbGuild);
			await this.bot.db.saveEntity(dbUser, DatabaseEntities.User);
		}

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.JoinLeaveNotification);
		if (config){
			if (config.enabled){
				const embed = new DiscordEmbed();

				embed.setAuthor("User Joined", "", this.bot.client.user.avatarURL);
				embed.setColor(0xa6f28f);
				embed.addField("Username", `${member.username}#${member.discriminator}`);
				embed.addField("ID", `${member.id}`);
				embed.setThumbnail(member.avatarURL);
				embed.setTimestamp(new Date());

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async userBanned(guild: Guild, member: Member){
		const dbGuild = await this.bot.db.getOrCreateGuild(guild, ["configs", "userList"]);

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.JoinLeaveNotification);
		if (config){
			if (config.enabled){
				const audit = await this.getAuditLog(guild, member);
				const embed = new DiscordEmbed();

				embed.setAuthor("User Banned 🔨", "", member.avatarURL);
				embed.setColor(0xfa5f5f);
				embed.addField("Username", `${member.username}#${member.discriminator}`, true);
				embed.setTimestamp(new Date());

				if (audit){
					embed.addField("Banned by", `${audit.user.mention}`, true);
					embed.addField("ID", `${member.id}`, true);
					embed.addField("Reason", `
\`\`\`
${audit.reason ?? "Unspecified"}
\`\`\`
`, false);
				}
				else {
					embed.addField("ID", `${member.id}`, true);
				}

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
		return;
	}

	private async getAuditLog(guild: Guild, user: Member){
		const audits = await guild.getAuditLogs();
		for (let index = 0; index < 5; index++){
			if (audits.entries[index].targetID === user.id){
				const audit = audits.entries[index];
				if (audit.actionType  === 20 || audit.actionType === 22){
					return audits.entries[index];
				}
			}
		}
		return null;
	}
}