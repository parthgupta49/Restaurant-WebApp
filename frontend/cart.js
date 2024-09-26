//cart page populator:
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    let productsArray = []; //store the cart from cookie

    //get the cookie named cat
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));

    //convert from json store in productsArray
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }

    console.log("cart cookie : " + cartCookie);

    console.log(productsArray);

    const pushdiv = document.querySelector('#pushdiv');
    const checkoutBtn = document.createElement('div');
    if (cartCookie !== undefined) {
        checkoutBtn.innerHTML = `
        <button id="checkoutButton" class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-[4rem]" onclick="checkout()">
        Proceed to Checkout
    </button>
    `
    }


    const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));

    if (tokenCookie) {
        if (productsArray.length == 0 || !Array.isArray(productsArray)) {
            console.log("length is 0");
            const divContainer = document.createElement('div');
            divContainer.classList = 'text-white text-2xl'
            divContainer.innerHTML = '<h2>Please add the products</h2><h3>Your Cart is Empty</h3>';
            pushdiv.appendChild(divContainer);
        }
        else {
            productsArray.forEach(function (element, index) {
                const divContainer = document.createElement('div');

                divContainer.innerHTML = `
                <div class="flex w-[70%] mx-auto min-h-[10rem]  border-t border-t-gray-500  text-white justify-between py-5">
                        <img src="${element.thumbNail}" alt="" class="h-[14rem] w-[15rem]  object-cover object-center rounded-md border border-white">
                        <!-- product Name and functionality of adding the item to the cart and removing -->
                       <div class="flex flex-col justify-between ml-[4rem]" >
                            <div class="flex justify-between gap-[5rem] pr-2">
                                <!-- product name -->
                                <div class="text-xl mr-[4rem] self-start text-yellowMain">${element.productName}</div>
        
                                <div class=" text-gray-500 font-bold">
                                <p class="" >Each</p>
                                <p  >₹${element.price}</p>
                                </div>
                                <!-- functionalities buttons -->
                                <div>
                                <p class="font-bold">Quantity</p>
                                <div class="flex gap-2 justify-center items-center">
                                    
                                    <!-- add button -->
                                    <button class="text-2xl" onclick="increase('${element.productName}',this.parentNode.querySelector('#quantity'),this.parentNode.parentNode.parentNode.querySelector('#netprice'))">+</button>
                                    <!-- quantity will come here -->
                                    <span id="quantity">${element.quantity}</span>
                        
                                    <button class="text-3xl" onclick="decrease('${element.productName}',this.parentNode.querySelector('#quantity'),this.parentNode.parentNode.parentNode.querySelector('#netprice'))">-</button>
                                </div>
                                </div>
                                
                                <div class="text-green-500 font-bold">
                                <span>Total<span>(₹)</span></span>
                                
                                
                                
                                <span id="netprice">
                                ${element.price * element.quantity}
                                </span>
                                
                                
                                </div>
                            </div>
           
                   <!-- product price will come here -->
                   
        
        
                            <button class = "self-start" id="remove" onclick="removeProduct(this.parentNode.parentNode,'${element.productName}')"><i class="fa-regular fa-trash-can"></i></button>
                       </div>
                </div>
        
                
            `
                pushdiv.appendChild(divContainer);
                pushdiv.appendChild(checkoutBtn)

            });

        }

    }



























    else {
        const divContainer = document.createElement('div');
        divContainer.className = 'text-center text-4xl text-white'
        divContainer.innerHTML = '<h2>Please log in to access the cart</h2>';
        pushdiv.appendChild(divContainer);
    }





}

