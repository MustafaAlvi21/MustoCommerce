const express = require('express')
const router  = express.Router()
const productDataModel = require('../models/products');
const categoryDataModel = require('../models/categories');


/*   ------------------------------------   */
/*                  Search                  */
/*   ------------------------------------   */
router.post('/search', async (req, res) => {
    let productData;
    result = [];
    console.log('\n')
    console.log('<<  S E A R C H  >> ')
    console.log('search = ' + req.body.search)

    typeOfSearch = parseInt(req.body.search)
    data =  await productDataModel.find({
        $and:[
            {status: 'active'},
            {$or:[
                {"productId" :  req.body.search},
                {"name" :  { $regex: req.body.search, $options: "i" }},
                {"brand" :  { $regex: req.body.search, $options: "i" }},
                // {"category" :  { $regex: req.body.search, $options: "i" }},
                {"promo" :  { $regex: req.body.search, $options: "i" }},
                // {"price" :  { $regex: req.body.search, $options: "i" }},
                // {"subPrice" :  { $regex: parseInt(req.body.search), $options: "i" }},
            ]} 
        ]}).then((data) => {
            console.log('\n')
                console.log('<<  P r o d u c t  >> ')
                console.log('data => ' + data.length)
                // result[result.length] =  data
                // return res.render('search', {data, loginUser: typeof req.user != "undefined"? req.user : "undefined" })
                // return res.redirect('/')
                return data;
        }).catch((err) => {
            console.log(err);
            res.send(err)
        })

        /* - - - -  R e c o m e n d e d   P r o d u c t s   - - - - */  
        requiredRecomendedItems = 8     
        console.log("requiredRecomendedItems " + requiredRecomendedItems)
        { 
            recomendedItems = await productDataModel.aggregate([{ $sample: { size: requiredRecomendedItems }},{ $match: {status:"active", productId: { $ne : req.params.productId }}}]).then( async(data) => {
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
    
        return res.render('search', {data, recomendedItems, searchItem: req.body.search, loginUser: typeof req.user != undefined ? req.user : undefined })
})

    

module.exports = router;