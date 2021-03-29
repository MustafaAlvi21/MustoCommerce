const express  = require('express')
const router  = express.Router();
const storeDataModule = require('../../models/store');

/* ---------------------------------- */
/*              Add store             */
/* ---------------------------------- */
router.get('/stores', async (req,res) => {
        try {
            stores = await storeDataModule.find({})
            return res.render("admin/stores", { title: "Admin Stores", data: stores, loginUser: typeof req.user != "undefined" ? req.user: "guest", layout: "admin/adminLayout/layout" });
        } catch (error) {
            return res.send(error)
        }
});

router.post('/add-store', (req,res) => {
     new storeDataModule({
        storeName : req.body.storeName, 
        owner : req.body.owner, 
        address1 : req.body.address1, 
        contact : req.body.contact, 
        status: "active"
    }).save().then((result) => {
        req.flash("success_msg", "Store added successfully")
        return res.redirect("/admin/stores")
    }).catch((err) => {
        console.log(err);
        return res.send(err);
    });
});


/* ---------------------------------- */
/*           Update stores            */
/* ---------------------------------- */
router.post('/update-store/:_id', (req, res) => {
    // subName = (req.body.name).split(' ').join('-').toLowerCase(); 
    // console.log(req.params.categoryId)
    console.log(req.body.storeName)
    // console.log(subName)
    storeDataModule.updateOne({_id : req.params._id}, { storeName : req.body.storeName }).exec().then((data) => {
        // return res.send("category updated")
        req.flash("success_msg", "store updated")
        return res.redirect("/admin/stores")
    }).catch((err) => {
        console.log(err);
        if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    });
})

/* ---------------------------------- */
/*           Remove store             */
/* ---------------------------------- */
router.get('/update-store-status/:_id/:status', (req, res) => {
    
    storeDataModule.updateOne({_id : req.params._id}, {status : req.params.status }).exec().then((data) => {
        // return res.send("category updated")
        req.flash("success_msg", "Store status updated")
        return res.redirect("/admin/stores")
    }).catch(err => {
        console.log(err);
        // if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    })
})

module.exports = router;