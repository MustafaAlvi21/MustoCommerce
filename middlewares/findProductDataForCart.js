module.exports = { 
    findProductDataForCart: async function(req, res, next) {
        const cartDataModel = require('../models/cart')
        const productDataModel = require('../models/products')
        
        console.log('data -=-> 1' )
        let cartData = [];
        await cartDataModel.find({userId : req.user._id}, (err, data) => {        
            console.log('length =>>> ' + data.length)
            if(data.length == 0){
                console.log('Yay charlra but nahi chalna tha')
                res.locals.cart =  []
                return next();
            }
            console.log('data -=-> 2 ' + data)
            arrayOfProductIds = []
            data[0].product.forEach(element => {
               arrayOfProductIds.push(element.productId) 
            });
            // console.log(arrayOfProductIds)
            
            findProductData(data)
             async function findProductData(){
                // console.log('Size 3=> ' + data[0].product[1].quantity)
                 for( var index = 0; index <= arrayOfProductIds.length; index++) {
                    item_id = arrayOfProductIds[index]
                    // console.log('item_id => ' + item_id)
                    if (index >= arrayOfProductIds.length ){
                        res.locals.cart =  cartData 
                        // console.log('cartData =>>123 ' + cartData)
                        console.log('middleware complete')            
                        next();
                        
                    } 
                    if(index < arrayOfProductIds.length) {
                        console.log('index ' + index)
                            await productDataModel.findById({_id:  data[0].product[index].productId}, (err, productData) => {
                                if(err) throw err;
                                if(productData){
                                    console.log('cartData.length ' + index  + ' => ' )
                                    // console.log(productData)
                                    cartData.push(productData)
                                    // console.log('cartData push # ' + index  + ' => ' + cartData.length )
                                    // res.json(cartData)
                                }
                            })    
                    } // end of if else (i.e foreach loop child)
                }; // end of froeach loop
            }    
        })
    }
}