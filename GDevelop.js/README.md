# GDevelop.js

These are the bindings of GDevelop core classes to WebAssembly+JavaScript. This allows [GDevelop Core libraries](https://github.com/4ian/GDevelop) to run in a browser or on Node.js.

## How to build

> 👋 Usually, if you're working on the GDevelop editor or extensions in JavaScript, you don't need to rebuild GDevelop.js. If you want to make changes in C++ extensions or classes, read this section.

- Prerequisite tools installed:

  - [CMake 3.17+](http://www.cmake.org/) (3.5+ should work on Linux/macOS). On macOS, you can install it via Homebrew (recommended for Apple M1 Architectures).
  - [Node.js](https://nodejs.org/). (We recommend using [nvm](https://github.com/nvm-sh/nvm) to be able to switch between Node versions easily).
  - Python (via [pyenv](https://github.com/pyenv/pyenv) for versions management).

- Install [Emscripten](https://github.com/kripken/emscripten) version `3.1.21`, as explained below or on the [Emscripten installation instructions](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html):

  ```bash
  git clone https://github.com/emscripten-core/emsdk/
  cd emsdk
  git pull
  ./emsdk install 3.1.21
  ./emsdk activate 3.1.21

  # On Windows, also install an additional Python package:
  pip install setuptools
  ```

- Whenever you try to build GDevelop.js in the future, you will have to load the emsdk environement into your terminal window again by running:

  | Linux/macOS             | Windows (Powershell) | Windows (cmd.exe) |
  | ----------------------- | -------------------- | ----------------- |
  | `source ./emsdk_env.sh` | `./emsdk_env.ps1`    | `./emsdk_env.bat` |

- With the emscripten environement loaded into your terminal, launch the build from GDevelop.js folder:

  ```bash
  cd GDevelop.js
  npm install # Only the first time.
  npm run build # After any C++ changes.
  ```

  > ⏱ The linking (last step) of the build can be made a few seconds faster, useful for development: `npm run build -- --variant=dev`.

- You can then launch GDevelop 5 that will use your build of GDevelop.js:

  ```bash
  cd ..
  cd newIDE/app
  npm install
  npm start
  ```
