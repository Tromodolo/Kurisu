/**
 * database.ts
 * File full of helper functions for interacting witht the database
 */

import { Sequelize } from 'sequelize-typescript';

import { databaseConfig } from "../config/";

const db =  new Sequelize({
	database: databaseConfig.databaseName,
	host: databaseConfig.databaseHost,
	dialect: databaseConfig.databaseType,
	username: databaseConfig.databaseUsername,
	password: databaseConfig.databasePassword,
	pool: {
		max: 20,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	define: {
		timestamps: false,
		freezeTableName: true,
		charset: "utf8mb4",
		collate: "utf8mb4_bin",
	},
	modelPaths: [
	  __dirname + '/models',
	],
	logging: false,
});

/**
 * Creates a object from a mysql result
 *
 * @param result mysql results object
 * @param fields mysql fields object
 * @returns an object containing all the sql results
 */
function createJSON(result: any, fields: any){
	if (result && fields){
		const rows = result[0].length;
		const cols = fields[0].length;
		const json: any = [];

		for (let i: number = 0; i <= rows; i++){
			json[i] = [];
			if (i === 0){
				for (let j: number = 0; j < cols; j++){
					const name = fields[0][j].name;
					json[i][j] = name;
				}
			}else{
				for (let j: number = 0; j < cols; j++){
					const name = fields[0][j].name;
					json[i][j] = result[0][i - 1][name];
				}
			}
		}
		return json;
	}
	return null;
}

let synced = false;

function initializeDb(): Promise<any>{
	return new Promise((resolve, reject) => {
		if (synced === true){
			synced = true;
			db.sync().then(() => {
				resolve();
			}).catch((err) => {
				reject(err);
			});
		}
		else{
			resolve();
		}
	});
}

function getBotSettings(): Promise<any>{
	return new Promise(async (resolve) => {
		const config = await db.models.BotConfig.findOne({
			where: {
				id: 1,
			},
			raw: true,
		});
		resolve(config);
		return config;
	});
}

export {
	initializeDb,
	getBotSettings,
	db,
	createJSON,
};