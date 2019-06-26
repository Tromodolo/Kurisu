import { User } from "../database/models/User";
import { Guild } from "../database/models/Guild";

import eris, { Message, Member } from "eris";
import { Repository } from "typeorm";
import { DatabaseHandler } from "./DatabaseHandler";
import { UserLevel } from "../database/models/UserLevel";

class ExperienceHandler{
	private bot: eris.Client;
	private db: DatabaseHandler;

	private userRepo: Repository<User>;
	private guildRepo: Repository<Guild>;

	constructor(bot: eris.Client, db: DatabaseHandler){
		this.bot = bot;
		this.db = db;

		this.userRepo = this.db.connection.getRepository(User);
		this.guildRepo = this.db.connection.getRepository(Guild);

		this.userLeft = this.userLeft.bind(this);
		this.userJoin = this.userJoin.bind(this);
	}

	public hookEvent(){
		this.bot.on("guildMemberRemove", this.userLeft);
		this.bot.on("guildMemberAdd", this.userJoin);
	}

	public unhookEvent(){
		this.bot.off("guildMemberRemove", this.userLeft);
		this.bot.off("guildMemberAdd", this.userJoin);
	}

	private async userLeft(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.getOrCreateUser(member);
		const dbGuild = await this.getOrCreateGuild(guild);

		if (dbGuild.userList.find((x) => x.id === dbUser.id)){
			const index = dbGuild.userList.findIndex((x) => x.id === dbUser.id);
			dbGuild.userList.splice(index, 1);
			await this.guildRepo.save(dbGuild);
		}

		if (dbUser.guilds.find((x) => x.id === dbGuild.id)){
			const index = dbUser.guilds.findIndex((x) => x.id === dbGuild.id);
			dbUser.guilds.splice(index, 1);
			await this.userRepo.save(dbUser);
		}
	}

	private async userJoin(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.getOrCreateUser(member);
		const dbGuild = await this.getOrCreateGuild(guild);

		if (!dbGuild.userList.find((x) => x.id === dbUser.id)){
			dbGuild.userList.push(dbUser);
			await this.guildRepo.save(dbGuild);
		}
		if (!dbUser.guilds.find((x) => x.id === dbGuild.id)){
			dbUser.guilds.push(dbGuild);
			await this.userRepo.save(dbUser);
		}
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
