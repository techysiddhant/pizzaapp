const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const PORT = process.env.PORT || 3000;

//create a first route
app.get('/', (req,res)=>{
    // console.log(__dirname, '/resources/views');
    res.render('home')
})


// set tamplate engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');




// create a server
app.listen(PORT, ()=>{
    console.log(`Listening on Port ${PORT}`);
})