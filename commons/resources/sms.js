// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let SMS;
const request = require("request");
const username = "ujjwal@memoriesunlimited.co.in";
const __apiKey = "DQWXuYMsmow-wz6mT0W2CiztjVIGvCE9XF9Cnq11Fj";
const exotelSid = "memoriesunlimited";
const exotelToken = "9cdccfa98e58fabd221a33645091dc6c03860e6d";
// factoryKey = "1154bd10-dadb-11e6-afa5-00163ef91450" -- development
const factoryKey = "cf2227f5-e195-11e6-afa5-00163ef91450";
module.exports = (SMS = class SMS {
  constructor() {}

  orderTextLocalSuccess(number, orderId) {
    const numbers = [number];
    const message = `Thank you your order ${orderId} has been placed successfully`;
    const apiUrl = "http://api.textlocal.in/send/";
    return new Promise(function(resolve, reject) {
      const smsData = {
        username,
        hash: "d4a6da0250d55dee67fab2fd8d41b267b358928a",
        numbers: numbers.join(","),
        sender: "TXTLCL",
        message
      };
      return request.post({url: apiUrl, form:smsData}, (error, response, body) => console.log("sms: ", error, body));
    });
  }

  sendOTP(number) {
    const url = `http://2factor.in/API/V1/${factoryKey}/SMS/${number}/AUTOGEN/ABCDEF`;
    return new Promise(function(resolve, reject) {
      return request.get({url}, function(error, response, body) {
        console.log("sendotp: ", body, error);
        if (error != null) {
          return reject(error);
        } else {
          body = JSON.parse(body);
          if (body.Status === "Success") {
            return resolve(body);
          } else {
            return reject(error);
          }
        }
      });
    });
  }

  verifyOTP(details, otp) {
    const url = `http://2factor.in/API/V1/${factoryKey}/SMS/VERIFY/${details}/${otp}`;
    return new Promise(function(resolve, reject) {
      return request.get({url}, function(error, response, body) {
        if (error != null) {
          console.log("Error in verifyOTP: ", error);
          return reject(error);
        } else {
          body = JSON.parse(body);
          if (body.Status === "Success") {
            return resolve(body);
          } else {
            return reject(error);
          }
        }
      });
    });
  }

  orderSuccess(number, orderId) {
    return new Promise(function(resolve, reject) {
      const url = `http://2factor.in/API/V1/${factoryKey}/ADDON_SERVICES/SEND/TSMS`;
      const formData = {
        From: "TFCTOR",
        To: number,
        Msg: `Thank you your order ${orderId} has been placed successfully`
      };

      return req.post(url, {formData}, function(error, response, body) {
        if (error != null) {
          return reject(error);
        } else {
          return resolve(body);
        }
      });
    });
  }

  exotelOrderSuccess(number, orderId) {
    const apiUrl = `https://${exotelSid}:${exotelToken(+"@twilix.exotel.in/v1/Accounts/" + exotelSid + "/Sms/send")}`;
    return new Promise(function(resolve, reject) {
      const postData = {
        From: "8199935308",
        To: number,
        Body: `Your order ${orderId} has been placed successfully`
      };
      return request.post({url: apiUrl, form: postData}, function(error, response, body) {
        if (error != null) {
          return reject(error);
        } else {
          return resolve(body);
        }
      });
    });
  }
});

