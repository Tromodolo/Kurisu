import eris, { Guild, Member, Message, TextChannel } from "eris";
import moment from "moment";
import { Bot } from "../bot";
import { ConfigFeature } from "../database/models/GuildConfig";
import { DiscordEmbed } from "../utility/DiscordEmbed";
import { DatabaseEntities } from "./DatabaseHandler";

export class GuildEventHandler {
	private bot: Bot;

	constructor(){
		this.userLeft = this.userLeft.bind(this);
		this.userJoin = this.userJoin.bind(this);
		this.userBanned = this.userBanned.bind(this);
		this.messageDelete = this.messageDelete.bind(this);
		this.messageEdit = this.messageEdit.bind(this);
	}

	initialize(bot: Bot){
		this.bot = bot;
	}

	public hookEvent(){
		this.bot.client.on("guildMemberRemove", this.userLeft);
		this.bot.client.on("guildMemberAdd", this.userJoin);
		this.bot.client.on("guildBanAdd", this.userBanned);
		this.bot.client.on("messageDelete", this.messageDelete);
		this.bot.client.on("messageUpdate", this.messageEdit);
	}

	public unhookEvent(){
		this.bot.client.off("guildMemberRemove", this.userLeft);
		this.bot.client.off("guildMemberAdd", this.userJoin);
		this.bot.client.off("guildBanAdd", this.userBanned);
		this.bot.client.off("messageDelete", this.messageDelete);
		this.bot.client.off("messageUpdate", this.messageEdit);
	}

	private async messageDelete(message: Message){
		if (!message.content){
			return;
		}
		const guild = (message.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.EditMessageNotification);
		if (config){
			if (config.enabled){
				const embed = new DiscordEmbed();

				embed.setAuthor(`Message Deleted (${message.author.username}#${message.author.discriminator})`, "", message.author.avatarURL);
				embed.setColor(0xfa5f5f);
				embed.setDescription(message.content);
				embed.setFooter("", moment(message.createdAt).utc().format());

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async messageEdit(newMessage: Message, oldMessage?: Message){
		if (!oldMessage || !newMessage || newMessage.author.bot){
			return;
		}
		const guild = (newMessage.channel as TextChannel).guild;
		if (!guild){
			return;
		}
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.EditMessageNotification);
		if (config){
			if (config.enabled){
				const embed = new DiscordEmbed();

				embed.setAuthor(`Message Edited (${newMessage.author.username}#${newMessage.author.discriminator})`, "", newMessage.author.avatarURL);
				embed.setColor(0x5faafa);

				embed.addField("Old", oldMessage.content.length > 250 ? oldMessage.content.substring(0, 249) + "..." : oldMessage.content || "");
				embed.addField("New", newMessage.content.length > 250 ? newMessage.content.substring(0, 249) + "..." : newMessage.content || "");

				embed.setFooter("", moment(newMessage.createdAt).utc().format("LLL"));

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async userLeft(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.bot.db.getOrCreateUser(member);
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

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

				if (audit){
					if (audit.actionType === 22){
						return;
					}
					embed.setAuthor("User Kicked", "", this.bot.client.user.avatarURL);
					embed.addField("Kicked by", `${audit.user.username}#${audit.user.discriminator}`, true);
					embed.addField("Reason", `${audit.reason || "Unspecified"}`, true);
				}
				else{
					embed.setAuthor("User Left", "", this.bot.client.user.avatarURL);
				}

				embed.setColor(0xfa5f5f);
				embed.addField("Username", `${member.username}#${member.discriminator}`, true);
				embed.addField("ID", `${member.id}`, true);
				embed.setThumbnail(member.avatarURL);
				embed.setFooter("", moment().utc().format("LLL"));

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async userJoin(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.bot.db.getOrCreateUser(member);
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

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
				embed.addField("Username", `${member.username}#${member.discriminator}`, true);
				embed.addField("ID", `${member.id}`, true);
				embed.setThumbnail(member.avatarURL);
				embed.setFooter("", moment().utc().format("LLL"));

				this.bot.client.createMessage(config.value, embed.getEmbed());
			}
		}
	}

	private async userBanned(guild: Guild, member: Member){
		const dbGuild = await this.bot.db.getOrCreateGuild(guild);

		const config = dbGuild.configs.find((x) => x.configType === ConfigFeature.JoinLeaveNotification);
		if (config){
			if (config.enabled){
				const audit = await this.getAuditLog(guild, member);
				const embed = new DiscordEmbed();
				if (audit){
					embed.addField("Banned by", `${audit.user.username}#${audit.user.discriminator}`, true);
					embed.addField("Reason", audit.reason || "Unspecified", true);
				}

				embed.setAuthor("User Banned 🔨", "", this.bot.client.user.avatarURL);
				embed.setColor(0xfa5f5f);
				embed.addField("ID", `${member.id}`, true);
				embed.addField("Username", `${member.username}#${member.discriminator}`, true);
				embed.setThumbnail(member.avatarURL);
				embed.setFooter("", moment().utc().format("LLL"));

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