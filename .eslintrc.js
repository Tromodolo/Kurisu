module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8        
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
		],
		"no-console": 0,
		"no-unused-vars": [
			"error", {
				 "vars": "all",
				 "args": "none",
				 "ignoreRestSiblings": false 
				}
		]		
	}
};