import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
// let deleteCart = document.querySelector('#deleteCartBtn');
// let addToCart = document.querySelectorAll('.add-to-cart')
let removeToCart = document.querySelectorAll(".remove-to-cart");

// function updateCart(pizza) {
//     axios.post('/update-cart', pizza).then(res => {
//         // console.log(res);
//         cartCounter.innerText = res.data.totalQty;
//         new Noty({
//             type: 'success',
//             timeout: 1000,
//             text: "Item added to the Cart",
//             // progressBar: false
//         }).show();
//     }).catch(err => {
//         new Noty({
//             type: 'error',
//             timeout: 2000,
//             text: "Somwthing went Wrong",
//             progressBar: false
//         }).show();
//     })
// }
// addToCart.forEach((btn) => {
//     btn.addEventListener('click', (e) => {
//         let pizza = JSON.parse(btn.dataset.pizza);
//         updateCart(pizza);
//         // console.log(pizza);
//     })
// })
// deleteCart.forEach((btndel) => {
//     btndel.addEventListener('click', (e) => {
//         let pizza = JSON.parse(btn.dataset.pizza);
//         deleteCartPizza(pizza);
//     })
// })

function updateCart(pizza, url, msg) {
    axios.post(url, pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: msg,
            progressBar: false,
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
            // if data fetched from session , there will be have "item object" => (cart.ejs)
        if (pizza.item) {
            pizza = pizza.item;
        }
        let url = "/update-cart";
        updateCart(pizza, url, "Item added to cart");
    });
});

removeToCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        let url = "/orders-delete";
        updateCart(pizza.item, url, "Item removed to cart");
    })
})

// remove alert message after x seconds
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}



// change single order status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order)
let time = document.createElement('small');


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add('step-completed');
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current');
            }
        }
    })

}
updateStatus(order);
// for mobile design

window.addEventListener('resize', function() {
    addRequiredClass();
})


function addRequiredClass() {
    if (window.innerWidth < 860) {
        document.body.classList.add('mobile')
    } else {
        document.body.classList.remove('mobile')
    }
}

window.onload = addRequiredClass

let hamburger = document.querySelector('.hamburger')
let mobileNav = document.querySelector('.nav-list')

let bars = document.querySelectorAll('.hamburger span')

let isActive = false

hamburger.addEventListener('click', function() {
        mobileNav.classList.toggle('open')
        if (!isActive) {
            bars[0].style.transform = 'rotate(45deg)'
            bars[1].style.opacity = '0'
            bars[2].style.transform = 'rotate(-45deg)'
            isActive = true
        } else {
            bars[0].style.transform = 'rotate(0deg)'
            bars[1].style.opacity = '1'
            bars[2].style.transform = 'rotate(0deg)'
            isActive = false
        }


    })
    // Socket
let socket = io()

//JOIN
if (order) {
    socket.emit('join', `order_${order._id}`)

}
let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath)

if (adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = {...order };
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder);
    new Noty({
        type: 'success',
        timeout: 1000,
        text: "Order Updated",
        progressBar: false
    }).show();
    // console.log(data);
})