import fs from "fs";
import path, { dirname } from "path";
import { Command, CommandModule } from "../../types";

class Module extends CommandModule{
	public name: string = "Test";
	public commands: Command[] = [];
	public permissions: string[] = [];

	constructor(){
		super();
		fs.readdir(path.join(__dirname, "./"), (folderErr, files) => {
			for (const file of files){
				if (!(file === "index.ts")){
					const command: Command = require(path.join(__dirname, `/${file}`));
					this.commands.push(command);
				}
			}
		});
	}
}

export {
	Module,
};