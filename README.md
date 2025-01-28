# Getting Started with AlarmX

## Redis instruction for Windows

Open **Windows subsystem for Linux**

Run:

```
sudo service redis-server start
```

## Redis instruction for Mac

```
brew services start redis
```

## How to run

```
cd AlarmX
git checkout develop
npm install
node server
node worker
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### To get data

To avoid conflicts, please remove your current `db.sqlite3` file first and restart back-end by running `node server`

Then copy `data/afib` folder from `bot-annotation` to your current `data` folder

Then run command:

```
npx sequelize-cli db:seed:all --debug
```

### Migration

Firstly, run

```
node server
```

Then run

```
npx sequelize-cli db:migrate --debug
```

Finally, restart server and it should work

```
node server
```



