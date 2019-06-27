import CommandModule from "../../models/CommandModule";

const moduleName: string = "Profile";
const permissions: string[] = [];

const commandModule = new CommandModule(
	moduleName,
	permissions,
	__dirname,
);

export default commandModule;