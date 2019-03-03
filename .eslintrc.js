module.exports = {
    "plugins": [
        "react"
    ],
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "mocha": true,
        "jquery": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "react/prop-types": 0
    }
}