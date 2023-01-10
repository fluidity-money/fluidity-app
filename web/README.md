# Welcome Web Developer! 💡

We have some projects in here to keep our monorepo nice and tidy.
I'll give you the tour.

- Surfing is our UI library, it keeps the pages looking glossy.
- Project fluidity.money is our landing page.
- Project app.fluidity.money is our system's main point of access.

## Setup

We're using turborepo here so just use:

```bash
npm install
npm run dev
```

in _this_ folder and it should all be live.
Things aren't working? Run `npm ci` from the root and it should pull all
the stuff you need from the lockfile.

## Package management
Is it a shared package such as React? An npm install in the root should do.
If your package manager is new enough to be workspace aware, (we'd hope so in this case) 
npm install in the directory of the application. 

Alternatively you can use the more powerful `--workspace` flag.

## Usage

Current commands: 

**Turborepo**
- npm run build
- npm run test
- npm run dev
- npm run storybook

To use turborepo options behind these, e.g filter use the following syntax.

```sh
npm run build -- --filter=surfing
```

**Prettier**
- npm run format

## Creating a new package
**Great!** This monorepo tech exists to make package creation and code sharing painless.

Currently we _aren't_ following the best practice for directory structure as a layover from before.

Simply use your scaffolder, I like create-vite. Then add your project to the `web` folder's `package.json` as a workspace.

Run an `npm install` and it should be good to go!

Before you go, chuck a brief description of your app in this file. 
It really helps people get their bearings around the code here.

Have fun!
