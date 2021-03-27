const express  = require('express')
const router  = express.Router();
// const cartDataModel = require('../Extras/models/cart');
const productDataModule = require ('../models/products');
const categoriesDataModule = require ('../models/categories');
// const { ensureAuthenticated } = require('../config/auth')
// const {verifyProfile} = require('../middlewares/verifyProfile'); 
// const {findProductDataForCart} = require('../middlewares/findProductDataForCart'); // this module is only for cart page
// const cartClass = require('../CartModule/index');



/* ---------------------------------- */
/*            Product list            */
/* ---------------------------------- */
router.get('/listing', async (req, res) => {

    { products = await productDataModule.aggregate([{ $match: {status:"active"}}]).then( async(data) => {
        return data    
    }).catch( (err) => {
        console.log(err);
        return res.send(err)
    })
        products.forEach( (element, i) => {
            img = (function() {
                if ( element.cover1Image != null && element.cover1ImageType != null) {
                    return `data:${element.cover1ImageType};charset=utf-8;base64,${element.cover1Image.toString('base64')}`
                }
            })();
            products[i].image = img 
        });
    }

    return res.render('listing', { products: products, loginUser: typeof req.user != undefined ? req.user : undefined})
})


/* ---------------------------------- */
/*        Product By Category         */
/* ---------------------------------- */
router.get("/listing/:catrgoryName", async (req, res) => {
    const catrgoryName = req.params.catrgoryName;
    catrgory = await categoriesDataModule.findOne({subName : catrgoryName}).then((result) => {
        return result
    }).catch((err) => {
        return res.send(err)
    });
    const products = await productDataModule.find({categoryId: catrgory.categoryId, status: "active"}).then(data => { 
        return data
    }).catch(err => {
        console.log(err);
        res.send(err)
    });

    return res.render("productsByCategory", { catrgoryName: "catrgoryName", products: products, loginUser: typeof req.user != undefined ? req.user : undefined})
});

/* ---------------------------------- */
/*          Products List API         */
/* ---------------------------------- */
router.get('/listing-api/01452052300', async(req, res) => {

    { products = await productDataModule.aggregate([{ $match: {status:"active"}}]).then( async(data) => {
            return data    
        }).catch( (err) => {
            console.log(err);
            return res.send(err)
        })

        products.forEach( (element, i) => {
            img = (function() {
                if ( element.cover1Image != null && element.cover1ImageType != null) {
                    return `data:${element.cover1ImageType};charset=utf-8;base64,${element.cover1Image.toString('base64')}`
                }
            })();
            products[i].image = img 
        });
    }

    return res.json({title: "Musto Commerce - Products", products: products, loginUser: typeof req.user != "undefined" ? req.user : undefined})
})


/* ---------------------------------- */
/*      Products List Filter API      */
/* ---------------------------------- */
router.post('/listing-api/014520523001', async(req, res) => {

    // For checking if a string is blank, null or undefined:
    // (!str || /^\s*$/.test(str))

    sortBy = "";
    console.log(req.body.MinPrice);
    console.log(req.body.MaxPrice);
    MinPrice =  (!req.body.MinPrice || /^\s*$/.test(req.body.MinPrice)) ? 0 : req.body.MinPrice ;
    MaxPrice =  (!req.body.MaxPrice || /^\s*$/.test(req.body.MaxPrice)) ? 1000000 : req.body.MaxPrice ;
    if( "CostHigh" == req.body.sortBy)  sortBy = "desc";
    if( "CostLow" == req.body.sortBy)  sortBy = "asc";
    if( "MostPopular" == req.body.sortBy)  sortBy = "MostPopular";

    console.log(MinPrice);
    console.log(MaxPrice);
    // find( { price: { $gte: 2999, $lte: 5000 }} ).count()

    { products = await productDataModule.aggregate([{ 
        $match: {
            status:"active",
            subPrice: { $gte: parseInt(MinPrice), $lte: parseInt(MaxPrice) }
        }
    }]).sort({
        subPrice: sortBy
    }).exec().then( async(data) => { return data })
             .catch( (err) => {
                console.log(err);
                return res.send(err)
            })

        products.forEach( (element, i) => {
            img = (function() {
                if ( element.cover1Image != null && element.cover1ImageType != null) {
                    return `data:${element.cover1ImageType};charset=utf-8;base64,${element.cover1Image.toString('base64')}`
                }
            })();
            products[i].image = img 
        });
    }


    return res.json({title: "Musto Commerce - Products", products: products, loginUser: typeof req.user != "undefined" ? req.user : undefined})
})

/* ---------------------------------- */
/*         Product Details            */
/* ---------------------------------- */
router.get('/product-detail/:productId', async (req, res) => {
    proData = await productDataModule.findOne({productId : req.params.productId, status : "active"}).then((data) => {
        console.log(data.specs)
        return data
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });    

    relatedProducts = await productDataModule.find({ productId: { $ne : req.params.productId }, categoryId : proData.categoryId, status : "active"}).limit(5).then((result) => {
        console.log('  <<<<<  tempProduct_id 1  >>>>>  ')
        console.log(result.length)
        return result
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });

    /* - - - -  R e c o m e n d e d   P r o d u c t s   - - - - */  
    requiredRecomendedItems = 1 + (8 - relatedProducts.length)      
    console.log("requiredRecomendedItems " + requiredRecomendedItems)
   { recomendedItems = await productDataModule.aggregate([{ $sample: { size: requiredRecomendedItems }},{ $match: {status:"active", productId: { $ne : req.params.productId }}}]).then( async(data) => {

            // console.log('  <<<<<  tempProduct_id 2  >>>>>  ')
            console.log(data.length)
            data.forEach((item, i) => {
                img = (function() {
                    if ( item.cover1Image != null && item.cover1ImageType != null) {
                        return `data:${item.cover1ImageType};charset=utf-8;base64,${item.cover1Image.toString('base64')}`
                    }
                })(); 
                data[i].image = img   
            });
            return data

            }).catch( (err) => {
            console.log(err);
            return res.send(err)
        })
   }
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    return res.render('product_details', {productDetails: proData, relatedProducts: relatedProducts, recomendedItems: recomendedItems, loginUser: typeof req.user != undefined ? req.user : undefined })
});


//  /*---------------------------------------------------------------*/

//  var allDbRequest = [];
//  allDbRequest.push(db.collection("users").findOne({}));
//  allDbRequest.push(db.collection("location").findOne({}));
//  Promise.all(allDbRequest).then(function (results) {
//      console.log(results);//result will be array which contains each promise response
//  }).catch(function (err) {
//       console.log(err)//failure callback(if any one request got rejected)
//  });

// /*---------------------------------------------------------------*/

// }).catch(function (err) {})

module.exports = router;