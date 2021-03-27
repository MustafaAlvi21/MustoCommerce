/* ================================================================================================================================ */
/*                                                          H O M E   A P I                                                         */
/* ================================================================================================================================ */

homeApi()
function homeApi() {  
    // const url = "http://localhost:4000/"
    const url = "https://mustocommerce.herokuapp.com/"
    fetch(url+ 'home-api/01452052300')
    .then(response => response.json()) 
    .then(json => {
        console.log(json);
        data(json)
        categoriesList(json.categories)
    })
    .catch(err => 
        console.log(err)
    );
}
        
/* ================================================================================================================================ */
/*                               I t  r e t r i e v e s   t h e   d a t a   f o r   h o m e   p a g e                               */
/* ================================================================================================================================ */
function data(data) {
    let productRow = document.querySelector("#productRow1");
    data.products.forEach( (product, i) => {
        if(product.status ===  "active"){
            productRow.innerHTML += `
            <div class="col-6 col-md-3 mb-3">
                <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                    <div class="list-card-image">
                        <a href="/product-detail/${product.productId}" class="text-dark">
                            ${(product.promo != '' && product.promo != undefined ?  `<div class="member-plan position-absolute"><span class="badge m-3 badge-danger">${product.promo}%</span></div>` : `` ) }
                            
                            <div class="p-3">
                                <div style=" text-align: center;">
                                    <img src="${product.image}" class="img-fluid item-img w-100 mb-3" style="max-width: 200px;">
                                </div>
                                <h6>${product.name}</h6>
                                <div class="d-flex align-items-center">
                                    <h6 class="price m-0 text-success">Rs. ${product.subPrice != '' && product.subPrice != undefined && product.subPrice != 0 && product.subPrice != product.price ? `<s style= "color: red;"><span style= "color: #167D7F;">${product.price}</span></s> ${product.subPrice}` : `${product.price}`}</h6>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div> `
        }
    });
}

{/* <a data-toggle="collapse" href="#collapseExample2" role="button" aria-expanded="false" aria-controls="collapseExample2" class="btn btn-success btn-sm ml-auto" onclick="addToCart('+${product.productId }')" >+</a>
<div class="collapse qty_show" id="collapseExample2">
    <div> 
        <span class="ml-auto" href="#">
            <form id='myform'class="cart-items-number d-flex" method='POST' action='#'>
                <input type='button' value='-' onclick="addToCart('-${product.productId }')" class='qtyminus btn btn-success btn-sm' field='quantity' />
                <input type='text' name='quantity' value='1' class='qty form-control' />
                <input type='button' value='+' onclick="addToCart('+${product.productId }')"  class='qtyplus btn btn-success btn-sm' field='quantity' />
            </form>
        </span>
    </div>
</div> */}

// /* =============================================================================================================================== */
// /*                                                          S I G N    U P                                                         */
// /* =============================================================================================================================== */

//     /*                  Validating Phone                  */
//     function checkPhone(){
//         const phone = document.getElementsByName('phone')[0].value
//         phone.length != 12 ? document.getElementById("phone1").style.display = "block" : document.getElementById("phone1").style.display = "none" 
//         phone.slice(0,2) != "92" ? document.getElementById("phone2").style.display = "block" : document.getElementById("phone2").style.display = "none" 
//         phone.length != 12 ? document.getElementById("submitBtn").disabled = true : document.getElementById("submitBtn").disabled = false 
//         phone.slice(0,2) != "92" ? document.getElementById("submitBtn").disabled = true : document.getElementById("submitBtn").disabled = false 
//         phone.length == 12 && phone.slice(0,2) == "92" ? document.getElementById("phone3").style.display = "block" : document.getElementById("phone3").style.display = "none" 
//     }

//     /*             Validating Password Length             */
//     function passLength(){
//         const password = document.getElementsByName('password')[0].value
//         password.length < 6 ? document.getElementById("password1").style.display = "block" : document.getElementById("password1").style.display = "none" 
//         password.length < 6 ? document.getElementById("submitBtn").disabled = true  : document.getElementById("submitBtn").disabled = false  
//         password.length >= 6 ? document.getElementById("password2").style.display = "block" : document.getElementById("password2").style.display = "none" 
//     }

//     /*    Validating RE-Password and Password Matching    */
//     function matchPasssword(){
//         const password = document.getElementsByName('password')[0].value
//         const re_password = document.getElementsByName('re_password')[0].value
//         if (password == re_password) {
//             document.getElementById("msg2").style.display = "block";
//             document.getElementById("msg1").style.display = "none";
//             document.getElementById("submitBtn").disabled = false;
//         } else {
//             document.getElementById("msg1").style.display = "block";
//             document.getElementById("msg2").style.display = "none";
//             document.getElementById("submitBtn").disabled = true;
//         }    
//     }

//     /*                     Sign Up API                    */
//     function signUpForm(){
//         const name = document.getElementsByName('name')[0].value
//         const email = document.getElementsByName('email')[0].value
//         const phone = document.getElementsByName('phone')[0].value
//         const password = document.getElementsByName('password')[0].value
//         const re_password = document.getElementsByName('re_password')[0].value
//         const data = { name, email, phone, password, re_password }
//         fetch('http://localhost:4000/sign-up', {
//                 method: "POST",
//                 body: JSON.stringify(data),
//                 headers: {"Content-type": "application/json; charset=UTF-8"}
//             })
//             .then(response => response.json()) 
//             .then(json => {
//                 console.log(json)
//                 console.log(json.success_msg)                
//             })
//             .catch(err => 
//                 console.log(err)
//             );
//     } 
    
//     failMsgData = `
//         <div id="alert-danger" class="alert alert-danger alert-dismissible fade show" role="alert">
//             <center>
//                 <strong> ${json.errors[0].msg} </strong>   
//             </center> 
//             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//             </button>
//         </div>`

//     if(typeof json.errors != 'undefined' && json.errors[0].msg != ''){
//         document.getElementById("msgSection").innerHTML += failMsgData

//         const email = document.getElementsByName('email')[0].value = "";
//         const password = document.getElementsByName('password')[0].value = "";
//         const re_password = document.getElementsByName('re_password')[0].value = "";
//         document.getElementById("password2").style.display = "none"
//         document.getElementById("phone3").style.display = "none"
//         document.getElementById("msg2").style.display = "none";
//         setTimeout(() => {
//             document.getElementById("alert-danger").style.display = "none"
//         }, 3000);
//     }
//     successMsgData = `
//         <div id="alert-success" class="alert alert-success alert-dismissible fade show" role="alert">
//             <center>
//                 <strong> ${json.success_msg} </strong> 
//             </center> 
//             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//             </button>
//         </div> `

//     if(typeof json.success_msg != 'undefined' && json.success_msg != ''){ 

//         document.getElementById("msgSection").innerHTML += successMsgData

//         const name = document.getElementsByName('name')[0].value = "";
//         const email = document.getElementsByName('email')[0].value = "";
//         const phone = document.getElementsByName('phone')[0].value = "";
//         const password = document.getElementsByName('password')[0].value = "";
//         const re_password = document.getElementsByName('re_password')[0].value = "";
//         document.getElementById("password2").style.display = "none"
//         document.getElementById("phone3").style.display = "none"
//         document.getElementById("msg2").style.display = "none";

//         setTimeout(() => {
//             document.getElementById("alert-success").style.display = "none"
//         }, 3000);

// }