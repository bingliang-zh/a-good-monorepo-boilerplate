# A Good Monorepo Boilerplate

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://github.com/storybookjs/storybook)

A monorepo boilerplate with a good work-flow, featuring [typescript](https://github.com/microsoft/TypeScript), [lerna](https://github.com/lerna/lerna), [yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/), [create-react-app](https://github.com/facebook/create-react-app), [tsdx](https://github.com/formium/tsdx), [eslint](https://github.com/eslint/eslint), [prettier](https://github.com/prettier/prettier), [storybook](https://github.com/storybookjs/storybook), etc.

## Build Process

This chapter describes how you can manually build a monorepo like this. You can review the git commit log for more details too. 

I'm using yarn@1.22.5, typescript (no javascript here).

### Lerna

```shell
mkdir my-mono-repo
cd my-mono-repo
npx lerna init
```

Lerna's default mode 'Fixed/Locked mode' seems good to me. More custom settings, go to [here](https://github.com/lerna/lerna#getting-started).

### CRA (Create-React-App) & TSDX

To see the differences yarn workspace made, I'll set up cra and tsdx ahead of yarn workspace.

```shell
# CRA (Create-React-App)
cd packages
npx create-react-app app-template-cra --template typescript
cd app-template-cra
yarn start
```

If nothing went wrong, you'll see a React App page. Try `yarn test` to see whether test is working.

```shell
# TSDX with template "basic"
cd packages
npx tsdx create lib-template-tsdx --template basic
cd lib-template-tsdx
yarn start
```

```shell
# TSDX with template "react-with-storybook"
cd packages
npx tsdx create lib-template-tsdx-react-sb --template react-with-storybook
cd lib-template-tsdx-react-sb
yarn start
```

Tsdx offers three templates: basic, react, react-with-storybook. "Basic" is good for utility libraries, "react" & "react-with-storybook" is good for component libraries. You can skip the `--template` flag and select later.

After installation succeed, try `yarn start`, `yarn test`, `yarn storybook`(react-with-storybook only) in these packages.

### yarn workspace

You can see in chapter "CRA (Create-React-App) & TSDX", all dependencies each package need are installed locally in ./packages/package-name/node_modules. And they just don't know the siblings exist (I mean they cannot refer to each other, for now).

Here comes the "yarn workspace". It will significantly improve the development work-flow by doing some "magic".

Add `"npmClient": "yarn"` and `"useWorkspaces": true` to "lerna.json".

Your "./lerna.json" should look like this.

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

Add `"workspaces": ["packages/*"]` to root "package.json".

Your "./package.json" should look like this.

```json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^3.22.1"
  },
  "workspaces": [
    "packages/*"
  ]
}
```

Apply these configurations by command `yarn` in root folder.

```shell
# run at root folder
yarn
```

After execution, a new "node_modules" folder showed up in root, and all packages' "node_modules"'s disk usage and sub folder numbers are both significantly reduced. Whole repo's disk usage reduced from about 930 MB to 600 MB.

### TODO

