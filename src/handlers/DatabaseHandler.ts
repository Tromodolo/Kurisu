import "reflect-metadata";

import config from "../config";
import { User } from "../database/models/User";
import { ConnectionManager, Connection } from "typeorm";
import { UserLevel } from "../database/models/UserLevel";
import { Guild } from "../database/models/Guild";
import { GuildConfig } from "../database/models/GuildConfig";

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
				Guild,
				GuildConfig,
			],
		});
		this._connection = this.connectionManager.get(config.db.databaseName);
	}

	public async init(){
		await this._connection.connect();
		await this._connection.synchronize();
	}
}

export {
	DatabaseHandler,
};
