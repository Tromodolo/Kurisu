import { Message } from "eris";
import { Bot } from "../../bot";
import { DatabaseEntities } from "../../handlers/DatabaseHandler";
import Command from "../../models/Command";

export default class SetDescription extends Command {
	constructor(){
		super();
		this.commandName = "description";
		this.aliases = [];
		this.description = "Updates your profile description";
		this.fullDescription = "Updates your profile description";
		this.usage = "description {message}";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
		return new Promise(async (resolve) => {
			if (args.length < 1){
				await message.channel.createMessage("You need to specify a description message.");
				return resolve();
			}
			if (args.join(" ").length > 256){
				await message.channel.createMessage("That message is too long. The maximum description length is 256 characters");
				return resolve();
			}
			const dbUser = await bot.db.getOrCreateUser(message.member!);
			dbUser.profile.description = args.join(" ");
			dbUser.profile.lastUpdated = new Date();
			await bot.db.saveEntity(dbUser, DatabaseEntities.User);
			await message.channel.createMessage(":white_check_mark: Successfully updated profile description!");
			return resolve();
		});
	}
}