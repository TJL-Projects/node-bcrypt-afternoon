require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      massive = require('massive'),
      treasureCtrl = require('./controllers/treasureController'),
      authCtrl = require('./controllers/authController'),
      auth = require('./middleware/authMiddleware');

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

const PORT = SERVER_PORT;
const app = express();

app.use(express.json());

app.use(session({
   resave: true,
   saveUninitialized: false,
   secret: SESSION_SECRET
}))

massive({
   connectionString: CONNECTION_STRING,
   ssl: {rejectUnauthorized: false}
}).then(db => {
   app.set('db', db);
   console.log('db connected');
   app.listen(PORT, () => console.log(`listening on port ${PORT}`))
})

app.post(`/auth/register`, authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);