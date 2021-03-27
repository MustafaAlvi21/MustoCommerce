const userDataModel = require('../models/users')



// document.body.innerHTML = doc
exports.sendMail = async function (dataOfOrder,data_to_be_extract, loginUser, order) {    
  a = `<body style="background-color: transparent; font-family: Arial, Helvetica, sans-serif;">
  <div style="max-width: 600px;margin: auto; background-color: #f6f7f9;">
          <div class="invoice" style="background-color: #ff6a00; color: white;">
          <h1 class="p-4 text-center fs1-8" style="font-weight: bold; text-align: center;">Invoice for order </h1>
          </div>
      <div style=" padding-left: 10px; padding-right: 10px;">
      <div class="">
      <p>Hi ${loginUser.fullname},</p>
          <p>You order request has been received.</p>
          <p>Here are the detail of your order placed on ${order.orderPlacementDate}</p>
          <p>Pay with cash upon delivery</p>
          </div>
          <div>
          <h3 class="hcolor pl4 tcenter-md" style="color: #ff6a00; font-weight: bold;">Order Information</h3>
          </div>
          <div>
          <table style="width: 100%; border-collapse: collapse; border: 2px solid rgb(163, 163, 163);">
          <thead>
                  <tr style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163);">
                  <td class="fw7" style="font-weight: 700; border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">Product</td>
                  <td class="fw7" style="font-weight: 700; border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">quantity</td>
                      <td class="fw7" style="font-weight: 700; border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">Price</td>
                      </tr>
                      </thead>
              <tbody style="padding: 16px">
              `
  
  tableRow = ''
  totalPrice = 0
               dataOfOrder.forEach((element, index) => {
                   tableRow += `
                <tr style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163);">
                      <td style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">${element.productName}</td>
                      <td style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;"> ${data_to_be_extract.product[index].quantity}</td>  
                      <td style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">Rs ${element.price}/-</td>
                      </tr> `
                      totalPrice += parseInt(element.price) * parseInt(data_to_be_extract.product[index].quantity)
              })
              
              
  b =  `<tr style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163);">
                      <td colspan="2" class="fw7" style="font-weight: 700; border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">Total</td>
                      <td style="border-collapse: collapse; border: 2px solid rgb(163, 163, 163); padding: 16px;">Rs ${totalPrice}/-</td>
                  </tr>
              </tbody>
              </table>
      </div>
      <div class="p4 pt-4">
      <h3 class=" pb-2 hcolor tcenter-md" style="color: #ff6a00; font-weight: bold;">Shipping address</h3>
          <p class="mb0" style="margin-bottom: 0;">${loginUser.fullname}</p>
          <p class="mb0" style="margin-bottom: 0;">${loginUser.city}</p>
          <address class="mb0" style="margin-bottom: 0;">${loginUser.address}</address>
          <p class="mb0" style="margin-bottom: 0;">${order.phone}, ${loginUser.phone}</p>
          <p class="mb0" style="margin-bottom: 0;">${loginUser.email}</p>
          </div>
  </div>
  </div>
  </body> `
  
  mailTemplate = a + tableRow + b



  await userDataModel.findOne({_id: loginUser._id }).exec(function(err, data){
    if (err) throw err;
    if (data){
      console.log(data.email)

      const nodemailer = require("nodemailer");
      async function main() {
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'catchnoreply1@gmail.com', // generated ethereal user
          pass: 'nadmfxnnbrwzsnkt', //  generated ethereal password
        },   
      });
      
      // const orderId = dataOfOrder[0]._id;
      // const orderMail = dataOfOrder[0].email

      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: data.email, // list of receivers
        subject: "Order mail", // Subject line
        html: mailTemplate,
      });  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log('Order is mailed');
      return 'Order is mailed';
    }    
    main().catch(console.error);
      
  } else {
    return 'There is an error in mailing order';
      }
    })

  };
  
  
  // text: "Your order details  --==--  meail from order module", // plain text body
  // html: "<h3>Your order details --==--  meail from order module: </h3> "+ `${orderMail}`+"/"+`${orderId}`+"/\n Total Price: "+`${dataOfOrder[0].total}`, // html body
  