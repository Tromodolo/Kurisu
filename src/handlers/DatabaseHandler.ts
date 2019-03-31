import config from "../config";
import { User } from "../database/models/User";
import { ConnectionManager, Connection } from "typeorm";

export default class DatabaseHandler{
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
			type: "mysql",
			username: config.db.databaseUsername,
			password: config.db.databasePassword,
			entities: [User],
		});
		this.connection = this.connectionManager.get(config.db.databaseName);
	}

	private async init(){
		await this.connection.connect();
	}
}