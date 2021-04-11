import KurisuModule from "../../models/CommandModule";

import Ban from "./ban";
import Kick from "./kick";
import Prune from "./prune";
import Roles from "./roles";
import Settings from "./settings";

export default new KurisuModule (
	"Admin",
	[],
	[
		Ban,
		Kick,
		Prune,
		Roles,
		Settings,
	],
);
