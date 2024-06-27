if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}
function ready() {
    fetch("http://localhost:4000/api/v1/product/getAllProducts")
        .then(response => response.json())
        .then(products => {
            console.log(products);
            
            // let priceInc = 10;
            const productArray = products.data
            // for (const iterator of productArray) {
            //     let myObj = iterator
            //     myObj.price = 30 + priceInc;
            //     priceInc += 10
            //     console.log(iterator)
            // }
            console.log(productArray)
            showProductContainer(productArray)
            // Do something with the products data
        })
        .catch(error => console.error("Error fetching products:", error));

    const productContainer = document.querySelector('.productContainer');

    const productTemplate = document.querySelector('#productTemplate');

    const showProductContainer = (products) => {
        if (!products) return false;


        products.forEach((curProd) => {
            const { id, productName, productDescription, price, thumbNail } = curProd;

            const productClone = document.importNode(productTemplate.content, true);
            // productClone.querySelector('.productName').textContent = name;


            productClone.querySelector('.productImage').src = thumbNail
            // productClone.querySelector('.productImage').alt = name;
            // productClone.querySelector('.category').alt = category;

            productClone.querySelector('.productName').textContent = productName;
            productClone.querySelector('.productDescription').textContent = productDescription;

            // document.body.style.backgroundImage = "url('img_tree.png')";

            productClone.querySelector('.productPrice').innerText = ` ₹${price}`;

            // console.log(productClone.querySelector('.productPrice').innerText)

            let cart_array = [];
            let cookiesCart = document.cookie.split("; ").find(cookie => cookie.startsWith('cart='))
            if(cookiesCart != undefined)
            {
              //if that cookie is available, then....
              console.log("if(cookiesCart != undefined)");
              let unJSON = cookiesCart.split("=")[1];
              cart_array = JSON.parse(unJSON);
              // let var69 =  -1 ;//cart_array.indexOf(id)
              // console.log(cart_array);

              cart_array.forEach(function(element){
                // console.log(element);
                // console.log(productId : ${element['productId']});
                // console.log(id : ${curProd['_id']});
                if(element['productId'] == curProd['_id'] || element['productId'] === curProd['_id'])
                {
                  // console.log("inside success : "+productName);
                  productClone.querySelector('.button').querySelector('span').innerHTML = '<i class="fa-solid fa-cart-shopping text-xl"></i>';
                }
                else
                {
                  // console.log("failed : "+productName);
                }
              })

              
            }
            else
            {
              console.log("cookie undefinded");
            }

            


            productContainer.append(productClone)
        });


    }
    document.querySelectorAll(".button").forEach((button) =>
    button.addEventListener("click", (e) => {
   if (!button.classList.contains("loading")) {
       button.classList.add("loading");
       setTimeout(() => button.classList.remove("loading"), 3700);
   }
   e.preventDefault();
})
);

}

