const router = require ('express').Router();
const orderDatModel = require('../models/orders');
const { ensureAuthenticated } = require('../config/auth');
const { isVerified } = require('../middlewares/isVerifiedAccount');



/* --------------------------------------------- */
/*                   My Orders                   */
/* --------------------------------------------- */
router.get('/my-orders', ensureAuthenticated, isVerified, async (req, res) => {
    userId = req.user._id.toString();
console.log(userId);
    await orderDatModel.find({ "user.userId" : userId }).then((data) => {
        console.log(data)
        return res.render("my_order", {data, loginUser: typeof req.user != "undefined"? req.user : undefined})
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });

});


/* --------------------------------------------- */
/*              My Orders By Status              */
/* --------------------------------------------- */
router.get('/my-orders/:status', ensureAuthenticated, isVerified, async (req, res) => {
    status = req.params.status;
    userId = req.user.userId;

    if (status == "Progress") {
        await orderDatModel.find({ "user.userId" : userId, status: {$in: ["Pending", "Processing", "Shipping"]} }).then((data) => {
            console.log(data)
            return res.render("my_order_by_status", {data, status,  loginUser: typeof req.user != "undefined" ? req.user : undefined})
        }).catch((err) => {
            console.log(err);
            return res.send(err)
        });
            
    } else if (status == "Completed" && status == "Delivered") {
        await orderDatModel.find({ "user.userId" : userId, status: {$in: [ "Completed", "Delivered" ]} }).then((data) => {
            console.log(data)
            return res.render("my_order_by_status", {data, status,  loginUser: typeof req.user != "undefined" ? req.user : undefined})
        }).catch((err) => {
            console.log(err);
            return res.send(err)
        });
    } else{
        await orderDatModel.find({ "user.userId" : userId, status: status }).then((data) => {
            console.log(data)
            return res.render("my_order_by_status", {data, status,  loginUser: typeof req.user != "undefined" ? req.user : undefined})
        }).catch((err) => {
            console.log(err);
            return res.send(err)
        });
    }

});



/* --------------------------------------------- */
/*                My Order Detail                */
/* --------------------------------------------- */
router.get('/order/:orderId', ensureAuthenticated, isVerified, async (req, res) => {
    // userId = req.user.userId;
    orderId = req.params.orderId;

    await orderDatModel.find({ orderId : orderId, }).then((data) => {

        data[0].products.forEach((item, i) => {
            img = (function() {
                if ( item.cover1Image != null && item.cover1ImageType != null) {
                    return `data:${item.cover1ImageType};charset=utf-8;base64,${item.cover1Image.toString('base64')}`
                }
            })(); 
        data[0].products[i].image = img

        });

        return res.render("orderDetail", {route: "", data: data[0],  loginUser: typeof req.user != "undefined" ? req.user : undefined})
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });

});



/* --------------------------------------------- */
/*                  Order Cancle                 */
/* --------------------------------------------- */
router.get('/order/cancle/:orderId', ensureAuthenticated, isVerified, async (req, res) => {
    await orderDatModel.findOneAndUpdate({orderId: req.params.orderId}, {status: "Cancel"}).exec().then(data => {
        previousUrl = res.app.get('previousPage');
        console.log(previousUrl)
        url = typeof previousUrl !== 'undefined' ? previousUrl : '/my-orders';   
        return res.redirect(url) 
    }).catch(err => {
        console.log(err);
        return res.send(err);
    })
});

/* --------------------------------------------- */
/*                My Order Detail                */
/* --------------------------------------------- */
router.get('/order/:orderId', ensureAuthenticated, isVerified, async (req, res) => {
    orderId = req.params.orderId;

    await orderDatModel.find({ orderId : orderId, }).then((data) => {

        data[0].products.forEach((item, i) => {
            img = (function() {
                if ( item.cover1Image != null && item.cover1ImageType != null) {
                    return `data:${item.cover1ImageType};charset=utf-8;base64,${item.cover1Image.toString('base64')}`
                }
            })(); 
        data[0].products[i].image = img

        });

        return res.render("orderDetail", {route: "", data: data[0],  loginUser: typeof req.user != "undefined" ? req.user : undefined})
    }).catch((err) => {
        console.log(err);
        return res.send(err)
    });

});


/* --------------------------------------------- */
/*                 Find My Order                 */
/* --------------------------------------------- */
router.get("/find-order", (req, res) => {
    return res.render("find-my-order", {error: "", loginUser: typeof req.user != "undefined" ? req.user : undefined});
});

router.post("/find-order", async (req, res) => {
    orderId = req.body.orderTracker;
    await orderDatModel.find({ orderId : orderId, }).then((data) => {
        if(data.length){
            data[0].products.forEach((item, i) => {
                img = (function() {
                    if ( item.cover1Image != null && item.cover1ImageType != null) {
                        return `data:${item.cover1ImageType};charset=utf-8;base64,${item.cover1Image.toString('base64')}`
                    }
                })(); 
                data[0].products[i].image = img
            });
            return res.render("orderDetail", {route: "findOrder", data: data[0], loginUser: undefined})
            return res.render("my_order", {data, loginUser: req.user})
        } else {
            return res.render("find-my-order", {error: "Invalid order detail", loginUser: typeof req.user != "undefined" ? req.user : undefined});
        }
        }).catch((err) => {
            console.log(err);
            return res.send(err)
        });
});


module.exports = router