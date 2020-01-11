import { Message, TextChannel, TextableChannel, Role, Guild } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import ResponseListener from "../../handlers/ResponseListener";
import { getRoleByName } from "../../utility/Util";
import { GuildRoleMenu } from "../../database/models/GuildRoleMenu";
import { GuildRole } from "../../database/models/GuildRole";
import { Guild as DbGuild } from "../../database/models/Guild";

export default class Roles extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "roles",
			description: "Update or create menus for role pickers",
			usage: "roles {list | create | view | delete}",
			aliases: [],
			requirements: ["manageRoles"],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (!(message.channel as TextChannel).guild){
				return reject("You can only run this command in a server.");
			}
			const dbGuild = await this.bot.db.getOrCreateGuild((message.channel as TextChannel).guild, ["roleMenus", "roleMenus.roles"]);

			switch (args[0]?.toLowerCase()){
				case "list":
					if (dbGuild?.roleMenus?.length > 0){
						let menus = "";
						for (const menu of dbGuild?.roleMenus){
							menus += `
- **${menu.menuName}** (${menu.roles?.length ?? 0} roles) `;
						}
						await this.sendEmbed(message.channel, "List of available role menus", menus);
					}
					else {
						await this.sendEmbed(message.channel, "List of available role menus", "*No role menu configurations found*");
					}
					break;
				case "delete":
					await this.deleteMenu(message, dbGuild);
					break;
				case "create":
					await this.createMenu(message, dbGuild);
					break;
				case "view":
					await this.viewMenu(message, dbGuild);
					break;
				default:
					return reject("The only valid options are 'list', 'view', 'delete' and 'create'");
			}
			return resolve();
		});
	}

	private async sendEmbed(channel: TextableChannel, title: string, message: string){
		const embed = new DiscordEmbed();
		embed.setColor(parseInt(this.bot.cnf.bot.color));
		embed.setTitle(title);
		embed.setDescription(message);
		return await channel.createMessage(embed.getEmbed());
	}

	private async createMenu(message: Message, dbGuild: DbGuild){
		let menuName = "";
		let roles: Array<{role: Role, emoji: string}> = [];
		const guildRoles = (message.channel as TextChannel).guild.roles.map((x) => x);

		this.sendEmbed(message.channel, "Enter name", "Enter name of new menu you want to create, or 'cancel' to cancel");

		const menuResponse = await ResponseListener.waitForMessage(this.bot.client, message.author.id);
		menuName = menuResponse.content;

		this.sendEmbed(message.channel, "Enter role", "Enter role picker emoji and name separated by `;`, or 'cancel' to cancel menu");

		let enteringRoles = true;
		while(enteringRoles){
			const roleResponse = await ResponseListener.waitForMessage(this.bot.client, message.author.id);
			if (roleResponse.content.length > 1){
				if (roleResponse.content.toLowerCase() === 'cancel'){
					enteringRoles = false;
					break;
				}

				const respArgs = roleResponse.content.split(";");
				if (respArgs.length < 2){
					this.sendEmbed(message.channel, "Error", "Not enough arguments, please try again.");
				}
				else {
					const role = getRoleByName(guildRoles, respArgs[1]);
					if (!role){
						this.sendEmbed(message.channel, "Error", "Role not found, please try again.");
					}
					else{
						this.sendEmbed(message.channel, "Added", ":white_check_mark: Successfully added role, enter a new one, or 'cancel' to stop");
						roles.push({role, emoji: respArgs[0].replace(/\s/, "")});
					}
				}
			}
		};

		if (guildRoles.length < 1){
			this.sendEmbed(message.channel, "Canceled", "Creating menu was canceled");
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
			this.bot.db.guildRepo.save(dbGuild);
		}
	}

	private async viewMenu(message: Message, dbGuild: DbGuild){
		this.sendEmbed(message.channel, "Enter name", "Enter name of new menu you want to view, or 'cancel' to cancel");
		const viewRes = await ResponseListener.waitForMessage(this.bot.client, message.author.id, 60 * 1000);
		if (viewRes.content === "cancel"){
			return;
		}

		const foundIndex = dbGuild.roleMenus.findIndex((x) => x.menuName.toLowerCase() === viewRes.content.toLowerCase());
		if (foundIndex < 0){
			this.sendEmbed(message.channel, "Error", "No menu with that name found, please try again");
			return;
		}
		const embed = new DiscordEmbed();
		embed.setColor(parseInt(this.bot.cnf.bot.color));
		embed.setTitle(dbGuild.roleMenus[foundIndex].menuName);
		embed.setDescription(`
*React with emoji to earn role.*

${dbGuild.roleMenus[foundIndex].roles.map((x) => `${x.emoji} - ${x.roleName}`).join(",\n")}`);
		const viewMessage = await message.channel.createMessage(embed.getEmbed());

		/* for (const role of dbGuild.roleMenus[foundIndex].roles){
			try{
				await viewMessage.addReaction(role.emoji);
			} catch { continue; }
		} */

		dbGuild.roleMenus[foundIndex].activeMessageId = viewMessage.id;
		this.bot.db.guildRepo.save(dbGuild);
	}

	private async deleteMenu(message: Message, dbGuild: DbGuild){
		this.sendEmbed(message.channel, "Enter name", "Enter name of new menu you want to delete, or 'cancel' to cancel");
		const deleteRes = await ResponseListener.waitForMessage(this.bot.client, message.author.id, 60 * 1000);
		if (deleteRes.content === "cancel"){
			return;
		}
		const ind = dbGuild.roleMenus.findIndex((x) => x.menuName.toLowerCase() === deleteRes.content.toLowerCase());
		if (ind < 0){
			this.sendEmbed(message.channel, "Error", "No menu with that name found, please try again");
			return;
		}
		dbGuild.roleMenus.splice(ind, 1);
		this.bot.db.guildRepo.save(dbGuild);
		this.sendEmbed(message.channel, "Success", "Successfully deleted menu");
	}
}
