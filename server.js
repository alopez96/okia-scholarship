const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')
const mongoose = require('mongoose')

const register = require('./controllers/register')

const { db_user, db_password, db_name, db_cluster } = require('./config.js');

mongoose.Promise = global.Promise; // let's us use then catch
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb+srv://${db_user}:${db_password}@${db_cluster}/${db_name}`, { useNewUrlParser: true });
mongoose.connection
    .once('open', () => console.log('Mongodb is connected'))
    .on('** MongoDB Connection Error', err => console.log(err));

// define express instance
const app = express();
// replacing app.use(bodyParser.json()); to get rawBody for Stripe Webook
// Now the raw body is available on req.rawBody 
// and the JSON parsed data is available on req.body
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))
app.use(bodyParser.urlencoded());
app.use(cors());


app.set('views', path.join(__dirname, 'views'));
app.use(session({ secret: 'session secret key' }));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// root directory
app.get('/', (req, res) => { 
    // const path = resolve(process.env.STATIC_DIR + "/index.html");
    // res.sendFile(path);  
    return res.send('It is working!')
  })

//running on port 3001 to avoid conflict with react
app.listen(3001, () => { console.log(`Server is running  on port 3001!`) })


// register new user
app.post('/register', (req,res) => { register.handleRegister(req, res) })

// get user with id
app.get('/profile', (req, res, next) => { register.handleProfileGet(req, res, next) })

// sign in request
app.post('/signin', (req, res, next) => { register.handleSignin(req, res, next) })