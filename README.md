# Getting started

- Install dependencies

```shell
cd <project_name>
npm install -g lerna
npm install -g nodemon
npm install
lerna run tsc
```

## Deploy in the test environment

- Make sure the git repository is accessible to the server
- Create a `.env` file in the service directory.
- Install PM2 globally
- Run the following command to deploy the project with pm2

```shell
bash deploy.sh
```

## Run the project in development mode

```shell
lerna run dev
```

## Adding new services to `deploy.sh`

- Add proper `ecosystem.config.js` file to the service directory.
- Make sure the service name is unique and set the `name` property in the `ecosystem.config.js` file.
- Add the service name to the `ecosystem_files` array in the `deploy.sh` file.
