const paypal = require("./payPal-api.js");

const paypalpaymentorder = async (req, res) => {
    console.log("create",req.body)
    try {
        const data = req.body;
        const order = await paypal.createOrder(data);
        
        res.json(order);
      } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
      }
  };
  const orderId = async (req, res) => {
    console.log("ordert", req.body)
    let orderID
    try {
        const data = req.body;
         orderID = data.orderID;

        // Assuming captureOrder returns an object with jsonResponse property
        const captureData = await paypal.captureOrder(orderID);

        // Log the entire captureData object to inspect its structure
        // console.log(captureData);

        // Access the purchase_units array
        const purchaseUnits = captureData.jsonResponse.purchase_units;

        // Check if there are purchase units and captures
        if (purchaseUnits && purchaseUnits.length > 0) {
            // Access the first purchase unit
            const firstPurchaseUnit = purchaseUnits[0];

            // Check if payments object and captures array exist
            if (firstPurchaseUnit.payments && firstPurchaseUnit.payments.captures) {
                // Access the first capture and retrieve the id
                const firstCapture = firstPurchaseUnit.payments.captures[0];
                if (firstCapture) {
                    const captureId = firstCapture.id;
                    console.log("Captured ID:", captureId);
                } else {
                    console.log("No captures found");
                }
            } else {
                console.log("No captures found");
            }
        } else {
            console.log("No purchase units found");
        }

        res.json(captureData);
    } catch (error) {
        console.error("Failed to create order:", error);

        // Send both the order ID and error in the response
        res.status(500).json({ error: "Failed to capture order.", orderID });
    }
};


module.exports={
orderId,
paypalpaymentorder
}