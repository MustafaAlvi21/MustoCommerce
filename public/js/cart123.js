setTimeout(() => {
    // console.clear()
}, 1000);


/* ====================================== */
/*        SCRIPT FOR CART PRODUCTS        */
/* ====================================== */

// data to be sent to the POST request
allCartProductsDetails = []
Postal186512 = "";
completeAddress = "";
deliveryInstructions = "";

getCartData()
function getCartData(){
    let products = JSON.parse(localStorage.getItem("product"))
    if(products != null &&  products.length > 0){
        let data = [...products]
        data = data.map(obj => { return obj.Id })

        // fetch('http://localhost:4000/find-cart-data', {
        fetch('https://mustocommerce.herokuapp.com/find-cart-data', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {
            allCartProductsDetails = []
            totalPriceToPay  = 0;
            cartData(json)
        })
        .catch(err => 
            console.log(err)
        );
    }
}

async function cartData(data) {
    a = document.querySelector("#productRow")
    len = data.length
    products = JSON.parse(localStorage.getItem("product"))
    totalPrice = 0;

    data.forEach( (item, i) => {
        a.innerHTML += `  
            <div class="cart-items bg-white position-relative border-bottom">
                <a href="product_details.html" class="position-absolute">
                    <span class="badge badge-danger m-3">${item.promo != undefined && item.promo != '' ? item.promo + '%' : ''}</span>
                </a>
                <div class="d-flex align-items-center p-3">
                    <a href="/product-detail/${item.productId}"><img src="${item.image}" class="img-fluid" alt="img-${i}"></a>
                    <a href="#" class="ml-3 text-dark text-decoration-none w-100">
                        <h5 class="mb-1">Bread</h5>
                        <p class=" text-success mb-2">Rs. ${item.subPrice}</p>
                        <div class="d-flex align-items-center">
                            <p class="total_price font-weight-bold m-0" id="totalOfSubPrice${i}">Rs. ${item.subPrice * products[i].quantity}</p>
                            <form id='myform' class="cart-items-number d-flex ml-auto" method='POST' action='#'>
                                <input type='button' class='qtyminus quantity1 btn btn-success btn-sm'  value='-' onclick="addToCart('-${products[i].Id }')" />
                                <input type='text' name='quantity' id="p_quantity${i}"  class='qty form-control' value='${products[i].quantity}' />
                                <input type='button' class='qtyplus quantity1 btn btn-success btn-sm' value='+' onclick="addToCart('+${products[i].Id }')" />
                            </form>
                        </div>
                    </a>
                </div>
            </div>
        `
        temp = {
            productId: item.productId,
            price: item.subPrice,
            quantity: products[i].quantity
        }
        allCartProductsDetails.push(temp) 
        totalPrice = totalPrice + parseInt(products[i].quantity * item.subPrice)
        console.log("totalPrice > " + totalPrice);

        document.getElementById("cartItemCount").innerText = i+1
        ItemTotal = document.getElementById("ItemTotal").innerText = i+1
        ItemTotalPrice = document.getElementById("ItemTotalPrice").innerText = totalPrice
        DeliveryFee = document.getElementById("DeliveryFee").innerText = totalPrice > 0 ? 200 : 0;
        document.getElementById("toPay").innerText = parseInt(ItemTotal) + parseInt(ItemTotalPrice) + parseInt(DeliveryFee)
    });
    a.innerHTML += `
        <div>
            <a href="#" class="text-decoration-none btn btn-block p-3" type="button"
                data-toggle="collapse" data-target="#collapsetwo" aria-expanded="true"
                aria-controls="collapsetwo">
                <div
                    class="rounded shadow bg-success d-flex align-items-center p-3 text-white">
                    <div class="more">
                        <h6 class="m-0">Subtotal Rs. ${totalPrice}</h6>
                        <p class="small m-0">Proceed to checkout</p>
                    </div>
                    <div class="ml-auto"><i class="icofont-simple-right"></i></div>
                </div>
            </a>
        </div>
    `


}

