module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
    },
    settings: {
        'html/html-extensions': ['.html', '.vue'],
        'html/indent': '+2',
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "layui": true,
        "layer": true,
        "$": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};
