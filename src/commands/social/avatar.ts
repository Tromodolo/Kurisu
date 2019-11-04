/**
 * avatar.ts
 *
 * Gets avatar of another user
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message, GuildChannel } from "eris";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage, getPrimaryColorFromImageUrl } from "../../utility/Util";

import { Bot } from "../../bot";

export default class Avatar extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "avatar",
			description: "Gets avatar for user/server, or your own if unspecified",
			usage: "avatar {user}",
			aliases: ["ava", "pfp", "proflepicture"],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			embed.setTimestamp(new Date());

			if (args[0]?.toLowerCase() === "server"){
				embed.setTitle(`Server Icon for ${(message.channel as GuildChannel).guild.name}`);

				let avatar = ((message.channel as GuildChannel).guild.iconURL ?? "").replace("jpg", "png");

				const color = await getPrimaryColorFromImageUrl(avatar.replace(".gif", ".png"));
				embed.setColor(color);

				avatar = avatar.replace("?size=128", "?size=1024");

				embed.setUrl(avatar);
				embed.setImage(avatar);
			}
			else{
				if (!user) {
					return "User not found";
				}

				embed.setTitle(`Avatar for ${user.username}#${user.discriminator}`);

				let userAvatar = user.avatarURL.replace("jpg", "png");
				userAvatar = userAvatar.replace("?size=128", "?size=1024");

				const color = await getPrimaryColorFromImageUrl(userAvatar.replace(".gif", ".png"));
				embed.setColor(color);

				embed.setUrl(userAvatar);
				embed.setImage(userAvatar);
			}

			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}
