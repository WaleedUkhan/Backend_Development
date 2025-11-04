const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', './layout');
app.set('view engine', 'ejs');

//Database Connection
mongoose.connect(process.env.MONGO_URI,)


app.get('/', (req, res) => {
    res.send('Welcome to the News CMS API');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {    
    console.log(`Server is running on port ${PORT}`);
}); 