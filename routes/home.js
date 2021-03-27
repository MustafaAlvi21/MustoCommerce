const express  = require('express');
const router  = express.Router();
const productDataModule = require ('../models/products')
const categoriesDataModule = require ('../models/categories.js')


/* ---------------------------------- */
/*           Render Home              */
/* ---------------------------------- */
router.get('/', async(req, res) => {

    //       C a t e g o r i e s   
    categories = await categoriesDataModule.find({status : "active"}).then((data) => {
        console.log("done categories");
        return data
    }).catch((err) => {
        return res.send(err)
    });
    
    //       F e a t u r e   P r o d u c t s       
    featureProduct = await productDataModule.aggregate([ { $match: {featureProduct: "true"}}]).limit(5).then( async(data) => {
        // console.log(" << featureProduct >>");
        // console.log(data);

        data.forEach( (element, i) => {
            img = (function() {
                if ( element.cover1Image != null && element.cover1ImageType != null) {
                    return `data:${element.cover1ImageType};charset=utf-8;base64,${element.cover1Image.toString('base64')}`
                }
            })();
            data[i].image1 = img 
            img2 = (function() {
                if ( element.cover2Image != null && element.cover2ImageType != null) {
                    return `data:${element.cover2ImageType};charset=utf-8;base64,${element.cover2Image.toString('base64')}`
                }
            })();
            data[i].image2 = img2 
            img3 = (function() {
                if ( element.cover3Image != null && element.cover3ImageType != null) {
                    return `data:${element.cover3ImageType};charset=utf-8;base64,${element.cover3Image.toString('base64')}`
                }
            })();
            data[i].image3 = img3 
        });

        
        return data;
    }).catch(err => {
        console.log(err);
        return res.send(err)
    })

    //        P i c k   t o d a y   s e c t i o n      
    { products = await productDataModule.aggregate([{ $sample: { size: 12 }},{ $match: {status:"active"}}]).then( async(data) => {
        if(data){
            img = (function() {
                if ( data[0].cover1Image != null && data[0].cover1ImageType != null) {
                    return `data:${data[0].cover1ImageType};charset=utf-8;base64,${data[0].cover1Image.toString('base64')}`
                }
            })(); 
            data[0].image = img 
            return data
        }     
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

    return res.render('home', { featureProduct: featureProduct, categories: categories, products: products, loginUser: typeof req.user != "undefined" ? req.user : undefined })
})

/* ---------------------------------- */
/*             Home API               */
/* ---------------------------------- */
router.get('/home-api/01452052300', async(req, res) => {

    //        P i c k   t o d a y   s e c t i o n      
    { products = await productDataModule.aggregate([{ $sample: { size: 12 }},{ $match: {status:"active"}}]).then( async(data) => {
        if(data){
            img = (function() {
                if ( data[0].cover1Image != null && data[0].cover1ImageType != null) {
                    return `data:${data[0].cover1ImageType};charset=utf-8;base64,${data[0].cover1Image.toString('base64')}`
                }
            })(); 
            data[0].image = img 
            return data
        }     
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

    return res.json({title: "Musto Commerce - Home", categories: categories, products: products, loginUser: typeof req.user != "undefined" ? req.user : undefined})
})


module.exports = router;