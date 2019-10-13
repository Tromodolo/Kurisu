import eris from "eris";
import { DatabaseHandler, DatabaseEntities } from "./DatabaseHandler";
import { Bot } from "../bot";

export class GuildEventHandler {
	private bot: Bot;

	constructor(){
		this.userLeft = this.userLeft.bind(this);
		this.userJoin = this.userJoin.bind(this);
	}

	initialize(bot: Bot){
		this.bot = bot;
	}

	public hookEvent(){
		this.bot.client.on("guildMemberRemove", this.userLeft);
		this.bot.client.on("guildMemberAdd", this.userJoin);
	}

	public unhookEvent(){
		this.bot.client.off("guildMemberRemove", this.userLeft);
		this.bot.client.off("guildMemberAdd", this.userJoin);
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
	}
}