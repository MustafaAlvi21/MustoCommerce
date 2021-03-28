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


router.post('/add-category', (req, res) => {
    categoryId = sha256(JSON.stringify(Date.now()))
    subName = (req.body.name).split(' ').join('-').toLowerCase(); 
    new categoryDataModule({
        categoryId: categoryId,
        name : req.body.name,
        subName : subName
    }).save().then(()=> {
        return res.redirect("/admin/categories")
    }).catch(err => {
        console.log(err);
        if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    })
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