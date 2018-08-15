var exports = module.exports = {};

const Sequelize = require("sequelize");
const config = require("./config.json");

const sequelize = new Sequelize(config.databaseName, config.databaseUsername, config.databasePassword, {
	host: config.databaseHost,
	dialect: config.databaseType,
	operatorsAliases: false,

	pool: {
		max: 20,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	define:{
		timestamps: false,
		freezeTableName: true,
		charset: "utf8mb4",
		collate: "utf8mb4_bin"
	},
	// disable logging; default: console.log enable if need be
	logging: false
});

const AssignRoles = sequelize.define("assignroles", {
	roleid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	emotename: {
		type: Sequelize.STRING
	},
	emoteid: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING(2000)
	}
});

const ColourRoles = sequelize.define("colourroles", {
	roleid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	emotename: {
		type: Sequelize.STRING
	},
	emoteid: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING(2000)
	}
});

const UserLevels = sequelize.define("userlevels", {
	userid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	username: {
		type: Sequelize.STRING
	},
	discriminator: {
		type: Sequelize.STRING
	},
	totalxp: {
		type: Sequelize.INTEGER
	},
	currentxp: {
		type: Sequelize.INTEGER
	},
	level: {
		type: Sequelize.INTEGER
	}
});

const GuildScores = sequelize.define("guildscores", {
	userid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	guildid: {
		type: Sequelize.STRING,
	},
	score: {
		type: Sequelize.INTEGER
	}
})

const ProfileData = sequelize.define("profiledata", {
	userid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	username: {
		type: Sequelize.STRING
	},
	discriminator: {
		type: Sequelize.STRING
	},
	avatarurl: {
		type: Sequelize.STRING
	},
	profiledescription:{
		type: Sequelize.STRING(2000),
		defaultValue: "I haven't changed this"
	},
	profilecodename:{
		type: Sequelize.STRING,
		defaultValue: "Unknown"
    },
    guildjoindate: {
        type: Sequelize.STRING
    },
    countfromdate: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "2018-04-24T12:27:46.497Z"
    },
    messagessent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    userpageviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },	
	primarycolour: {
		type: Sequelize.STRING,
		allowNull: false 
	},
	secondarycolour: {
		type: Sequelize.STRING,
		allowNull: false
	},
	countrycode: {
		type: Sequelize.STRING,
		defaultValue: null
	},
	money: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false
	}
});

//This one really isn't needed if you're somehow self-hosting this.
const Config = sequelize.define("config", {
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	reactionmessageid: {
		type: Sequelize.STRING,
		allowNull: false
	},
	colorreactionid: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

const CustomCommands = sequelize.define("customcommands",{

	commandname:{
		type: Sequelize.STRING
	},
	commandtext: {
		type: Sequelize.STRING(2000)
	},
	guildid: {
		type: Sequelize.STRING
	},
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false
	}
});

GuildScores.sync();

exports.sequelize = sequelize;
exports.AssignRoles = AssignRoles;
exports.ColourRoles = ColourRoles;
exports.Config = Config;
exports.UserLevels = UserLevels;
exports.GuildScores = GuildScores;
exports.ProfileData = ProfileData;
exports.CustomCommands = CustomCommands;