var exports = module.exports = {};

const Sequelize = require('sequelize');

const sequelize = new Sequelize('kurisu', 'tromodolo', 'Mitsuka123', {
    host: 'tromo.me',
    dialect: 'mysql',
    operatorsAliases: false,
  
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define:{
        timestamps: false,
        freezeTableName: true
    },
    
     // disable logging; default: console.log enable if need be
    logging: false
});

const AssignRoles = sequelize.define('assignroles', {
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

const UserLevels = sequelize.define('userlevels', {
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

const Config = sequelize.define('config', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    reactionmessageid: {
        type: Sequelize.STRING
    }
});

const CustomCommands = sequelize.define('customcommands',{
    commandname:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    commandtext: {
        type: Sequelize.STRING(2000)
    }
});

exports.sequelize = sequelize;
exports.AssignRoles = AssignRoles;
exports.Config = Config;
exports.UserLevels = UserLevels;
exports.CustomCommands = CustomCommands;
