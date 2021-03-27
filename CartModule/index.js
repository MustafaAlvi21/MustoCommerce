class cart {
    constructor(productId, productImg, productName, productPrice, productQuantity){
        this.productId = productId;
        this.productImg = productImg;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
    }
    static productsInCart = []

    addToCart(){
        console.log('Product is added to cart');
        return {
            productId: this.productId,
            productImg: this.productImg,
            productName: this.productName,
            subTotal: this.productPrice,
            productQuantity: this.productQuantity,
            productTotal: this.productQuantity * this.productPrice,
        }
    }

    static removeProduct(id){
        cart.productsInCart.splice(id,1)
        cart.showInCart()
    }

    static showInCart(index){
        console.log(`In Cart Products`);
        console.log(cart.productsInCart);
        return cart.productsInCart
    }

    static updateQuantity(id, quantity){
        this.productsInCart[id].productQuantity = quantity
        this.productsInCart[id].productTotal = this.productsInCart[id].productQuantity * this.productsInCart[id].subTotal
        cart.showInCart()
    }
};



/*  =============================================================================== */

for (let i = 0; i < 3; i++) {
    product = new cart(i+1, `img${i}`, `Shirt${i}`, 1000+i, 2+i,) 
    cart.productsInCart.push(product.addToCart())
}

// cart.showInCart(0)
// cart.removeProduct(1)
// cart.updateQuantity(0,8)


module.exports = cart;