/* ================================================== */
/*                     Add to cart                     */
/* ================================================== */

 function addToCart(itemId, e) {
    let product = {}
    if(itemId[0] == "+"){
        id1 = itemId.split("+")
        product = {
            Id : id1[1], quantity: 1
        }
    } 
    if(itemId[0] == "-"){
        id1 = itemId.split("-")
        product = {
            Id : id1[1], quantity: -1
        }
    } 

    // console.log(product)
    if (localStorage.getItem("product") === null) { a = [product]; return localStorage.setItem('product', JSON.stringify(a)); }
    a =  JSON.parse(localStorage.getItem("product"))
    temp = itemId.toString
    a = JSON.parse(localStorage.getItem("product"))
    for (let [key, value] of Object.entries(a)) {
        if(value.Id == product.Id ){
            if(parseInt(value.quantity + product.quantity) >= 0){
                a[key].quantity = parseInt(value.quantity + product.quantity)
                localStorage.setItem('product', JSON.stringify(a)); 
                return updateProductQuantity();
            }else{
                return updateProductQuantity();
            }
        }
    }
    a.push(product)
    return localStorage.setItem('product', JSON.stringify(a));            
}

function updateProductQuantity(){
    
    products =  JSON.parse(localStorage.getItem("product"))
    for (let i = 0; i < products.length; i++) {
        document.getElementById(`p_quantity${i}`).value = (products[i].quantity)
        document.getElementById(`totalOfSubPrice${i}`).value = (products[i].quantity)
    }

    document.querySelector("#productRow").innerHTML = ""
    getCartData()
}

function setUserDetails(){
    const Name182 = document.querySelector("#Name182").value;
    const Email182 = document.querySelector("#Email182").value;
    const Phone182 = document.querySelector("#Phone182").value;
    const NIC182 = document.querySelector("#NIC182").value;
    const address182 = document.querySelector("#address182").value;
    const postalCode182 = document.querySelector("#postalCode182").value;
    const cityAndState182 = document.querySelector("#cityAndState182").value;
    
    let name888 = document.querySelector("#name888").innerText = Name182;
    let email888 = document.querySelector("#email888").innerText = Email182;
    let phone888 = document.querySelector("#phone888").innerText = Phone182;
    let nic888 = document.querySelector("#nic888").innerText = NIC182;
    let address888 = document.querySelector("#address888").innerText = address182;
    let postalCode888 = document.querySelector("#postalCode888").innerText = postalCode182;
    let cityAndState888 = document.querySelector("#cityAndState888").innerText = cityAndState182;

    return({
        name888 : name888,
        email888 : email888,
        phone888 : phone888,
        nic888 : nic888,
        address888 : address888,
        postalCode888 : postalCode888,
        cityAndState888 : cityAndState888
    })  
}

async function payViaDebitCard(){
    UserDetails = await setUserDetails()
    ProductList = await JSON.parse(localStorage.getItem("product"))
    paymentMethod = await {
        method : "Via Debit / Credit Card",
        cardNumber : document.querySelector("#cardNumber").value,
        validThrough : document.querySelector("#validThrough").value,
        cVV : document.querySelector("#cVV").value,
        nameOnCard : document.querySelector("#nameOnCard").value
    }

    console.log ({
        UserDetails : UserDetails,
        ProductList : ProductList,
        paymentMethod : paymentMethod
    })
    orderData = await {
        UserDetails : UserDetails,
        ProductList : ProductList,
        paymentMethod : paymentMethod
    }
    placeOrder(orderData)
}


async function cashOnDelivery(){
    UserDetails = await setUserDetails()
    ProductList = await JSON.parse(localStorage.getItem("product"))
    paymentMethod = {
        method : "Cash On Delivery"
    }
    console.log ({
        UserDetails : UserDetails,
        ProductList : ProductList,
        paymentMethod: paymentMethod
    })
    orderData = await {
        UserDetails : UserDetails,
        ProductList : ProductList,
        paymentMethod: paymentMethod
    }
    placeOrder(orderData)
}


async function placeOrder(orderData){
    console.log("Placing order")

    // await fetch('http://localhost:4000/place-order-api-10590058', {
    await fetch('https://mustocommerce.herokuapp.com/place-order-api-10590058', {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => {
        console.log(json);

        if(json.success == true){
            localStorage.clear()
            getCartData()
            // window.location = 'http://localhost:4000/order-success/' + json.orderId
            window.location = 'https://mustocommerce.herokuapp.com/order-success/' + json.orderId
        } else {
            document.getElementById("showError").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <center>
                <strong> ${ json.error } </strong>   
                </center> 
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            `
        }
    })
    .catch(err => 
        console.log(err)
    );

    
}