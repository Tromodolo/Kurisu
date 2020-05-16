import { Message } from "eris";
import { Bot } from "../../bot";
import { DatabaseEntities } from "../../handlers/DatabaseHandler";
import KurisuCommand from "../../models/Command";

export default class SetDescription extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "description",
			description: "Updates your profile description",
			usage: "description {message}",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1){
				return reject({title: "Could not update description", message: "You need to specify a description message."});
			}
			if (args.join(" ").length > 256){
				return reject({title: "Could not update description", message: "That message is too long. The maximum description length is 256 characters"});
			}
			const dbUser = await this.bot.db.getOrCreateUser(message.member!);
			dbUser.profile.description = args.join(" ");
			dbUser.profile.lastUpdated = new Date();
			await this.bot.db.saveEntity(dbUser, DatabaseEntities.User);
			await message.channel.createMessage(":white_check_mark: Successfully updated profile description!");
			return resolve();
		});
	}
}