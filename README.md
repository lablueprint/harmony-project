# Development Setup

## Installation

```
git clone https://github.com/lablueprint/harmony-project
cd harmony-project
npm install --save
```

## To Run:
Android:
```
npm run android
```
iOS:
```
npm run ios
```

## ESLint

By default, the linter will indicate what errors are present before you can commit.

If you wish to run the linter on a specific file, use ```npx eslint [file/directory]``` to invoke it.

For more information, visit: https://eslint.org/docs/user-guide/getting-started

### Automatically lint your code with ESLint on VS Code

To more productively comply with our ESLint rules, we can underline the problem areas and enable autoformatting on save.

Install the ESLint plugin: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Then add the following to your ```.vscode/settings.json``` (create it if it doesn't exist):

```json
{
  "javascript.format.enable": false,
  "eslint.autoFixOnSave": true,
  "eslint.run": "onSave",
  "files.eol": "\n"
}
```

### Block commiting changes that do not comply with our ESLint rules

Add a git pre-commit hook to your ```.git/hooks``` folder. Ask Leo for the file.
