const express  = require('express')
const router  = express.Router();
// const cartDataModel = require('../Extras/models/cart');
const productDataModule = require('../models/products');
const categoriesDataModule = require('../models/categories');
const orderDataModule = require('../models/orders');
const sha256 = require('sha256');
const { json } = require('body-parser');
// const { ensureAuthenticated } = require('../config/auth')
// const {verifyProfile} = require('../middlewares/verifyProfile'); 
// const {findProductDataForCart} = require('../middlewares/findProductDataForCart'); // this module is only for cart page


/* ---------------------------------- */
/*                 Cart               */
/* ---------------------------------- */
router.get('/cart', async(req, res) => {
    return res.render('cart', {loginUser: typeof req.user != undefined ? req.user : undefined})
})

/* ---------------------------------- */
/*              Cart API              */
/* ---------------------------------- */
router.post('/find-cart-data', async(req, res) => {
    console.log(req.body)
    products = await productDataModule.aggregate([{
        $match: {
            productId: {
            $in: [...req.body]
          }
        }
      },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: 'categoryId',
                as: 'categoryDetails'
            }
        }, 
    ]).then((data) => {
            console.log("done products");
            return data
        }).catch((err) => {
            return res.send(err)
        });
        products.forEach( (element, i) => {
            img = (function() {
                if ( element.cover1Image != null && element.cover1ImageType != null) {
                  return `data:${element.cover1ImageType};charset=utf-8;base64,${element.cover1Image.toString('base64')}`
                }
            })();
            products[i].image = img 
        });
    return res.json(products)
    
})

/* ---------------------------------- */
/*            Update Cart             */
/* ---------------------------------- */
// router.put('/update-cart/:id', (req, res) => {
//     product = req.body.product
//     cartDataModel.updateOne(
//         { _id: req.params.id },
//      )
// })

/* ---------------------------------- */
/*          Place Order API           */
/* ---------------------------------- */
router.post('/place-order-api-10590058', async (req, res) => {
    // [products, user, location] = await req.body
   
    const userId = sha256(JSON.stringify(Date.now()))
    let UserDetails = req.body.UserDetails;              
    let ProductList = req.body.ProductList;              
    let paymentMethod = req.body.paymentMethod;
    // let orderTracker = `ODR-${Date.now()}`
    let totalCost = 0;
    let userData = "";
    let data = [...ProductList];
    productsIDs = data.map(obj => { return obj.Id });

    productsData = await productDataModule.find({productId: {$in : productsIDs }}).then(data => {
        return data
    }).catch(err => {
        console.log(err);
        return res.json({error: err})
    })

    productsData.forEach((element,i) => {
        totalCost += element.subPrice * ProductList[i].quantity
    });

    if(typeof req.user != "undefined"){
        // user.userId = req.user._id
        UserDetails.userId = req.user._id;
        userData = UserDetails;
    } else {
        UserDetails.userId = "guest-"+ userId;
        userData = UserDetails;
    }
    
    console.log(userData);
    
    let order = await new orderDataModule({
        user : userData,
        products : productsData, 
        paymentMethod : paymentMethod, 
        totalPrice : totalCost
    }).save().then(data => {
        console.log("Order Placed")
        return res.json({msg: "Order Placed.", success: true, orderId: data.orderId})
    }).catch(err => {
        console.log(err);
        return res.json({msg: err, success: false})
    })

})

router.get('/order-success/:orderId', async (req, res) => {
    console.log("working 1");
    data =  await orderDataModule.findOne({ orderId : req.params.orderId}).then( data => {
        console.log("working 2");
        console.log("working end");
        return data
    }).catch(err => {
        console.log(err);
        return res.send(err)
    })

    return res.render('order_successful', { orderId: data.orderId, loginUser: typeof req.user != undefined ? req.user : undefined })

})

module.exports = router;