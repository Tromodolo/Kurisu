import { Client, Emoji, GuildChannel, Message, TextChannel } from "eris";
import { Bot } from "../../bot";
import botConfig from "../../config";
import { Guild } from "../../database/models/Guild";
import { ConfigFeature, GuildConfig } from "../../database/models/GuildConfig";
import { DatabaseHandler } from "../../handlers";
import ReactionListener from "../../handlers/ReactionListener";
import ResponseListener from "../../handlers/ResponseListener";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getChannelByName } from "../../utility/Util";

const LEVEL_UP_EMOJI = "🎉";
const KICK_BAN_EMOJI = "🛑";
const JOIN_LEAVE_EMOJI = "🚪";
const EDIT_DELETE_EMOJI = "📝";

export default class Settings extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "settings",
			description: "Sets up server settings",
			usage: "settings",
			aliases: [
				"config",
			],
			requirements: ["manageGuild"],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (!(message.channel as GuildChannel).guild){
				return;
			}
			const guild = await this.bot.db.getOrCreateGuild((message.channel as GuildChannel).guild);

			const embed = new DiscordEmbed();
			embed.setAuthor("Admin Menu", "", this.bot.client.user.avatarURL);
			embed.setColor(parseInt(botConfig.bot.color));
			embed.setDescription(`
**React to this message to edit settings.**

${LEVEL_UP_EMOJI} - Level-up Messages
${KICK_BAN_EMOJI} - Ban/Kick Messages
${JOIN_LEAVE_EMOJI} - Join/Leave Messages
${EDIT_DELETE_EMOJI} - Edited/Deleted Messages
			`);
			const sentMessage = await message.channel.createMessage(embed.getEmbed());
			sentMessage.addReaction(LEVEL_UP_EMOJI);
			sentMessage.addReaction(KICK_BAN_EMOJI);
			sentMessage.addReaction(JOIN_LEAVE_EMOJI);
			sentMessage.addReaction(EDIT_DELETE_EMOJI);

			let emoji: Emoji;
			let userId: string = "";

			try {
				try{
					const reactionRes = await ReactionListener.waitForReaction(this.bot.client, sentMessage, message.author.id, 30 * 1000);
					emoji = reactionRes.emoji;
					userId = reactionRes.userId;
				}
				catch{
					throw new Error("Menu timed out. Please try again.");
				}

				switch (emoji.name){
				case LEVEL_UP_EMOJI:
					await sentMessage.removeReactions();
					await handleEnabled(sentMessage, this.bot.db, guild, this.bot.client, userId, ConfigFeature.LevelUpMessage);
					break;
				case KICK_BAN_EMOJI:
					await sentMessage.removeReactions();
					await handleSelectChannel(sentMessage, this.bot.db, guild, this.bot.client, userId, ConfigFeature.KickBanNotification);
					break;
				case JOIN_LEAVE_EMOJI:
					await sentMessage.removeReactions();
					await handleSelectChannel(sentMessage, this.bot.db, guild, this.bot.client, userId, ConfigFeature.JoinLeaveNotification);
					break;
				case EDIT_DELETE_EMOJI:
					await sentMessage.removeReactions();
					await handleSelectChannel(sentMessage, this.bot.db, guild, this.bot.client, userId, ConfigFeature.EditMessageNotification);
					break;
				default:
					break;
				}
			}
			catch (error) {
				return reject(error.message);
			}
			return resolve();
		});
	}
}

async function handleSelectChannel(reactionMessage: Message, db: DatabaseHandler, guild: Guild, bot: Client, userId: string, type: ConfigFeature){
	const index = guild.configs.findIndex((x) => x.configType === type);
	let config: GuildConfig;
	if (index < 0){
		config = new GuildConfig();
		config.configType = type;
		config.enabled = false;
		config.guild = guild;
		config.value = "";
	}
	else{
		config = guild.configs[index];
	}

	const activeChannel = (reactionMessage.channel as TextChannel).guild.channels.get(config.value);

	const embed = new DiscordEmbed();
	embed.setAuthor("Admin Menu", "", bot.user.avatarURL);
	embed.setColor(parseInt(botConfig.bot.color));
	embed.setDescription(`Enter *channel name*, **disable** or **cancel**.
Currently: **${config.enabled ? activeChannel?.name ?? "Deleted Channel" : "Disabled"}**`);
	await reactionMessage.edit(embed.getEmbed());

	let settingResponse: Message;
	try{
		settingResponse = await ResponseListener.waitForMessage(bot, userId, 30 * 1000);
	}
	catch{
		throw new Error("Menu timed out. Please try again.");
	}
	switch (settingResponse.content.toLowerCase()){
		case "disable":
			config.enabled = false;
			embed.setDescription(":x: Setting successfully disabled.");
			await reactionMessage.edit(embed.getEmbed());
			break;
		case "cancel":
			embed.setDescription(":exclamation: Menu canceled.");
			await reactionMessage.edit(embed.getEmbed());
			break;
		default:
			const channels = (reactionMessage.channel as TextChannel).guild.channels.filter((x) => x.type === 0).map((x) => x);
			const channel = getChannelByName((channels as TextChannel[]), settingResponse.content);
			embed.setDescription(`:white_check_mark: Channel set to **#${channel.name}**`);
			await reactionMessage.edit(embed.getEmbed());

			config.enabled = true;
			config.value = channel.id;
			break;
	}

	if (index < 0){
		guild.configs.push(config);
	}
	else{
		guild.configs[index] = config;
	}

	await db.guildRepo.save(guild);
}

async function handleEnabled(reactionMessage: Message, db: DatabaseHandler, guild: Guild, bot: Client, userId: string, type: ConfigFeature){
	const index = guild.configs.findIndex((x) => x.configType === type);
	let config: GuildConfig;
	if (index < 0){
		config = new GuildConfig();
		config.configType = type;
		config.enabled = false;
		config.guild = guild;
		config.value = "";
	}
	else{
		config = guild.configs[index];
	}

	const embed = new DiscordEmbed();
	embed.setAuthor("Admin Menu", "", bot.user.avatarURL);
	embed.setColor(parseInt(botConfig.bot.color));
	embed.setDescription(`Enter **enable**, **disable** or **cancel**.
Currently: ${config.enabled ? "Enabled" : "Disabled"}`);
	await reactionMessage.edit(embed.getEmbed());

	let settingResponse: Message;
	try{
		settingResponse = await ResponseListener.waitForMessage(bot, userId, 30 * 1000);
	}
	catch{
		throw new Error("Menu timed out. Please try again.");
	}
	switch (settingResponse.content.toLowerCase()){
		case "enable":
			config.enabled = true;
			embed.setDescription(":white_check_mark: Setting successfully enabled.");
			await reactionMessage.edit(embed.getEmbed());
			break;
		case "disable":
			config.enabled = false;
			embed.setDescription(":x: Setting successfully disabled.");
			await reactionMessage.edit(embed.getEmbed());
			break;
		case "cancel":
			embed.setDescription(":exclamation: Menu canceled.");
			await reactionMessage.edit(embed.getEmbed());
			return;
		default:
			return;
	}

	if (index < 0){
	guild.configs.push(config);
	}
	else{
		guild.configs[index] = config;
	}

	await db.guildRepo.save(guild);
}