//add to cart function:
async function add_to_cart(name,spanNode)
{
    //small test to confirm this function is triggered with right argument 
  console.log("inside foo");
  console.log(name);


  let sendable; //this will have the id of the product that is being added to cart
  let cart_array = []; //arry to work with cart feature
  let flag = 0; //flag to indicate weather a product is aldready added to cart or not (0 indicates not added aldready)
  let price = 0; //variable to store quantity
  let thumbNail; //store link for thumbnial

  //get the cart cookie from browser, parse from json to javascript datatype, put it in cart_array[]
  let cookiesCart = document.cookie.split("; ").find(cookie => cookie.startsWith('cart='))
  if(cookiesCart != undefined)
  {
    //if that cookie is available, then....
    console.log("if(cookiesCart != undefined)");
    let unJSON = cookiesCart.split("=")[1];
    cart_array = JSON.parse(unJSON);
  }
  else
  {
    //if not available
    console.log("else");
  }

  //get the product data from server,check weather the product is available in it(by comparing the name given in this function parameter with the data from server)
  //then if available, put the id of that product into sendable
  let response01 = await fetch("http://localhost:4000/api/v1/product/getAllProducts");
  let response02 = await response01.json()
  let response03 = response02.data
  console.log("response03 : "+response03);
  for(let iterator = 0;iterator < response03.length;iterator++)
  {
    if(name === response03[iterator]['productName'])
    {
        console.log("debug in something :"+response03[iterator]['productName']+":"+response03[iterator]['_id']);
        sendable = response03[iterator]['_id'];
        price = response03[iterator]['price'];
        thumbNail = response03[iterator]['thumbNail'];
    }
    // else
    // {
    //     console.log("nah what the fuck");
    // }
  }

  for(let iterator = 0;iterator < cart_array.length;iterator++)
  {
    if(cart_array[iterator]['productId'] === sendable)
    {
        flag = 1;
    }
  }
  
  //push the item id with quantity into the cart_array if not aldready added
  if(flag == 0)
  {
    cart_array.push({
        productName : name,
        productId : sendable,
        quantity : 1,
        price : price,
        thumbNail : thumbNail
      })
      console.log("just added");
  }
  else
  {
    //if aldready added
    console.log("aldready added");
  }


  


  //push the changed cart array into the cookie
  let JSONed = JSON.stringify(cart_array);
  document.cookie = `cart=${JSONed}`;

  let alertText; //text to be displayed after you click add to cart

  if(flag == 1)
  {
    alertText = `${name} is already added to cart` //if aldready the product was added
  }
  else
  {
    alertText = `${name} is added to cart` 
  }

  //create that div, add the text to it
  let content = document.createTextNode(alertText);

  // let var01 = document.createElement('div');
  // var01.appendChild(content);

  // //styling for the div element
  // var01.style.position = 'fixed';
  // var01.style.top = '20px';
  // var01.style.right = '-200px'; // Initial position off the screen
  // var01.style.backgroundColor = 'white';
  // var01.style.border = '2px solid #ccc';
  // var01.style.borderRadius = '10px';
  // var01.style.padding = '20px';
  // var01.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  // var01.style.zIndex = '1000';
  // var01.style.transition = 'right 0.3s ease-in-out'; // Smooth animation for sliding in
  // var01.style.fontSize = '1.2rem'
  // var01.style.fontWeight = 'bold'
  // // Create close button
  // var closeButton = document.createElement('button');
  // closeButton.innerHTML = 'X';
  // closeButton.style.position = 'absolute';
  // closeButton.style.top = '5px';
  // closeButton.style.right = '5px';
  // closeButton.style.backgroundColor = '#fff';
  // closeButton.style.border = 'none';
  // closeButton.style.color = '#666';
  // closeButton.style.cursor = 'pointer';
  // closeButton.style.fontSize = '1rem';
  // closeButton.style.width = '20px';
  // closeButton.style.height = '20px';
  // closeButton.style.borderRadius = '50%';
  // closeButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';

  // Add event listener to close the modal when the close button is clicked
  // Add event listener to close the modal when the close button is clicked
  // closeButton.addEventListener('click', function() {
  //     var01.style.right = '-200px'; // Slide out to the right
  //   setTimeout(() => {
  //       document.body.removeChild(var01);
  //   }, 300); // Wait for the animation to complete before removing the element
  // });

  // // Append the close button to the modal
  // var01.appendChild(closeButton);




  let var01 = document.createElement('div');
var01.appendChild(content);

// Styling for the div element
var01.style.position = 'fixed';
var01.style.bottom = '20px'; // Move the modal to the bottom
var01.style.left = '50%'; // Center the modal horizontally
var01.style.transform = 'translateX(-50%)'; // Adjust for centering
var01.style.backgroundColor = 'white';
var01.style.border = '2px solid #ccc';
var01.style.borderRadius = '10px';
var01.style.padding = '20px';
var01.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
var01.style.zIndex = '1000';
var01.style.transition = 'opacity 0.3s, transform 0.3s'; // Smooth animation for opacity and transform
var01.style.fontSize = '1.2rem';
var01.style.fontWeight = 'bold';

// Create close button
var closeButton = document.createElement('button');
closeButton.innerHTML = 'X';
closeButton.style.position = 'absolute';
closeButton.style.top = '5px';
closeButton.style.right = '5px';
closeButton.style.backgroundColor = '#fff';
closeButton.style.border = 'none';
closeButton.style.color = '#666';
closeButton.style.cursor = 'pointer';
closeButton.style.fontSize = '1rem';
closeButton.style.width = '20px';
closeButton.style.height = '20px';
closeButton.style.borderRadius = '50%';
closeButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';

// Add event listener to close the modal when the close button is clicked
closeButton.addEventListener('click', function() {
    var01.style.opacity = '0'; // Fade out
    var01.style.transform = 'translateX(-50%) translateY(100%)'; // Slide down
    setTimeout(() => {
        document.body.removeChild(var01);
    }, 300); // Wait for the animation to complete before removing the element
});

// Append the close button to the modal
var01.appendChild(closeButton);

// Append the modal to the body
document.body.appendChild(var01);

// Trigger reflow to apply styles and start the animation
var01.offsetHeight;
// Slide in and fade in the modal
var01.style.opacity = '1';
var01.style.transform = 'translateX(-50%) translateY(0)';



  // Append the modal to the document body
  // document.body.appendChild(var01);

  // Animate the popup to slide in from the right
  // setTimeout(() => {
  //     var01.style.right = '20px';
  // }, 100); // Wait for 100ms before starting the animation

  // // Automatically close the popup after 5 seconds
  setTimeout(() => {
      var01.style.bottom = '-200px'; // Slide out to the right
      setTimeout(() => {
          document.body.removeChild(var01);
      }, 300); // Wait for the animation to complete before removing the element
  }, 5000); // 5000 milliseconds (5 seconds)
  

  //add the div element to the body of the document
  //document.body.appendChild(var01);

  flag = 0;
  spanNode.innerHTML = '<i class="fa-solid fa-cart-shopping text-xl"></i>';


}

//this function is to print out the values of the cookie - cart (chat gpt authored) use this only at debugging
function foo2()
{
    const cartCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('cart='));

    // Parse the JSON string back into an array
    let productsArray = [];
    if (cartCookie) {
        const cartJSON = cartCookie.split('=')[1];
        productsArray = JSON.parse(cartJSON);
    }

    console.log(productsArray);
}


