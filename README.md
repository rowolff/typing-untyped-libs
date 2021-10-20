# Abstract

This repo showcases how you can integrate a JavaScript SDK at runtime while still enjoying the comfort of type checking that you are used to in TypeScript, even if no `@types/...` definitions are available.

# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It has a client (ui) and a server component.

Run `yarn install` to install dependencies for both components.

This example app integrates the [Klarna Payments JavaScript SDK](https://docs.klarna.com/klarna-payments/api-call-descriptions/load-klarna-payments/) which allows you to make an invoice payment.

Before using the example, make sure to create a developer playground account in the [Klarna Merchant Portal](https://playground.eu.portal.klarna.com/) and generate new Klarna API credentials under Settings > Klarna API Credentials.

Download the created credentials, then either create an environment file (`touch ./server/.env`) or set the following environment variables in your terminal:

```bash
KLARNA_USERNAME=...
KLARNA_PASSWORD=...
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the server and the ui in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

The server runs on `http://localhost:8080` and has CORS rules applied that allow port 3000 to make requests against it.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Evolution of this project

The conversion of an untyped lib to a typesafe one can be followed by checking out the project at various stages. The readme you are consuming now is from the final stage. The other stages are:

1. Working Klarna checkout without any type checking: `git checkout tags/v2`
1. A solution using `unknown` instead of `any`: `git checkout tags/v3`
1. Intermediate step with extending the Window interface with our own type: `git checkout tags/v4`
1. Final step with full type safety: `git checkout tags/v5`
1. ....and tests....: `git checkout tags/v6`
1. and a readme: `git checkout main`

(yes, there is also a v1 tag, but this is literally the starting state of CRA and it will mess up the dependencies due to changed folder structure - check this out at your own peril)
