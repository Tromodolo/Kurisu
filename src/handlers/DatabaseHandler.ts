import config from "../config";
import { User } from "../database/models/User";
import { ConnectionManager, Connection } from "typeorm";

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
	private connection: Connection;

	public get db(){
		return this.connection;
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
			entities: [User],
		});
		this.connection = this.connectionManager.get(config.db.databaseName);
	}

	public async init(){
		await this.connection.connect();
		await this.connection.synchronize();

	}
}

export {
	DatabaseHandler
}
