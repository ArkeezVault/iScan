## iScan

An application for dentists to view and request medical tests and image scans from patients

### Getting Started

**Step 1**

Clone the project then run the following in the terminal

```
npm install
```

**Step 2**

Copy enviroment file and edit it to your desired outcome by default the host is `127.0.0.1` and the port is `3000`

```
cp .env.example .env
```

**Step 3**

Navigate to `config` directory and add your database configuration for `sequelize`

```
cd config
nano config.json
```

edit the `config.json` file to your desired database connection

_sequelize helpful commands_

```
# Create a new model
npx sequelize-cli model:generate --name ModelName --attributes <fields>

# running a migration
npx sequelize-cli db:migrate

# undoing last migration
npx sequelize-cli db:migrate:undo

# undo all migrations
npx sequelize-cli db:migrate:undo:all

# undo one specific migration
npx sequelize-cli db:migrate:undo --name XXXXXXXXXXXXXX-create-posts.js

# seed one seed file only
npx sequelize-cli db:seed --seed my_seeder_file.js
```

for model fields datatypes refer to [Sequelize Data Types](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)

**Step 4**

Edit the `User Model` and `Auth Controller` to match your application needs then run

```
npx sequelize-cli db:migrate
```

**Step 5**

start the app and login

```
npm start
```
