function cartController() {
    return {
        index(req, res) {

            res.render("customers/cart");
        },
        deleteCart(req, res) {
            let cart = req.session.cart;
            if (cart.totalQty > 0) {
                cart.totalQty = cart.totalQty - 1;
                cart.totalPrice = cart.totalPrice - req.body.price;

                if (cart.items[req.body._id].qty === 1) {
                    delete cart.items[req.body._id];
                } else {
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1;
                }
                if (cart.totalQty === 0) {
                    delete req.session.cart;
                }
            }
            reload();
            let totalQty = cart ? cart.totalQty : 0;

            return res.json({ totalQty: totalQty, cartItems: cart.items });

        },
        update(req, res) {
            // example demo cart structure
            // let cart={
            //     items: {
            //         pizzaId : {item: pizzaObject, qty:0}

            //     },
            //     totalQty:0,
            //     totalPrize: 0
            // }
            // for the first time creating a cart and addind baSIC structure of cart
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }

            }
            let cart = req.session.cart;
            // console.log(req.body);

            // check if item does not exist in cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            // if (req.body.dataset.deleteBtn === 'deleteAll') {
            //     req.session.cart = {
            //         items: {},
            //         totalQty: 0,
            //         totalPrice: 0
            //     }
            // }

            return res.json({ totalQty: req.session.cart.totalQty });
        }


    }
}



module.exports = cartController;