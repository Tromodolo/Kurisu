import { Message, Client, Emoji, GuildChannel } from "eris";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { DatabaseHandler } from "../../handlers";
import { ReactionHandler } from "../../handlers/ReactionHandler";
import { ConfigFeature, GuildConfig } from "../../database/models/GuildConfig";
import { ResponseHandler } from "../../handlers/ResponseHandler";
import { Guild } from "../../database/models/Guild";
import { Db } from "typeorm";

const LEVEL_UP_EMOJI = "🎉";

export default class Settings extends Command {
	constructor(){
		super();
		this.commandName = "settings";
		this.aliases = [
			"config",
		];
		this.description = "Sets up server settings";
		this.fullDescription = "Sets up server settings";
		this.usage = "settings";
		this.requirements = [
			"manageGuild",
		];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[], db: DatabaseHandler, bot: Client) {
		return new Promise(async (resolve) => {
			if (!(message.channel as GuildChannel).guild){
				return;
			}
			const guild = await db.getOrCreateGuild((message.channel as GuildChannel).guild);

			const embed = new DiscordEmbed();
			embed.setAuthor("Admin Menu", "", bot.user.avatarURL);
			embed.setColor(parseInt(config.bot.color));
			embed.setDescription(`
**React to this message to edit settings.**

:tada: - Level-up Messages
			`);
			const sentMessage = await message.channel.createMessage(embed.getEmbed());
			sentMessage.addReaction(LEVEL_UP_EMOJI);

			const reactions = new ReactionHandler(bot, sentMessage, 30 * 1000);
			reactions.on("reactionAdd", async (reactionMessage: Message, emoji: Emoji, userId: string) => {
				if (userId === message.author.id){
					switch (emoji.name){
						case LEVEL_UP_EMOJI:
							await reactionMessage.removeReactions();
							await handleLevelUpConfig(reactionMessage, db, guild, bot, userId);
							return;
						default:
							return;
					}
				}
			});
			return resolve();
		});
	}
}

async function handleLevelUpConfig(reactionMessage: Message, db: DatabaseHandler, guild: Guild, bot: Client, userId: string){
	const index = guild.configs.findIndex((x) => x.configType === ConfigFeature.LevelUpMessage);
	let levelUpConfig;
	if (index < 0){
		levelUpConfig = new GuildConfig();
		levelUpConfig.configType = ConfigFeature.LevelUpMessage;
		levelUpConfig.enabled = false;
		levelUpConfig.guild = guild;
		levelUpConfig.value = "";
	}
	else{
		levelUpConfig = guild.configs[index];
	}

	const embed = new DiscordEmbed();
	embed.setAuthor("Admin Menu", "", bot.user.avatarURL);
	embed.setColor(parseInt(config.bot.color));
	embed.setDescription(`Enter **enable**, **disable** or **cancel**. Currently: ${levelUpConfig!.enabled ? "Enabled" : "Disabled"}`);
	await reactionMessage.edit(embed.getEmbed());

	const responseHandler = new ResponseHandler(bot, userId, 30 * 1000);
	responseHandler.on("response", async (responseMessage: Message) => {
		switch (responseMessage.content.toLowerCase()){
			case "enable":
				levelUpConfig!.enabled = true;
				embed.setDescription(":white_check_mark: Setting successfully enabled.");
				await reactionMessage.edit(embed.getEmbed());
				break;
			case "disable":
				levelUpConfig!.enabled = false;
				embed.setDescription(":x: Setting successfully disabled.");
				await reactionMessage.edit(embed.getEmbed());
				break;
			case "cancel":
				embed.setDescription(":exclamation: Menu canceled.");
				await reactionMessage.edit(embed.getEmbed());
				responseHandler.stopListening();
				return;
			default:
				return;
		}

		if (index < 0){
		guild.configs.push(levelUpConfig);
		}
		else{
			guild.configs[index] = levelUpConfig;
		}

		await db.guildRepo.save(guild);
	});
}