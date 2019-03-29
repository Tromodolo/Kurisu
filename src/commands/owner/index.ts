import CommandModule from "../../models/CommandModule";

const moduleName: string = "Owner";
const permissions: string[] = [];

const commandModule = new CommandModule(
	moduleName,
	permissions,
	__dirname,
);

export default commandModule;