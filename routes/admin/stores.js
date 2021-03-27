const express  = require('express')
const router  = express.Router();
const storeDataModule = require('../../models/store');

/* ---------------------------------- */
/*              Add store             */
/* ---------------------------------- */
router.get('/add-store', (req,res) => {
        return res.render();
});

router.post('/add-store',  (req,res) => {
    const contact = req.body.contact;
     new storeDataModule({
        storeName : req.body.storeName, 
        owner : req.body.owner, 
        contact : contact, 
        address1 : req.body.address1, 
        city : req.body.city,
    }).save().then((result) => {
        return res.json({"res": result});
    }).catch((err) => {
        console.log(err);
        return res.send(err);
    });
});


module.exports = router;