//function to increase the quantity
async function increase(productName, quantity_reference, netprice_reference) {
    console.log("increase");
    //variables
    let productsArray = []; //store the cart from cookie
    let productId;

    //get the cookie named cat
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));

    //convert from json store in productsArray
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }

    let response01 = await fetch("http://localhost:4000/api/v1/product/getAllProducts"); //fetch products from server
    let response02 = await response01.json() // convert from json to javascript data type
    let response03 = response02.data //put the data property from response02 to response03 (that property contains all the products info)
    //console.log("response03 : "+response03); //test to see if correctly retrived
    for (let iterator = 0; iterator < response03.length; iterator++) {
        if (productName === response03[iterator]['productName']) {
            //console.log(response03[iterator]['productName']+":"+response03[iterator]['_id']);
            productId = response03[iterator]['_id'];
        }
        else {
            //console.log("nah");
        }
    }

    let quantity;
    let netprice;
    for (let iterator = 0; iterator < productsArray.length; iterator++) {
        if (productsArray[iterator]['productId'] === productId) {
            productsArray[iterator]['quantity'] += 1
            quantity = productsArray[iterator]['quantity']
            netprice = productsArray[iterator]['price'] * quantity;
        }
    }

    let JSONed = JSON.stringify(productsArray);
    document.cookie = `cart=${JSONed}`;

    quantity_reference.innerHTML = quantity;
    netprice_reference.innerHTML = netprice;


}

//function to decrease the quantity
async function decrease(productName, quantity_reference, netprice_reference) {
    //variables
    let productsArray = []; //store the cart from cookie
    let productId;

    //get the cookie named cat
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));

    //convert from json store in productsArray
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }

    let response01 = await fetch("http://localhost:4000/api/v1/product/getAllProducts");//fetch products from server
    let response02 = await response01.json() // convert from json to javascript data type
    let response03 = response02.data //put the data property from response02 to response03 (that property contains all the products info)
    //console.log("response03 : "+response03); //test to see if correctly retrived
    for (let iterator = 0; iterator < response03.length; iterator++) {
        if (productName === response03[iterator]['productName']) {
            //console.log(response03[iterator]['productName']+":"+response03[iterator]['_id']);
            productId = response03[iterator]['_id'];
        }
        else {
            //console.log("nah");
        }
    }

    let quantity;
    let netprice;
    for (let iterator = 0; iterator < productsArray.length; iterator++) {
        if (productsArray[iterator]['productId'] === productId) {
            productsArray[iterator]['quantity'] -= 1;
            quantity = productsArray[iterator]['quantity']
            netprice = netprice_reference.innerHTML - productsArray[iterator]['price']
            if (productsArray[iterator]['quantity'] < 1) {
                productsArray[iterator]['quantity'] += 1;
                quantity = productsArray[iterator]['quantity']
                netprice = productsArray[iterator]['price']
            }
        }
    }

    let JSONed = JSON.stringify(productsArray);
    document.cookie = `cart=${JSONed}`;

    quantity_reference.innerHTML = quantity;
    netprice_reference.innerHTML = netprice;

}

function removeProduct(product_handle, productName) {
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));
    let productsArray = []; //store the cart from cookie
    //convert from json store in productsArray
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }
    for (let iterator = 0; iterator < productsArray.length; iterator++) {
        if (productsArray[iterator]['productName'] === productName) {
            productsArray.splice(iterator, 1);

        }
    }
    let JSONed = JSON.stringify(productsArray);
    document.cookie = `cart=${JSONed}`;
    product_handle.remove();

    if (productsArray.length == 0) {
        let pushdiv = document.querySelector('#pushdiv');
        let button = pushdiv.querySelector('#checkoutButton');
        button.remove();
        const divContainer = document.createElement('div');
        divContainer.classList = 'text-white'
        divContainer.innerHTML = '<h2>Please add the products</h2><h3>Your Cart is Empty</h3>';
        pushdiv.appendChild(divContainer);
    }
}

function checkout() {
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));
    let productsArray = []; //store the cart from cookie
    //convert from json store in productsArray
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }

    fetch('http://localhost:4000/checkout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productsList: productsArray
        })
    }).then(function (returned_value) {
        return returned_value.json()
    }).then(function (returned_value) {
        console.log(returned_value);
        window.location.href = returned_value.url;
    })
}

//this function is to print out the values of the cookie - cart (chat gpt authored) use this only at debugging
function foo2() {
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));

    // Parse the JSON string back into an array
    let productsArray = [];
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }

    console.log(productsArray);


}