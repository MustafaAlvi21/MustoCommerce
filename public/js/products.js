// Note : This file contains list of products and filtration, sorting, and product details system


/* ============================================================================================================================= */
/*                                              Filtering List of products using API                                              */
/* ============================================================================================================================= */
// filterApi()

function getRadioValueByCost() { 
    var ele = document.getElementsByName('sortByPrice');       
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked)  return ele[i].id; 
    } 
} 

async function filterApi() {  
    // console.log(getRadioValueByCost())
    data1 = {};
    data1.sortBy = getRadioValueByCost();
    data1.MinPrice = document.getElementsByName("MinPrice")[0].value;
    data1.MaxPrice = document.getElementsByName("MaxPrice")[0].value;
    url = "http://localhost:4000/"
    // url = "https://mustocommerce.herokuapp.com/"
    await fetch(url+ 'listing-api/014520523001',{
        method: "POST",
        body: JSON.stringify(data1),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(json => {
        // console.log("Post response")
        // console.log(json)

        showFilter(json)
    })
    .catch(err => 
        console.log(err)
    );
}

function showFilter(data){
    // console.log(data)
    
    const productListSection = document.querySelector("#productRows")
    productListSection.innerHTML = ""
    // console.log(data.products[2]);
    data.products.forEach((product,  i) => {
        productListSection.innerHTML += ` 
            <div class="col-6 col-md-3 mb-3">
                <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                    <div class="list-card-image">
                        <a href="/product-detail/${product.productId}" class="text-dark">
                            ${(product.promo != '' && product.promo != undefined ?  `<div class="member-plan position-absolute"><span class="badge m-3 badge-danger">${product.promo}%</span></div>` : `` ) }
                            <div class="p-3">
                                <img src="${product.image}" class="img-fluid item-img w-100 mb-3">
                                <h6>${product.name}</h6>
                                <div class="d-flex align-items-center">
                                    <h6 class="price m-0 text-success">Rs. ${product.subPrice != '' && product.subPrice != undefined && product.subPrice != 0 && product.subPrice != product.price ? `<s style= "color: red;"><span style= "color: #167D7F;">${product.price}</span></s> ${product.subPrice}` : `${product.price}`}
                                    <a data-toggle="collapse" href="#collapseExample10" role="button" aria-expanded="false" aria-controls="collapseExample10" class="btn btn-success btn-sm ml-auto">+</a>
                                    <div class="collapse qty_show" id="collapseExample10">
                                        <div>
                                            <span class="ml-auto" href="#">
                                                <form id='myform${i}'class="cart-items-number d-flex" method='POST' action='#'>
                                                    <input type='button' value='-' onclick="addToCart('-${product.productId }')" class='qtyminus btn btn-success btn-sm' />
                                                    <input type='text' name='quantity' value='1' class='qty form-control' />
                                                    <input type='button' value='+' onclick="addToCart('+${product.productId }')"  class='qtyplus btn btn-success btn-sm' />
                                                </form>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div> `
    });
}


/* ============================================================================================================================= */
/*                                              Creating List of products using API                                              */
/* ============================================================================================================================= */

// homeApi()
function homeApi() {  
    url = "http://localhost:4000/"
    fetch(url+ 'listing-api/01452052300')
    .then(response => response.json()) 
    .then(json => {
        data(json)
    })
    .catch(err => 
        console.log(err)
    );
}

function data(data){
    // console.log(data)
    
    const productListSection = document.querySelector("#productRows")
    data.products.forEach((product,  i) => {
        productListSection.innerHTML += ` 
            <div class="col-6 col-md-3 mb-3">
                <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                    <div class="list-card-image">
                        <a href="/product-detail/${product.productId}" class="text-dark">
                            ${(product.promo != '' && product.promo != undefined ?  `<div class="member-plan position-absolute"><span class="badge m-3 badge-danger">${product.promo}%</span></div>` : `` ) }
                            <div class="p-3">
                                <img src="${product.image}" class="img-fluid item-img w-100 mb-3">
                                <h6>${product.name}</h6>
                                <div class="d-flex align-items-center">
                                    <h6 class="price m-0 text-success">Rs. ${product.subPrice != '' && product.subPrice != undefined && product.subPrice != 0 && product.subPrice != product.price ? `<s style= "color: red;"><span style= "color: #167D7F;">${product.price}</span></s> ${product.subPrice}` : `${product.price}`}
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div> `
    });
}

