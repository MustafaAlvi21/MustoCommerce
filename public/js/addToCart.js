function addToCart(itemId) {
    let product = {}
    p_color =  (typeof radioColorValue() != "undefined" && radioColorValue() != null ? radioColorValue() : "no color")
    p_size =  (typeof productSize() != "undefined" && productSize() != null ? productSize() : "no size")
    console.log(p_size);
    if(itemId[0] == "+"){
        id1 = itemId.split("+")
        product = {
            Id : id1[1], quantity: 1, p_color, p_size
        }
    } 
    if(itemId[0] == "-"){
        id1 = itemId.split("-")
        product = {
            Id : id1[1], quantity: -1, p_color, p_size
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
                a[key].p_color =  (typeof radioColorValue() != "undefined" && radioColorValue() != null ? radioColorValue() : "no color") 
                a[key].p_size =  (typeof productSize() != "undefined" && productSize() != null ? productSize() : "no size") 
                localStorage.setItem('product', JSON.stringify(a)); 
                document.getElementById("p_quantity0").value = a[key].quantity;
                // alert('Added to cart')   
                return true;
            }else{
                return true;
            }
        }
    }
    a.push(product)
    
    // document.getElementById("p_quantity0").value = ""
    return localStorage.setItem('product', JSON.stringify(a));            
}




function radioColorValue() {
    var ele = document.getElementsByName('color');
      
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked)  return ele[i].value
    }
}
function productSize() {
    var ele = document.getElementById('inputGroupSelect01');
console.log(ele); 
    if(ele == null) ele = null
    if(ele != null) ele = ele.value
    return ele;
}