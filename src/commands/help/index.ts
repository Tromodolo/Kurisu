import KurisuModule from "../../models/CommandModule";

import Help from "./help";
import Info from "./info";
import Invite from "./invite";

export default new KurisuModule (
	"❓ Help",
	[],
	[
		Help,
		Info,
		Invite,
	],
);