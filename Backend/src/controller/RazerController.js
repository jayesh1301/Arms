const Razorpay= require("razorpay")
const crypto = require("crypto")
//Client
const  KEY_ID = "rzp_live_yhgIBqTwpGyP3Z"
const KEY_SECRET = "uQicAXHjMzVKLA0tiHUNgc3Z"
//
//Testing
// const  KEY_ID = "rzp_test_StbZBonzDungvA"
// const KEY_SECRET = "DvlWj6XbxrpxiRxVGSEagBOS"
//
const razerpaymentorder = async (req, res) => {
  console.log(req.body)
  let amount = req.body.amount;

  // Check if shouldDisableCheckbox is false, then apply a 25% discount on the cost
  if (req.body.setIsCheckboxDisabledbox === false ) {
    if(req.body.check === 'true'){
      amount = Math.round(amount * 0.75); // Apply a 25% discount
    console.log("amount",amount)
    }
    
  }
    try {
        const instance = new Razorpay({
          key_id: KEY_ID,
          key_secret: KEY_SECRET,
        });
    
        const options = {
          amount: amount * 100,
          currency: "INR",
          receipt: crypto.randomBytes(10).toString("hex"),
        };
    
        instance.orders.create(options, (error, order) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ message: "Something Went Wrong!" });
          }
          
          res.status(200).json({ data: order });
        });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
      }
  };
  const verify = async (req, res) => {
    console.log(req.body)
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
        console.log("razorpay_signature",razorpay_signature)
        console.log("expectedSign",expectedSign)
      if (razorpay_signature === expectedSign) {
        console.log({ message: "Payment verified successfully" });
        return res.status(200).json({ message: "Payment verified successfully" });
      } else {
        // Log the data received from Razorpay in case of invalid signature
        console.log({
          message: "Invalid signature sent!",
          receivedData: req.body,
        });
  
        // Send the relevant information to the frontend in the response
        return res.status(400).json({
          message: "Invalid signature sent!",
          errorDetails: {
            message: "Payment verification failed",
            receivedData: req.body,
          },
        });
      }
    } catch (error) {
      // Log the error in case of an internal server error
      console.log({
        message: "Internal Server Error!",
        error: error.message,
      });
  
      res.status(500).json({ message: "Internal Server Error!" });
    }
  };
  
  
module.exports={
  razerpaymentorder,
  verify
}