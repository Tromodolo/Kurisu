import eris, { Message } from "eris";
import moment from "moment";
import { Bot } from "../bot";
import { ConfigFeature } from "../database/models/GuildConfig";
import { DatabaseEntities } from "./DatabaseHandler";

export class ExperienceHandler{
	private bot: Bot;

	constructor(){
		this.handleExperience = this.handleExperience.bind(this);
	}

	initialize(bot: Bot){
		this.bot = bot;
	}

	public hookEvent(){
		this.bot.client.on("messageCreate", this.handleExperience);
	}

	public unhookEvent(){
		this.bot.client.off("messageCreate", this.handleExperience);
	}

	private async handleExperience(message: Message){
		// Don't give EXP for dms
		if (message.channel instanceof eris.PrivateChannel || message.author.bot){
			return;
		}
		else{
			const member = message.member!;
			const guild = member.guild;

			const dbUser = await this.bot.db.getOrCreateUser(member);
			const dbGuild = await this.bot.db.getOrCreateGuild(guild, ["configs", "userList"]);

			const exp = this.getRandomExp(15, 25);

			// If user does not exist in guild list, then add them
			if (!(dbGuild?.userList?.find((x) => x.id === dbUser.id))){
				dbGuild.userList.push(dbUser);
				await this.bot.db.saveEntity(dbGuild, DatabaseEntities.Guild);
			}

			const then = moment(dbUser.experience.lastUpdated).add(1, "minute");
			const now = moment();
			if (now.isAfter(then)){
				dbUser.experience.total += exp;
				dbUser.experience.lastUpdated = moment().toDate();
				await this.bot.db.saveEntity(dbUser, DatabaseEntities.User);

				const oldExp = dbUser.experience.total - exp;
				const newExp = dbUser.experience.total;

				const levelCheck = this.checkIfLevelUp(oldExp, newExp);
				if (levelCheck.leveledUp){
					const foundConfig = dbGuild.configs.find((x) => x.configType === ConfigFeature.LevelUpMessage);
					if (foundConfig){
						if (foundConfig.enabled){
							message.channel.createMessage(`:star: **${message.author.username}** has leveled up to level **${levelCheck.level}** :tada:`);
						}
					}
					else{
						// If the config wasn't found, assume disabled
						// message.channel.createMessage(`:star: **${message.author.username}** has leveled up to level **${levelCheck.level}** :tada:`);
					}
				}
			}
		}
	}

	// EXP Formula 50 * x ^ 2
	private checkIfLevelUp(oldExp: number, newExp: number): {leveledUp: boolean, level: number}{
		const oldLevel = this.getLevelFromExp(oldExp);
		const newLevel = this.getLevelFromExp(newExp);
		let leveledUp = false;
		if (newLevel > oldLevel){
			leveledUp = true;
		}
		return {
			leveledUp,
			level: newLevel,
		};
	}

	// 50 * x ^ 2 = Y
	// x ^ 2 = Y / 50
	private getLevelFromExp(exp: number){
		return Math.floor(Math.sqrt(exp / 50)) + 1;
	}

	/* private async getOrCreateGuildScore */

	private getRandomExp(min: number, max: number){
		return Math.random() * (max - min) + min;
	}
}
