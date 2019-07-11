import "reflect-metadata";

import config from "../config";
import eris from "eris";
import { User } from "../database/models/User";
import { ConnectionManager, Connection, Repository } from "typeorm";
import { UserLevel } from "../database/models/UserLevel";
import { Guild } from "../database/models/Guild";
import { GuildConfig } from "../database/models/GuildConfig";
import { UserProfile } from "../database/models/UserProfile";
import { UserAchievement } from "../database/models/UserAchievement";
import { Achievement } from "../database/models/Achievement";

/**
 * Creates a new DatabaseHandler based off of config file
 *
 * @class DatabaseHandler
 * @classdesc Handles database connections
 * @constructor Creates a connecton with connectionManager and saves it to connection.
 *
 * @function
 *
 * @prop {ConnectionManager} connectionManager Manages a connection to a database
 * @prop {Connection} connection Connection to a specific connection
 */
class DatabaseHandler{
	public guildRepo!: Repository<Guild>;
	public userRepo!: Repository<User>;
	public achievementRepo!: Repository<Achievement>;

	private connectionManager: ConnectionManager;
	private _connection: Connection;

	public get connection(){
		return this._connection;
	}

	constructor(){
		this.connectionManager = new ConnectionManager();
		this.connectionManager.create({
			host: config.db.databaseHost,
			name: config.db.databaseName,
			database: config.db.databaseName,
			type: "mysql",
			username: config.db.databaseUsername,
			password: config.db.databasePassword,
			entities: [
				User,
				UserLevel,
				UserProfile,
				Guild,
				GuildConfig,
				UserAchievement,
				Achievement,
			],
			cache: {
				duration: 5000,
			},
		});
		this._connection = this.connectionManager.get(config.db.databaseName);
	}

	public async init(){
		await this._connection.connect();
		await this._connection.synchronize();

		this.guildRepo = this._connection.getRepository(Guild);
		this.userRepo = this._connection.getRepository(User);
		this.achievementRepo = this._connection.getRepository(Achievement);
	}

	public async getOrCreateGuild(guild: eris.Guild): Promise<Guild>{
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

	public async getOrCreateUser(member: eris.Member): Promise<User>{
		let user = await this.userRepo.findOne({
			where: {
				id: member.id,
			},
		});
		if (!user){
			user = new User();
			user.id = member.id;
			user.guilds = [];
			user.experience.total = 0;
		}
		else{
			user = user.checkForMissing();
		}
		await this.userRepo.save(user);
		return user;
	}

	public async saveEntity(data: any, type: DatabaseEntities){
		const repo = this._connection.getRepository(type);
		await repo.save(data);
	}
}

enum DatabaseEntities{
	User = "User",
	Guild = "Guild",
	GuildConfig = "GuildConfig",
	UserLevel = "UserLevel",
	UserProfile = "UserProfile",
}

export {
	DatabaseHandler,
	DatabaseEntities,
};
