// function addToCart(itemId, e) {
//     let product = {}
//     if(itemId[0] == "+"){
//         id1 = itemId.split("+")
//         product = {
//             Id : id1[1], quantity: 1
//         }
//     } 
//     if(itemId[0] == "-"){
//         id1 = itemId.split("-")
//         product = {
//             Id : id1[1], quantity: -1
//         }
//     } 

//     // console.log(product)
//     if (localStorage.getItem("product") === null) { a = [product]; return localStorage.setItem('product', JSON.stringify(a)); }
//     a =  JSON.parse(localStorage.getItem("product"))
//     temp = itemId.toString
//     a = JSON.parse(localStorage.getItem("product"))
//     for (let [key, value] of Object.entries(a)) {
//         if(value.Id == product.Id ){
//             if(parseInt(value.quantity + product.quantity) >= 0){
//                 a[key].quantity = parseInt(value.quantity + product.quantity)
//                 localStorage.setItem('product', JSON.stringify(a)); 
//                 return updateProductQuantity();
//             }else{
//                 return updateProductQuantity();
//             }
//         }
//     }
//     a.push(product)
//     return localStorage.setItem('product', JSON.stringify(a));            
// }



function addToCart(itemId) {
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
            // alert("value.quantity" + value.quantity)
            if(parseInt(value.quantity + product.quantity) >= 0){
                // console.log("found")
                // console.log(key)
                a[key].quantity = parseInt(value.quantity + product.quantity)
                localStorage.setItem('product', JSON.stringify(a)); 
                // alert('Added to cart')   
                return true;
            }else{
                return true;
            }
        }
    }
    a.push(product)
    return localStorage.setItem('product', JSON.stringify(a));            
}