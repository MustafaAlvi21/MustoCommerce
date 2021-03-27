const express  = require('express')
const router  = express.Router();
const categoryDataModule = require('../../models/categories');
const sha256 = require('sha256')

/* ---------------------------------- */
/*           Add category             */
/* ---------------------------------- */
router.post('/add-category', (req, res) => {
    categoryId = sha256(JSON.stringify(Date.now()))
    subName = (req.body.name).split(' ').join('-').toLowerCase(); 
    new categoryDataModule({
        categoryId: categoryId,
        name : req.body.name,
        subName : subName
    }).save().then(()=> {
        return res.send("category added")
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
    categoryDataModule.updateOne({categoryId : req.params.categoryId}, {name : req.body.name, subName : subName}).exec().then((data) => {
        return res.send("category updated")
    }).catch((err) => {
        console.log(err);
        if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    });
})

/* ---------------------------------- */
/*         Remove category            */
/* ---------------------------------- */
router.get('/remove-category/:categoryId', (req, res) => {
    
    categoryDataModule.deleteOne({categoryId : req.params.categoryId}).then(()=> {
        return res.send("category deleted")
    }).catch(err => {
        console.log(err);
        // if(err.code === 11000) return res.json({"error code": err.code, msg: "Category is already added..."})
        return res.send(err)
    })
})


module.exports = router