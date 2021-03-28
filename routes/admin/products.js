const express  = require('express')
const router  = express.Router();
const productDataModule = require('../../models/products');
const categoryDataModule = require('../../models/categories');
const storesDataModule = require('../../models/store');
const sha256 = require('sha256');


/* ---------------------------------- */
/*           ALL products             */
/* ---------------------------------- */
router.get("/products", async (req, res) => {
    try {
        products = await productDataModule.find({})
        return res.render("admin/products", { title: "Admin Product", data: products, loginUser: typeof req.user != "undefined" ? req.user : "guest", layout: "admin/adminLayout/layout" })
    } catch (error) {
        return res.json({ "error": error })
    }
});


/* ---------------------------------- */
/*           Add products             */
/* ---------------------------------- */
router.get('/add-products', async (req, res) => {
    let categories =  await categoryDataModule.find({}).then((data) => {
        console.log(data);
        return data
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });
    let stores =  await storesDataModule.find({}).then((data) => {
        console.log(data);
        return data
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });
    
    return res.render('admin/add-products-admin', { title: "Admin-Add Product", data: categories, stores: stores, loginUser: typeof req.user != "undefined" ? req.user : undefined, layout: "admin/adminLayout/layout"})
})

router.post('/add-product', async(req, res)=> {
    // subPrice = ( parseInt(req.body.price) /100) * parseInt(req.body.promo) 
    productColors =  req.body.productColors.split(",")
    productSizes =  req.body.productSizes.split(",")
    const book = new productDataModule({
        productId : sha256(JSON.stringify(Date.now())),
        name : req.body.name,
        status : 'active',
        price : req.body.price,
        subPrice : req.body.subPrice,
        productColors : productColors,
        productSizes : productSizes,
        categoryId : req.body.categoryId,
        storeId : req.body.storeId,
        brand : req.body.brand != undefined ? req.body.brand : "---",
        specs : req.body.specs,
        promo : req.body.promo != undefined ? req.body.promo : "---",
    })
      saveCover(book, req.body.cover1, req.body.cover2, req.body.cover3, req.body.cover4)
        try {
            const newBook = await book.save()
            req.flash("success_msg", "Product added successfully")
            return res.redirect('/admin/add-products')
        } catch(error) {
            console.log(err);
            return res.send(err)
        }
    
        function saveCover(book, cover1Encoded, cover2Encoded, cover3Encoded, cover4Encoded) {
          if (cover1Encoded == null || cover1Encoded  == '') return
          const cover1 = JSON.parse(cover1Encoded)
          console.log('yes 1')
          if (cover1 != null ) {
            console.log('yes 2')
            book.cover1Image = new Buffer.from(cover1.data, 'base64')
            book.cover1ImageType = cover1.type
          }
          
          if (cover2Encoded == null  || cover2Encoded  == '') return
          const cover2 = JSON.parse(cover2Encoded)
          console.log('yes 11')
          if (cover2 != null ) {
            console.log('yes 22')
            book.cover2Image = new Buffer.from(cover2.data, 'base64')
            book.cover2ImageType = cover2.type
          }
    
          if (cover3Encoded == null || cover3Encoded  == '') return
          const cover3 = JSON.parse(cover3Encoded)
          console.log('yes 111')
          if (cover3 != null ) {
            console.log('yes 222')
            book.cover3Image = new Buffer.from(cover3.data, 'base64')
            book.cover3ImageType = cover3.type
          }
    
          if (cover4Encoded == null ||  cover4Encoded  == '') return
          const cover4 = JSON.parse(cover4Encoded)
          console.log('yes 1111')
          if (cover4 != null ) {
            console.log('yes 2222')
            book.cover4Image = new Buffer.from(cover4.data, 'base64')
            book.cover4ImageType = cover4.type
          }
        }
}) 


/* ---------------------------------- */
/*         Update products            */
/* ---------------------------------- */
router.get('/update-products/:productId', async (req, res) => {
    categories = await categoryDataModule.find({}).then((data) => {
        console.log("done categories");
        return data
    }).catch((err) => {
        return res.send(err)
    });
    products = await productDataModule.findOne({productId: req.params.productId}).then((data) => {
        console.log("done products");
        return data
    }).catch((err) => {
        return res.send(err)
    });
    return res.render('update-products-admin', {title: "Musto Commerce - Home", categories: categories, products: products, loginUser: undefined})
})

router.post('/update-product/:productId', (req, res) => {

    data = {};
    console.log("req.body.name > "+ req.body.name);
    console.log(typeof req.body.name);
    if(req.body.name != '' ){
        data.name = req.body.name;
    }
    if(req.body.price !== '' && req.body.price !== undefined){
        data.price = req.body.price;
    }
    if(req.body.subPrice !== '' && req.body.subPrice !== undefined){
        data.subPrice = req.body.subPrice;
    }
    if(req.body.categoryId !== '' && req.body.categoryId !== undefined){
        data.categoryId = req.body.categoryId;
    }
    if(req.body.brand !== '' && req.body.brand !== undefined){
        data.brand = req.body.brand;
    }
    if(req.body.specs !== '' && req.body.specs !== undefined){
        data.specs = req.body.specs;
    }
    if(req.body.promo !== '' && req.body.promo !== undefined){
        data.promo = req.body.promo;
    } 

    console.log(req.params.productId);
    console.log(data);
    productDataModule.updateOne({productId : req.params.productId}, data).exec().then((data) => {
        
        return res.json({"msg":"product updated", data })
    }).catch((err) => {
        console.log(err);
        if(err.code === 11000) return res.json({"error code": err.code, msg: "product is already added..."})
        return res.send(err)
    });
})


/* ---------------------------------- */
/*         Remove products            */
/* ---------------------------------- */
router.get('/remove-product/:productId', (req, res) => {
    console.log("req.params.productId");
    console.log(req.params.productId);
    productDataModule.deleteOne({productId : req.params.productId}).then(()=> {
        return res.send("product deleted")
    }).catch(err => {
        console.log(err);
        return res.send(err)
    })
})


module.exports = router