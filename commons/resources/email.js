// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Email;
const nodemailer = require("nodemailer");
const options = {
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "varun@memoriesunlimited.co.in",
    password: "Varun@123"
  }
};

const gmailOptions = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'thememoriesunlimited@gmail.com',
    pass: 'memories@123'
  }
};

const transporter = nodemailer.createTransport("smtps://admin%40memoriesunlimited.co.in:Varun%40123@smtp.zoho.com");

module.exports = (Email = class Email {
  constructor() {}

  orderSuccess(email, orderId) {
    const mailOptions = {
      from: "info@memoriesunlimited.co.in",
      to: email,
      subject: `${orderId} success`,
      text: "Thank you. Your order has been placed successfully:",
      html: "Thank you. Your order has been placed successfully"
    };
    return transporter.sendMail(mailOptions, (error, info) => console.log("email: ", error , info));
  }

  sendOrder(order, user) {
    let message = `order: ${JSON.stringify(order)}`;
    message += `user: ${JSON.stringify(user)}`;
    const mailOptions = {
      from: "admin@memoriesunlimited.co.in",
      to: "orders.mu@gmail.com",
      subject: `Order ${order.order_id}`,
      text: message,
      html: message
    };
    return transporter.sendMail(mailOptions, (error, info) => console.log("email: ", error , info));
  }

  sendOrderQuery(name, message) {
    const mailOptions = {
      from: "admin@memoriesunlimited.co.in",
      to: "orders.mu@gmail.com",
      subject: `Order Query from ${name}`,
      text: message,
      html: message
    };
    return transporter.sendMail(mailOptions, (error, info) => console.log("email: ", error , info));
  }

  sendQuery(name, message) {
    const mailOptions = {
      from: "admin@memoriesunlimited.co.in",
      to: "contactus@memoriesunlimited.co.in",
      subject: `Query from ${name}`,
      text: message,
      html: message
    };
    return transporter.sendMail(mailOptions, (error, info) => console.log("email: ", error , info));
  }
});

