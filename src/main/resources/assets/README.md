# Local development

* NodeJS
* ReactJS

```
// Install the JSX compiler
npm init -y
npm install babel-cli@6 babel-preset-react-app@3

// Run the compiler
npx babel --watch src --out-dir scripts --preset react-app/prod
```