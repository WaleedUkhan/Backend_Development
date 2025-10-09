require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const { isAuth, isAdmin, isManager } = require('./middleware/auth');

const app = express();


mongoose.connect(process.env.MONGODB_URI, {}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express EJS layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.use(express.urlencoded({ extended: true })); // Form data parse(JS Object ) karne ke liye
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false } // Set to true in production with HTTPS
}));


app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);


app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        user: req.session.user 
    });
});


app.use((req, res, next) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: err.message || 'Something went wrong!'
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});