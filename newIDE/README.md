# GDevelop IDE

This is the GDevelop 5 editor. It is based on [React](https://facebook.github.io/react/), [Material-UI](http://www.material-ui.com), [Pixi.js](https://github.com/pixijs/pixi.js), [Three.js](https://github.com/mrdoob/three.js) and [Electron](https://electron.atom.io/) for the desktop app.
It uses GDevelop [core C++ classes compiled to Javascript](https://github.com/4ian/GDevelop.js) to work with GDevelop games.

![GDevelop editor](https://raw.githubusercontent.com/4ian/GDevelop/master/newIDE/GDevelop%20screenshot.png "GDevelop editor")

## 1) Installation 💻

Make sure to have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org) installed. [Yarn](https://yarnpkg.com) is optional.

```bash
git clone https://github.com/4ian/GDevelop.git
cd GDevelop/newIDE/app
npm install # or yarn
```

## 2) Development 🤓

```bash
npm start # or yarn start
```

This will open the app in your web browser.

Images resources, GDJS Runtime, extensions will be copied in resources, and [libGD.js](https://github.com/4ian/GDevelop/tree/master/GDevelop.js) will be downloaded automatically. If you wish, you can
[build libGD.js by yourself](https://github.com/4ian/GDevelop/tree/master/GDevelop.js) (useful if you modified GDevelop native code like extensions).

> Note for Linux: If you get an error message that looks like this:
> `Error: watch GD/newIDE/app/some/file ENOSPC` then follow the instructions [here](https://stackoverflow.com/questions/22475849/node-js-error-enospc) to fix.

### Development of the standalone app

You can run the standalone app with Electron. **Make sure that you've launched `npm start` (or `yarn start`) in the `app` folder before** (see above) and **keep it running** (in development, the app is served from a local server, even for the standalone app).

> Note for Windows: With **Node.js 14 or older**, there is an error related to `git-sh-setup` when running npm install.
> To solve this problem: add [this folder to your path environment variable](https://stackoverflow.com/questions/49256190/how-to-fix-git-sh-setup-file-not-found-in-windows) **OR** run `npm install` in newIDE/electron-app/app **before** npm install in newIDE/electron-app.

```bash
cd newIDE/app && npm start # Be sure to have this running in another terminal, before the rest!
```

### Quick Install and Run

There is a script file that automates cloning this repository, building the IDE and running it:

-   For Windows: You can download the batch script [here](https://raw.githubusercontent.com/4ian/GDevelop/master/scripts/gitCloneAndBuildGD.bat) and save it to where you want GDevelop to be cloned, then simply run it.

### Development of UI components

You can run a [Storybook](https://github.com/storybooks/storybook) that is used as a playground for rapid UI component development and testing:

```bash
cd newIDE/app
npm run storybook # or yarn storybook
```

> ℹ️ When creating a Pull Request/pushing a commit, a CI will build the Storybook for you and host it temporarily to allow to test components directly from your browser. Navigate to `http://gdevelop-storybook.s3-website-us-east-1.amazonaws.com/YOUR_BRANCH/latest/index.html` to see it.

Find [here the Storybook of the latest version on master](http://gdevelop-storybook.s3-website-us-east-1.amazonaws.com/master/latest/index.html).

### Tests

Unit tests, type checking and auto-formatting of the code can be launched with these commands:

```bash
cd newIDE/app
npm run test # or yarn test
npm run flow # or yarn flow
npm run format # or yarn format
```

### Theming

It's pretty easy to create new themes. Check the [README about themes](./README-themes.md)

### Development of the game engine or extensions

Make sure to have the standalone app running with Electron.

-   If you want to create/modify _extensions_, check the [README about extensions](./README-extensions.md) for step-by-step explanations to get started in 5 minutes.

-   The _game engine core_ ([GDJS](https://github.com/4ian/GDevelop/tree/master/GDJS)) is in [GDJS/Runtime folder](https://github.com/4ian/GDevelop/tree/master/GDJS/Runtime).

If you modify any file while the IDE is running with Electron, a watcher will _automatically import_ your changes (look at the console to be sure).

You can then _launch a preview_ in GDevelop (again, be sure to be using [the standalone app running with Electron](https://github.com/4ian/GDevelop/blob/master/newIDE/README.md#development-of-the-standalone-app) to be sure to have your changes reflected immediately).

> If you deactivated the watcher in preferences, run the `import-GDJS-Runtime.js` script manually (`cd newIDE/app/scripts` then `node import-GDJS-Runtime.js`) after every change, before launching a preview.

### Recommended tools for development

Any text editor is fine, but it's a good idea to have one with _Prettier_ (code formatting), _ESLint_ (code linting) and _Flow_ (type checking) integration. [Modern JavaScript is used for the editor](https://github.com/4ian/GDevelop/blob/master/newIDE/docs/Supported-JavaScript-features-and-coding-style.md).

👉 You can use [Visual Studio Code](https://code.visualstudio.com) with these extensions: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Flow Language Support](https://github.com/flowtype/flow-for-vscode).
