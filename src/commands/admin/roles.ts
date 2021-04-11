import { Message, TextChannel, TextableChannel, Role, Guild } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import ResponseListener from "../../handlers/ResponseListener";
import { getRoleByName } from "../../utility/Util";
import { GuildRoleMenu } from "../../database/models/GuildRoleMenu";
import { GuildRole } from "../../database/models/GuildRole";
import { Guild as DbGuild } from "../../database/models/Guild";

export default new KurisuCommand (
	{
		name: "roles",
		description: "Update or create menus for role pickers",
		usage: "roles {list | create | view | delete}",
		aliases: [],
		requirements: ["manageRoles"],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (!(message.channel as TextChannel).guild){
				return reject("You can only run this command in a server.");
			}
			const dbGuild = await bot.db.getOrCreateGuild((message.channel as TextChannel).guild, ["roleMenus", "roleMenus.roles"]);

			switch (args[0]?.toLowerCase()){
				case "list":
					if (dbGuild?.roleMenus?.length > 0){
						let menus = "";
						for (const menu of dbGuild?.roleMenus){
							menus += `
- **${menu.menuName}** (${menu.roles?.length ?? 0} roles) `;
						}
						await sendEmbed(message.channel, "List of available role menus", menus, bot);
					}
					else {
						await sendEmbed(message.channel, "List of available role menus", "*No role menu configurations found*", bot);
					}
					break;
				case "delete":
					try{
						await deleteMenu(message, dbGuild, bot);
					}
					catch (e){
						return reject(e.message);
					}
					break;
				case "create":
					try{
						await createMenu(message, dbGuild, bot);
					}
					catch (e){
						return reject(e.message);
					}
					break;
				case "view":
					try{
						await viewMenu(message, dbGuild, bot);
					}
					catch (e){
						return reject(e.message);
					}
					break;
				default:
					return reject("The only valid options are 'list', 'view', 'delete' and 'create'");
			}
			return resolve(null);
		});
	},
);

async function sendEmbed(channel: TextableChannel, title: string, message: string, bot: Bot){
	const embed = new DiscordEmbed();
	embed.setColor(parseInt(bot.cnf.bot.color));
	embed.setTitle(title);
	embed.setDescription(message);
	return await channel.createMessage(embed.getEmbed());
}

async function createMenu(message: Message, dbGuild: DbGuild, bot: Bot){
	let menuName = "";
	let roles: Array<{role: Role, emoji: string}> = [];
	const guildRoles = (message.channel as TextChannel).guild.roles.map((x) => x);

	sendEmbed(message.channel, "Enter name", "Enter name of new menu you want to create, or 'cancel' to cancel", bot);

	let menuResponse: Message;
	try{
		menuResponse = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
	}
	catch (e) {
		throw new Error("Menu timed out. Please try again.");
	}
	menuName = menuResponse.content;

	sendEmbed(message.channel, "Enter role", "Enter role picker emoji and name separated by `;`, or 'cancel' to cancel menu", bot);

	let enteringRoles = true;
	while(enteringRoles){
		let roleResponse: Message;
		try{
			roleResponse = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
		}
		catch (e) {
			throw new Error("Menu timed out. Please try again.");
		}
		if (roleResponse.content.length > 1){
			if (roleResponse.content.toLowerCase() === 'cancel'){
				enteringRoles = false;
				break;
			}

			const respArgs = roleResponse.content.split(";");
			if (respArgs.length < 2){
				sendEmbed(message.channel, "Error", "Not enough arguments, please try again.", bot);
			}
			else {
				const role = getRoleByName(guildRoles, respArgs[1]);
				if (!role){
					sendEmbed(message.channel, "Error", "Role not found, please try again.", bot);
				}
				else{
					sendEmbed(message.channel, "Added", ":white_check_mark: Successfully added role, enter a new one, or 'cancel' to stop", bot);
					roles.push({role, emoji: respArgs[0].replace(/\s/, "")});
				}
			}
		}
	};

	if (guildRoles.length < 1){
		sendEmbed(message.channel, "Canceled", "Creating menu was canceled", bot);
	}
	else{
		const menu = new GuildRoleMenu();
		menu.guild = dbGuild;
		menu.menuName = menuName;
		menu.roles = roles.map((x) => {
			const role = new GuildRole();
			role.emoji = x.emoji;
			role.roleId = x.role.id;
			role.roleName = x.role.name;
			role.menu = menu;
			return role;
		});

		dbGuild.roleMenus.push(menu);
		bot.db.guildRepo.save(dbGuild);
	}
}

async function viewMenu(message: Message, dbGuild: DbGuild, bot: Bot){
	sendEmbed(message.channel, "Enter name", "Enter name of new menu you want to view, or 'cancel' to cancel", bot);
	let viewRes: Message;
	try{
		viewRes = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
	}
	catch (e) {
		throw new Error("Menu timed out. Please try again.");
	}

	if (viewRes.content === "cancel"){
		return;
	}

	const foundIndex = dbGuild.roleMenus.findIndex((x) => x.menuName.toLowerCase() === viewRes.content.toLowerCase());
	if (foundIndex < 0){
		sendEmbed(message.channel, "Error", "No menu with that name found, please try again", bot);
		return;
	}
	const embed = new DiscordEmbed();
	embed.setColor(parseInt(bot.cnf.bot.color));
	embed.setTitle(dbGuild.roleMenus[foundIndex].menuName);
	embed.setDescription(`
*React with emoji to earn role.*

${dbGuild.roleMenus[foundIndex].roles.map((x) => `${x.emoji} - ${x.roleName}`).join(",\n")}`);
	const viewMessage = await message.channel.createMessage(embed.getEmbed());

	dbGuild.roleMenus[foundIndex].activeMessageId = viewMessage.id;
	bot.db.guildRepo.save(dbGuild);
}

async function deleteMenu(message: Message, dbGuild: DbGuild, bot: Bot){
	sendEmbed(message.channel, "Enter name", "Enter name of new menu you want to delete, or 'cancel' to cancel", bot);
	let deleteRes: Message;
	try{
		deleteRes = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
	}
	catch (e) {
		throw new Error("Menu timed out. Please try again.");
	}
	if (deleteRes.content === "cancel"){
		return;
	}
	const ind = dbGuild.roleMenus.findIndex((x) => x.menuName.toLowerCase() === deleteRes.content.toLowerCase());
	if (ind < 0){
		sendEmbed(message.channel, "Error", "No menu with that name found, please try again", bot);
		return;
	}
	dbGuild.roleMenus.splice(ind, 1);
	bot.db.guildRepo.save(dbGuild);
	sendEmbed(message.channel, "Success", "Successfully deleted menu", bot);
}
