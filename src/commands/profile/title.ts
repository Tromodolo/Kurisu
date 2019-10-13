import { Message } from "eris";
import Command from "../../models/Command";
import { DatabaseEntities } from "../../handlers/DatabaseHandler";
import { Bot } from "../../bot";

export default class SetTitle extends Command {
	constructor(){
		super();
		this.commandName = "title";
		this.aliases = [];
		this.description = "Updates your profile ttile";
		this.fullDescription = "Updates your profile title";
		this.usage = "title {title}";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
		return new Promise(async (resolve) => {
			if (args.length < 1){
				await message.channel.createMessage("You need to specify a title.");
				return resolve();
			}
			if (args.join(" ").length > 32){
				await message.channel.createMessage("That message is too long. The maximum title length is 32 characters");
				return resolve();
			}
			const dbUser = await bot.db.getOrCreateUser(message.member!);
			dbUser.profile.title = args.join(" ");
			dbUser.profile.lastUpdated = new Date();
			await bot.db.saveEntity(dbUser, DatabaseEntities.User);
			await message.channel.createMessage(":white_check_mark: Successfully updated profile title!");
			return resolve();
		});
	}
}
