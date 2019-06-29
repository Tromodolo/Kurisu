import { Message } from "eris";
import Command from "../../models/Command";
import { DatabaseHandler } from "../../handlers";
import { DatabaseEntities } from "../../handlers/DatabaseHandler";

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

	public commandFunc(message: Message, args: string[], db: DatabaseHandler) {
		return new Promise(async (resolve) => {
			if (args.length < 1){
				await message.channel.createMessage("You need to specify a description message.");
				return resolve();
			}
			if (args.join(" ").length > 256){
				await message.channel.createMessage("That message is too long. The maximum description length is 256 characters");
				return resolve();
			}
			const dbUser = await db.getOrCreateUser(message.member!);
			dbUser.profile.description = args.join(" ");
			dbUser.profile.lastUpdated = new Date();
			await db.saveEntity(dbUser, DatabaseEntities.User);
			await message.channel.createMessage(":white_check_mark: Successfully updated profile description!");
			return resolve();
		});
	}
}

// 50 * x ^ 2 = Y
// x ^ 2 = Y / 50
function getLevelFromExp(exp: number){
	return Math.floor(Math.sqrt(exp / 50)) + 1;
}
