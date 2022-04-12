import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        // console.log(res);
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "Item added to the Cart",
            // progressBar: false
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 2000,
            text: "Somwthing went Wrong",
            progressBar: false
        }).show();
    })
}
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        // console.log(pizza);
    })
})

// remove alert message after x seconds
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}

initAdmin()