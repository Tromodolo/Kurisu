import { Message } from "eris";
import { Bot } from "../../bot";
import { DatabaseEntities } from "../../handlers/DatabaseHandler";
import KurisuCommand from "../../models/Command";

export default class SetTitle extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "title",
			description: "Updates your profile title",
			usage: "title {title}",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1){
				return reject({title: "Could not update title", message: "You need to specify a title."});
			}
			if (args.join(" ").length > 32){
				return reject({title: "Could not update title", message: "That message is too long. The maximum title length is 32 characters"});
			}
			const dbUser = await this.bot.db.getOrCreateUser(message.member!);
			dbUser.profile.title = args.join(" ");
			dbUser.profile.lastUpdated = new Date();
			await this.bot.db.saveEntity(dbUser, DatabaseEntities.User);
			await message.channel.createMessage(":white_check_mark: Successfully updated profile title!");
			return resolve();
		});
	}
}
