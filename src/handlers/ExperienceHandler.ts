import { User } from "../database/models/User";
import { Guild } from "../database/models/Guild";
import moment from "moment";

import eris, { Message, Member } from "eris";
import { Repository } from "typeorm";
import { DatabaseHandler, DatabaseEntities } from "./DatabaseHandler";
import { UserLevel } from "../database/models/UserLevel";
import { ConfigFeature } from "../database/models/GuildConfig";

class ExperienceHandler{
	private bot: eris.Client;
	private db: DatabaseHandler;

	constructor(bot: eris.Client, db: DatabaseHandler){
		this.bot = bot;
		this.db = db;

		this.handleExperience = this.handleExperience.bind(this);
	}

	public hookEvent(){
		this.bot.on("messageCreate", this.handleExperience);
	}

	public unhookEvent(){
		this.bot.off("messageCreate", this.handleExperience);
	}

	private async handleExperience(message: Message){
		// Don't give EXP for dms
		if (message.channel instanceof eris.PrivateChannel || message.author.bot){
			return;
		}
		else{
			const member = message.member!;
			const guild = member.guild;

			const dbUser = await this.db.getOrCreateUser(member);
			const dbGuild = await this.db.getOrCreateGuild(guild);

			const exp = this.getRandomExp(15, 25);

			// If user does not exist in guild list, then add them
			if ((dbGuild.userList && !dbGuild.userList.find((x) => x.id === dbUser.id))){
				dbGuild.userList.push(dbUser);
				await this.db.saveEntity(dbGuild, DatabaseEntities.Guild);
			}

			const then = moment(dbUser.experience.lastUpdated).add(1, "minute");
			const now = moment();
			if (now.isAfter(then)){
				dbUser.experience.total += exp;
				dbUser.experience.lastUpdated = moment().toDate();
				await this.db.saveEntity(dbUser, DatabaseEntities.User);

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

export {
	ExperienceHandler,
};
