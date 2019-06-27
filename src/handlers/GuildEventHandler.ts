import { User } from "../database/models/User";
import { Guild } from "../database/models/Guild";

import eris, { Message, Member } from "eris";
import { Repository } from "typeorm";
import { DatabaseHandler, DatabaseEntities } from "./DatabaseHandler";
import { UserLevel } from "../database/models/UserLevel";

class ExperienceHandler{
	private bot: eris.Client;
	private db: DatabaseHandler;

	constructor(bot: eris.Client, db: DatabaseHandler){
		this.bot = bot;
		this.db = db;

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
		const dbUser = await this.db.getOrCreateUser(member);
		const dbGuild = await this.db.getOrCreateGuild(guild);

		if (dbGuild.userList.find((x) => x.id === dbUser.id)){
			const index = dbGuild.userList.findIndex((x) => x.id === dbUser.id);
			dbGuild.userList.splice(index, 1);
			await this.db.saveEntity(dbGuild, DatabaseEntities.Guild);
		}

		if (dbUser.guilds.find((x) => x.id === dbGuild.id)){
			const index = dbUser.guilds.findIndex((x) => x.id === dbGuild.id);
			dbUser.guilds.splice(index, 1);
			await this.db.saveEntity(dbUser, DatabaseEntities.User);
		}
	}

	private async userJoin(guild: eris.Guild, member: eris.Member){
		const dbUser = await this.db.getOrCreateUser(member);
		const dbGuild = await this.db.getOrCreateGuild(guild);

		if (!dbGuild.userList.find((x) => x.id === dbUser.id)){
			dbGuild.userList.push(dbUser);
			await this.db.saveEntity(dbGuild, DatabaseEntities.Guild);
		}
		if (!dbUser.guilds.find((x) => x.id === dbGuild.id)){
			dbUser.guilds.push(dbGuild);
			await this.db.saveEntity(dbUser, DatabaseEntities.User);
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
}

export {
	ExperienceHandler,
};
