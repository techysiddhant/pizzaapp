const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000;
//assests
app.use(express.static('public'));



// set tamplate engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//create a first route
app.get('/', (req, res) => {
        // console.log(__dirname, '/resources/views');
        res.render('home')
    })
    // cart route
app.get('/cart', (req, res) => {
        res.render('customers/cart');
    })
    //login route
app.get('/login', (req, res) => {
        res.render('auth/login');
    })
    //register route
app.get('/register', (req, res) => {
    res.render('auth/register');
})


// create a server
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
})