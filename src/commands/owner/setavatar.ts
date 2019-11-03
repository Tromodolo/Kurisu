import axios from "axios";
import { Message } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default class SetAvatar extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "setavatar",
			description: "Sets the avatar of the bot",
			usage: "setavatar {url}",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			if (args.length < 1){
				message.channel.createMessage("You need to specify a url");
			}
			else{
				axios.get(args[0], {
				  responseType: "arraybuffer",
				})
				.then((response) => {
					const buffer = Buffer.from(response.data, "utf8");
					const avatarBase = "data:image/png;base64," + buffer.toString("base64");
					this.bot.client.editSelf({ avatar: avatarBase });
				});
			}
			return resolve();
		});
	}
}