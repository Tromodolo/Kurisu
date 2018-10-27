import fs from "fs";
import path, { dirname } from "path";
import { Command, CommandModule } from "../../types";

const moduleName: string = "Test";
const permissions: string[] = [];

const commandModule = new CommandModule(
	moduleName,
	permissions,
	__dirname,
);

export default commandModule;