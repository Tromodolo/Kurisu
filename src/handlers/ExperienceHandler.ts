import { User } from "../database/models/User";
import { Guild } from "../database/models/Guild";
import moment from "moment";

import eris, { Message, Member } from "eris";
import { Repository } from "typeorm";
import { DatabaseHandler } from "./DatabaseHandler";
import { UserLevel } from "../database/models/UserLevel";
import { ConfigFeature } from "../database/models/GuildConfig";

class ExperienceHandler{
	private bot: eris.Client;
	private db: DatabaseHandler;

	private userRepo: Repository<User>;
	private guildRepo: Repository<Guild>;

	constructor(bot: eris.Client, db: DatabaseHandler){
		this.bot = bot;
		this.db = db;

		this.handleExperience = this.handleExperience.bind(this);

		this.userRepo = this.db.connection.getRepository(User);
		this.guildRepo = this.db.connection.getRepository(Guild);
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

			const dbUser = await this.getOrCreateUser(member);
			const dbGuild = await this.getOrCreateGuild(guild);

			const exp = this.getRandomExp(15, 25);

			// If user does not exist in guild list, then add them
			if ((dbGuild.userList && !dbGuild.userList.find((x) => x.id === dbUser.id))){
				dbGuild.userList.push(dbUser);
				this.guildRepo.save(dbGuild);
			}

			const then = moment(dbUser.experience.lastUpdated).add(1, "minute");
			const now = moment();
			if (now.isAfter(then)){
				dbUser.experience.total += exp;
				dbUser.experience.lastUpdated = moment().toDate();
				this.userRepo.save(dbUser);

				const oldExp = dbUser.experience.total - exp;
				const newExp = dbUser.experience.total;

				const levelCheck = this.checkIfLevelUp(oldExp, newExp);
				if (levelCheck.leveledUp){
					const foundConfig = dbGuild.configs.find((x) => x.configType === ConfigFeature.LevelUpMessage);
					if (foundConfig){
						if (foundConfig.enabled){
							message.channel.createMessage(`:star: ${message.author.username} has leveled up to level ${levelCheck.level} :tada:`);
						}
					}
					else{
						// If the config wasn't found, assume enabled
						message.channel.createMessage(`:star: ${message.author.username} has leveled up to level ${levelCheck.level} :tada:`);
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

	private async getOrCreateGuild(guild: eris.Guild): Promise<Guild>{
		let foundGuild = await this.guildRepo.findOne({
			where: {
				id: guild.id,
			},
			relations: [
				"configs",
				"userList",
			],
		});
		if (!foundGuild){
			foundGuild = new Guild();
			foundGuild.id = guild.id;
			foundGuild.name = guild.name;
			foundGuild.avatarURL = guild.iconURL || "";
			foundGuild.configs = [];
			foundGuild.userList = [];
			return foundGuild;
		}
		return foundGuild;
	}

	private async getOrCreateUser(member: Member): Promise<User>{
		let user = await this.userRepo.findOne({
			where: {
				id: member.id,
			},
			relations: [
				"experience",
			],
		});
		if (!user){
			user = new User();
			user.id = member.id;
			user.guilds = [];

			const exp = new UserLevel();
			exp.total = 0;
			user.experience = exp;

			await this.userRepo.save(user);
			return user;
		}
		return user;
	}
}

export {
	ExperienceHandler,
};
