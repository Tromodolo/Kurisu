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
						break;
					}
					else {
						await sendEmbed(message.channel, "List of available role menus", "*No role menu configurations found*", bot);
						break;
					}
				case "delete":
					try{
						await deleteMenu(message, dbGuild, bot);
						break;
					} catch (e){
						return reject(e.message);
					}
				case "create":
					try{
						await createMenu(message, dbGuild, bot);
						break;
					} catch (e){
						return reject(e.message);
					}
				case "view":
					try{
						await viewMenu(message, dbGuild, bot);
						break;
					} catch (e){
						return reject(e.message);
					}
				case "edit":
					try {
						await editMenu(message, dbGuild, bot);
						break;
					} catch (e) {
						return reject(e.message);
					}
				default:
					return reject("The only valid options are 'list', 'view', 'delete', 'create', and 'edit'");
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
		try {
			roleResponse = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
		} catch (e) {
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

async function editMenu(message: Message, dbGuild: DbGuild, bot: Bot){
	sendEmbed(message.channel, "Enter name", `
Available menus:
${dbGuild.roleMenus.map((x) => `**${x.menuName}**`).join(", ")}
Enter name of new menu you want to edit, or 'cancel' to cancel
`, bot);
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
	let roles = "";
	let roleIndex = 0;
	for (const role of dbGuild.roleMenus[ind].roles){
		roles += `
** ${roleIndex + 1}.** ${role.emoji}  (${role.roleName})
`;
		roleIndex++;
	}
	await sendEmbed(message.channel, "Enter role number to edit", roles, bot);

	let roleNumRes: Message;
	try {
		roleNumRes = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
	} catch (e) {
		throw new Error("Menu timed out. Please try again.");
	}

	if (isNaN(Number(roleNumRes.content)) || Number(roleNumRes.content) > dbGuild.roleMenus[ind].roles.length) {
		throw new Error("Sorry, that is not a valid number, please try again.");
	}

	await sendEmbed(message.channel, "Update role", `
Enter emoji and then role name. 
**Example: \`❤️ Meat Lover\`**`, bot);

	let updatedRoleRes: Message;
	try {
		updatedRoleRes = await ResponseListener.waitForMessage(bot.client, message.channel, message.author.id, 60 * 1000);
	} catch (e) {
		throw new Error("Menu timed out. Please try again.");
	}

	const guildRoles = (message.channel as TextChannel).guild.roles.map((x) => x);
	const roleArgs = updatedRoleRes.content.split(" ");
	if (roleArgs.length < 2) {
		sendEmbed(message.channel, "Error", "Role not found, please try again.", bot);
	}

	const emoji = roleArgs.shift();
	const role = getRoleByName(guildRoles, roleArgs.join(" "));
	if (!role) {
		sendEmbed(message.channel, "Error", "Role not found, please try again.", bot);
	} else {
		sendEmbed(message.channel, "Added", ":white_check_mark: Successfully updated role", bot);

		dbGuild.roleMenus[ind].roles[Number(roleNumRes.content) - 1].emoji = emoji!;
		dbGuild.roleMenus[ind].roles[Number(roleNumRes.content) - 1].roleId = role.id;
		dbGuild.roleMenus[ind].roles[Number(roleNumRes.content) - 1].roleName = role.name;

		bot.db.guildRepo.save(dbGuild);

		await updateMenu(message, dbGuild.roleMenus[ind], dbGuild, bot);
	}
}

async function updateMenu(message: Message, menu: GuildRoleMenu, dbGuild: DbGuild, bot: Bot){
	const embed = new DiscordEmbed();
	embed.setColor(parseInt(bot.cnf.bot.color));
	embed.setTitle(menu.menuName);
	embed.setDescription(`
*React with emoji to earn role.*

${menu.roles.map((x) => `${x.emoji} - ${x.roleName}`).join(",\n")}`);
	const messageId = menu.activeMessageId;
	const channelId = menu.activeChannelId;
	if (channelId && messageId) {
		const oldMsg = await bot.client.getMessage(channelId, messageId);
		await oldMsg.edit(embed.getEmbed());
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
	dbGuild.roleMenus[foundIndex].activeChannelId = viewMessage.channel.id;
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
