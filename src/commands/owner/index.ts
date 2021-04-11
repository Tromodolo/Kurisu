import KurisuModule from "../../models/CommandModule";

import Eval from "./eval";
import Restart from "./restart";
import SetAvatar from "./setavatar";
import SetName from "./setname";
import Stop from "./stop";
import Update from "./update";

export default new KurisuModule (
	"Owner",
	[],
	[
		Eval,
		Restart,
		SetAvatar,
		SetName,
		Stop,
		Update,
	],
);
