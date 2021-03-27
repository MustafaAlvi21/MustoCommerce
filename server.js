if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require ('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const expressPartials = require('express-partials');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const flash = require('connect-flash');
const session = require ('express-session');
const passport = require('passport')
// const favicon = require('serve-favicon');
let back = require('express-back');
const sha256 = require('sha256')
require('./config/passport')(passport);


/*  ---------------------------------------------  */
/*                      Mongo DB                   */
/*  ---------------------------------------------  */
const mongoose = require ('mongoose');
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open',()  => console.log('Connected Mongo'))


/*  ---------------------------------------------  */
/*               Express    Session                */
/*  ---------------------------------------------  */
app.use(session({
  secret: 'mubi',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 * 3 },  // 30 minutes session
}))       


/*  ---------------------------------------------  */
/*            App Use And Set Methods              */
/*  ---------------------------------------------  */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views') );
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
// app.use(expressPartials);
app.use(express.static (__dirname + 'public') );
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(back());


/*  ---------------------------------------------  */
/*              Passport    middleware             */
/*  ---------------------------------------------  */

app.use(passport.initialize());
app.use(passport.session());

//   C o n n e c t   F l a s h      
app.use(flash());
      
//   Global Variables for flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
})


/*  ---------------------------------------------  */
/*                Global Routes                    */
/*  ---------------------------------------------  */
const homeRouter = require('./routes/home')
app.use( ('/'), homeRouter );

const searchRouter = require('./routes/search')
app.use( ('/'), searchRouter );

const subscribershRouter = require('./routes/subscribers')
app.use( ('/'), subscribershRouter );

const authRouter = require('./routes/auth-system')
app.use( ('/'), authRouter );

const productsRouter = require('./routes/products')
app.use( ('/'), productsRouter );

const cartRouter = require('./routes/cart')
app.use( ('/'), cartRouter );

// const wishlistRouter = require('./routes/wishlist')
// app.use( ('/'), wishlistRouter );

// const myOrdersRouter = require('./routes/orders')
// app.use( ('/'), myOrdersRouter );

// const customerOrdersRouter = require('./routes/customerOrders')
// app.use( ('/'), customerOrdersRouter );


/*  ---------------------------------------------  */
/*                     User                        */
/*  ---------------------------------------------  */
// const myProfileMainRouter = require('./routes/myProfile')
// app.use( ('/'), myProfileMainRouter );

const ordersRouter = require('./routes/my_orders')
app.use( ('/'), ordersRouter );


/*  ---------------------------------------------  */
/*                 Admin Routes                    */
/*  ---------------------------------------------  */
const AdminCategoryAddRoute = require('./routes/admin/categories')
app.use( ('/admin'), AdminCategoryAddRoute );

const AdminStoresAddRoute = require('./routes/admin/stores')
app.use( ('/admin'), AdminStoresAddRoute );


const AdminProductsAddRoute = require('./routes/admin/products');
app.use( ('/admin'), AdminProductsAddRoute );


/*  ---------------------------------------------  */
/*                  listening Port                 */
/*  ---------------------------------------------  */  

app.get('/check', (req, res) =>  {
  // res.sendFile('checkout.html')
  res.render('home');
})
// app.get('/check1', (req, res) =>  {
//   // res.sendFile('checkout.html')
//   // return res.sendFile(path.join(__dirname+'/product_details.html'))
//   res.sendFile(__dirname + '/views/product_details.html');
// })
const port1 = 4000
app.listen(process.env.PORT || port1, async () => {
  console.log('Prot is running at : ' + process.env.PORT || port1);
});