import { CommandModule } from "../../types";

const moduleName: string = "Other";
const permissions: string[] = [];

const commandModule = new CommandModule(
	moduleName,
	permissions,
	__dirname,
);

export default commandModule;