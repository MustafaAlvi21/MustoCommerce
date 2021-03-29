const express  = require('express')
const router  = express.Router();
const categoryDataModule = require('../../models/categories');
const sha256 = require('sha256')

/* ---------------------------------- */
/*           Add category             */
/* ---------------------------------- */

router.get("/categories", async (req, res) => {
    try {
        categories = await categoryDataModule.find({});
        return res.render('admin/categories', { title: "Admin Categories", data: categories, loginUser: typeof req.user != "undefined" ? req.user: "guest", layout: "admin/adminLayout/layout" });
    } catch (error) {
        return res.json({ "error": error });
    }
});


router.post('/add-category', async (req, res) => {
    categoryId = sha256(JSON.stringify(Date.now()))
    subName = (req.body.name).split(' ').join('-').toLowerCase(); 
    const category = new categoryDataModule({
        categoryId: categoryId,
        name : req.body.name,
        subName : subName
    })
    
    saveCover(category, req.body.cover1)
    try {
        const newBook = await category.save()
        req.flash("success_msg", "Category added successfully")
        return res.redirect("/admin/categories")
    } catch(err) {
        console.log(err);
        return res.send(err)
    }

    function saveCover(book, cover1Encoded) {
      if (cover1Encoded == null || cover1Encoded  == '') return
      const cover1 = JSON.parse(cover1Encoded)
      console.log('yes 1')
      if (cover1 != null ) {
        console.log('yes 2')
        book.cover1Image = new Buffer.from(cover1.data, 'base64')
        book.cover1ImageType = cover1.type
      }
    }

})


/* ---------------------------------- */
/*         Update category            */
/* ---------------------------------- */
router.post('/update-category/:categoryId', (req, res) => {
    subName = (req.body.name).split(' ').join('-').toLowerCase(); 
    console.log(req.params.categoryId)
    console.log(req.body.name)
    console.log(subName)
    categoryDataModule.updateOne({categoryId : req.params.categoryId}, {name : req.body.name, subName : subName}).exec().then((data) => {
        // return res.send("category updated")
        req.flash("success_msg", "category updated")
        return res.redirect("/admin/categories")
    }).catch((err) => {
        console.log(err);
        if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    });
})

/* ---------------------------------- */
/*         Remove category            */
/* ---------------------------------- */
router.get('/update-category-status/:categoryId/:status', (req, res) => {
    
    categoryDataModule.updateOne({categoryId : req.params.categoryId}, {status : req.params.status }).exec().then((data) => {
        // return res.send("category updated")
        req.flash("success_msg", "category status updated")
        return res.redirect("/admin/categories")
    }).catch(err => {
        console.log(err);
        // if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    })
})


module.exports = router