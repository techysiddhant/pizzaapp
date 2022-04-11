require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo")
const passport = require('passport');

// database connection
const url = "mongodb://localhost:27017/pizza";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection
    .once("open", () => {
        console.log("Database connected...");
    })
    .on("error", (error) => {
        console.log("Connection failed...");
    });

// session-store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'sessions',
// });
//session - config
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store: MongoDbStore.create({
            mongoUrl: 'mongodb://localhost:27017/pizza'
        }),
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
        // cookie: { maxAge: 1000 * 15 }, //15 sec
    })
);

//always after session config
// Passport Config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//assests
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
        res.locals.session = req.session;
        res.locals.user = req.user;
        next();
    })
    // set tamplate engine
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// import the routes
require("./routes/web")(app);

// create a server
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});