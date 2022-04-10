const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');

function initRoutes(app) {
    app.get("/", homeController().index);
    // cart route
    app.get("/cart", cartController().index);
    app.post('/update-cart', cartController().update);
    //login route

    app.get("/login", authController().login);
    //register route
    app.get("/register", authController().register);
}

module.exports = initRoutes;