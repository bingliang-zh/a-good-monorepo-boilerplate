# A Good Monorepo Boilerplate

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://github.com/storybookjs/storybook)

A monorepo boilerplate with a good workflow, featuring [typescript](https://github.com/microsoft/TypeScript), [react](https://github.com/facebook/react), [lerna](https://github.com/lerna/lerna), [yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/), [create-react-app](https://github.com/facebook/create-react-app), [tsdx](https://github.com/formium/tsdx), [eslint](https://github.com/eslint/eslint), [prettier](https://github.com/prettier/prettier), [storybook](https://github.com/storybookjs/storybook), etc.

## Concept

Keep a clear workflow. Focus on creating reusable and robust codes. Minimalize maintenance. Use best practices.

Some best practices:

- Use webpack for apps, and Rollup for libraries.

Frontend tools have functionality overlaps, which causes chaos. So its preferred to leave specific functionality to and only to a specific tool.

- Language: [typescript](https://github.com/microsoft/TypeScript)
- Framework: [react](https://github.com/facebook/react)
- Module Publishing: [lerna](https://github.com/lerna/lerna)
- Application Development: [yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/)
- Library (Component) Development: [storybook](https://github.com/storybookjs/storybook), [yarn workspace](https://classic.yarnpkg.com/en/docs/workspaces/)
- Application template: [create-react-app](https://github.com/facebook/create-react-app)
- Library template: [tsdx](https://github.com/formium/tsdx)
- Lint: [eslint](https://github.com/eslint/eslint)
- Format: [prettier](https://github.com/prettier/prettier)

## Build Process

This chapter describes how you can manually build a monorepo like this. You can look the git commit log for more details.

I'm using yarn@1.22.5, typescript (no javascript here) and react.

### Lerna

```bash
mkdir my-mono-repo
cd my-mono-repo
npx lerna init
```

Lerna's default mode 'Fixed/Locked mode' seems good to me. If you want customize lerna, visit [this](https://github.com/lerna/lerna#getting-started).

### CRA (Create-React-App) & TSDX

To see the differences yarn workspace made, I'll set up cra and tsdx ahead of yarn workspace. You can add more packages with yarn workspace enabled.

```bash
# CRA (Create-React-App)
cd packages
npx create-react-app app-template-cra --template typescript
cd app-template-cra
yarn start
```

If nothing failed, you'll see a React App page. Try `yarn test` to check testing functionality.

```bash
# TSDX with template "basic"
cd packages
npx tsdx create lib-template-tsdx --template basic
cd lib-template-tsdx
yarn start
```

```bash
# TSDX with template "react-with-storybook"
cd packages
npx tsdx create lib-template-tsdx-react-sb --template react-with-storybook
cd lib-template-tsdx-react-sb
yarn start
```

Tsdx offers three templates: basic, react and react-with-storybook. "Basic" is good for utility libraries, "react" & "react-with-storybook" is good for component libraries. You can skip the `--template` flag and choose one when initializing.

After installation succeed, try `yarn start`, `yarn test` and `yarn storybook`(react-with-storybook only) in these packages.

### Yarn Workspace

You can see in chapter "CRA (Create-React-App) & TSDX", all dependencies each package need are installed locally in `./packages/package-name/node_modules`. And they just don't know the siblings exist (I mean they cannot refer to each other, for now).

We will save lerna for publishing and other high-level jobs, leave the simple "link" step to yarn workspaces which is the [low-level primitive](https://classic.yarnpkg.com/en/docs/workspaces/#how-does-it-compare-to-lerna-). It will significantly improve the development workflow by doing some "magic".

Add `"npmClient": "yarn"` and `"useWorkspaces": true` to "lerna.json".

Your "./lerna.json" should look like this.

```json
{
  "packages": ["packages/*"],
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
  "workspaces": ["packages/*"]
}
```

Apply these configurations by command `yarn` in root folder.

```bash
# /my-mono-repo
yarn
```

After execution, a new "node_modules" folder showed up in root, and all packages' "node_modules"'s disk usage and sub folder numbers are both significantly reduced. Whole repo's disk usage reduced from about 930 MB to 600 MB.

### Yarn workspace cleanup & workflow

Yarn workspace uses single root "yarn.lock" file. So remove all "yarn.lock" in packages.

```bash
# remove all "yarn.lock" in packages
rm packages/**/yarn.lock
```

Create a ".gitignore" in root, add `node_modules` and `*/**/yarn.lock` to it.

It should look like this.

```text
node_modules

# yarn workspace only need root yarn.lock, ignore all yarn.lock(s) in subfolders
*/**/yarn.lock
```

Now it's time for **Workflow Demonstration**.

If you want to execute a package's script, for example 'lib-template-tsdx'. There are two ways.

```bash
# workspace way
# /my-mono-repo
yarn workspace lib-template-tsdx start
```

```bash
# traditional way
cd packages/lib-template-tsdx
yarn start
```

Now I want to use "lib-template-tsdx" in "app-template-cra".

```bash
# ✅ Current version of lib-template-tsdx is 0.1.0, use that.
yarn workspace app-template-cra add lib-template-tsdx@0.1.0
```

```bash
# ❌ It will throw an error if no version specified.
yarn workspace app-template-cra add lib-template-tsdx
```

More details at this [issue](https://github.com/yarnpkg/yarn/issues/4878).

After local dependency installed, use "lib-template-tsdx"'s method in "app-template-cra" by editing "app-template-cra/src/App.tsx".

It should look like this.

```tsx
// ...
// the import added
import { sum } from 'lib-template-tsdx';

function App() {
  // the code added
  const result = sum(1, 3);

  return; //...
}
// ...
```

Run "app-template-cra".

```bash
yarn workspace app-template-cra start
```

Console has an output which is written in "lib-template-tsdx". It is working.

But changing code in "lib-template-tsdx" won't update the running tab, webpack HMR (Hot Module Replacement) does not received any signals.

We will need two terminals to make HMR working.

```bash
# terminal one
yarn workspace lib-template-tsdx start
```

```bash
# terminal two
yarn workspace app-template-cra start
```

Now webpack HMR will get notified when "lib-template-tsdx"'s code changed (after "lib-template-tsdx"'s compilation completed).

It works like a charm!

### Storybook

> Storybook is an open source tool for developing UI components in isolation for React, Vue, Angular, and more. It makes building stunning UIs organized and efficient.

Tsdx has a template with storybook bundle. But it is one storybook per package. What if we want a big storybook covers all packages?

Let do it.

```bash
# /my-mono-repo
# init storybook
npx sb init
```

Try `yarn storybook`.

Now we are gonna migrate tsdx's settings to root.

Your `.storybook/main.js` should look like this.

```javascript
module.exports = {
  "stories": [ // Specify where to find stories.
    "../packages/**/stories/**/*.stories.mdx", // MDX looks cool, keep it.
    "../packages/**/stories/**/*.stories.@(ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials", // The "addon-essentials" covers other addons which tsdx uses.
    "@storybook/preset-create-react-app" // We may use storybook in cra?
  ],
  webpackFinal:  ... // Copied from "lib-template-tsdx-react-sb/.storybook/main.js".
}
```

Tsdx's storybook config requires `ts-loader` and `react-docgen-typescript-loader`, install them.

```bash
# /my-mono-repo
yarn add -WD ts-loader react-docgen-typescript-loader
```

Try `yarn storybook`. You'll see root storybook finds the story in packages.

Since root storybook covers all, it's time to do some cleanup.

```bash
# /my-mono-repo
rm -rf stories
rm -rf packages/**/.storybook
```

And cleanup packages' package.json (two storybook scripts and all dependencies related to storybook only).

### Test

Create-react-app and tsdx all have build-in test command. But CRA's test command by default won't exit after execution. We will ask lerna ci for help. But first install cross-env to use this script in all platforms.

```bash
yarn add -WD cross-env
```

Add a new script in root package.json.

```json
{
  ...
  "scripts": {
    "test": "cross-env CI=true FORCE_COLOR=true lerna run test -- --coverage",
    ...
  }
}
```

Try `yarn test`. Don't forget to add "coverage" to .gitignore.

### Lint & Format

Eslint and prettier are good friends to rely on, especially when doing teamwork.

They have many functionality overlapped, so I'll use eslint for lint only, leave format to prettier.

### Prettier Standalone

Install prettier.

```bash
# install as dependency
yarn add -WD prettier
```

Create your own `.prettierrc.yaml`.

Here is my config.

```yaml
arrowParens: 'avoid'
bracketSpacing: true
jsxSingleQuote: false
printWidth: 120
semi: true
singleQuote: true
tabWidth: 2
trailingComma: 'all'
overrides:
  - files:
      - '*.tsx'
      - '*.ts'
    options:
      tabWidth: 4
```

Add new script to root package.json.

```json
{
  ...
  "scripts": {
    ...
    "format": "prettier --config ./.prettierrc.yaml --ignore-path ./.gitignore --write ."
  },
  ...
}
```

Try `yarn format`, it will format all files don't fit the root .gitignore file's rules.

### Eslint

#### Manage `tsconfig.json`s

Eslint uses `tsconfig.json`, cra and tsdx produces a default for each package, and we'll use lerna to run lint one by one, so it is good already. Learn more at [typescript-eslint-MONOREPO](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/MONOREPO.md). But it is more organized with a root `tsconfig.json` and extend it in each package.

We are gonna extract a common `tsconfig.json` as root, and extend from that to make packages' `tsconfig.json` cleaner.

Here is root `tsconfig.json` looks like.

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
    "esModuleInterop": true,
    "strict": true
  }
}
```

Here is package `tsconfig.json` looks like.

- cra packages

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
  },
  "include": ["src"]
}
```

- tsdx packages

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "lib": ["dom", "esnext"],
    "importHelpers": true,
    "declaration": true,
    "sourceMap": true,
    "rootDir": "./src",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
  },
  "include": ["src", "types"]
}
```

Try `yarn test`.

#### Add Eslint Configurations

Eslint has a different approach of [configuration in hierarchy](https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy). And I want apply different rules to apps and libs. So packages hierarchy needs modification.

```bash
cd packages
mkdir apps # move all apps here, like "app-templat-cra"
mkdir libs # move all libraries here, like "lib-template-tsdx"
```

Modify root `package.json` and `lerna.json`.

```diff
# package.json
{
  ...
  "workspaces": [
-    "packages/*"
+    "packages/apps/*", "packages/libs/*"
  ],
  ...
}
```

```diff
# lerna.json
{
  ...
-  "packages": ["packages/*"],
+  "packages": ["packages/apps/*", "packages/libs/*"],
  ...
}
```

Execute `yarn` to apply changes.

Try `yarn test`, you'll find some errors caused by hierarchy changes: "error TS5058: The specified path does not exist".

Now apply the hierarchy changes to all packages' `tsconfig.json`.

```diff
{
  ...
-  "extends": "../../tsconfig.json",
+  "extends": "../../../tsconfig.json",
  ...
}
```

Try `yarn test`, it should be working.

### TODO
