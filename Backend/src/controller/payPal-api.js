const fetch = require("node-fetch");
//Client
 //const base = "https://api.paypal.com";
//
//Testing
 const base = "https://api.sandbox.paypal.com";
 //
 //Client
 //Af96o-9KLeh4FqbyA4MstcwegLXwnaksaVhx7kMirjlqa67Y_1006ziGiQz-bFX6ka2AUJWTrBZJr9Ew
 //EGk2M71_1_6xyHusjRgCMtKGjzmUQaR4Ggn2bJ_msB8SqD_HV6TyjYkrz4mT0AmYjrWeblt4RUmPZ_TK
 const PAYPAL_CLIENT_ID="Af96o-9KLeh4FqbyA4MstcwegLXwnaksaVhx7kMirjlqa67Y_1006ziGiQz-bFX6ka2AUJWTrBZJr9Ew";
 const PAYPAL_CLIENT_SECRET="EGk2M71_1_6xyHusjRgCMtKGjzmUQaR4Ggn2bJ_msB8SqD_HV6TyjYkrz4mT0AmYjrWeblt4RUmPZ_TK";
//
//Testing
 //const PAYPAL_CLIENT_ID="ASSHnrZmYqBBj79WFaURlEYy1cRanpu4dI8zZUgTGqDldvNZCiaQMR8K7QWd6LDO5AclJAAcba2_Fowu"
//const PAYPAL_CLIENT_SECRET="EA28M5DLhZiaILjZln6IjLCkeuCFOQ3e68W5dfFlbf049Fh2Ow5XKdp8ZbdOqz_fVFZaRSeZFbC4lp2O"
//
const createOrder = async (data) => {
 
    const accessToken = await generateAccessToken();
    console.log("hello from backend paypal accesstokennn",accessToken)
    const currentTimeUTC = new Date().toISOString();
    const url = `${base}/v2/checkout/orders`;
    let cost = data.cost;

  // Check if shouldDisableCheckbox is false, then apply a 25% discount on the cost
  if (data.shouldDisableCheckbox === 'false' && data.click === 'true') {
    cost = Math.round(cost * 0.75); // Apply a 25% discount
    console.log("cost", cost);
  }
  
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cost,
          },
        },
      ],
      create_time: currentTimeUTC,
    };
 
 
 
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
 
    return handleResponse(response);
  };
 
  const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();

    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            
        },
    });

    const result = await handleResponse(response);
    console.log("Response after payment failure:", result);

    return result;
};

 
  const generateAccessToken = async () => {

    try {
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
      ).toString("base64");
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
 
      const data = await response.json();
      console.log("data",data)
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
  };
 
  async function handleResponse(response) {
    try {
      const jsonResponse = await response.json();
    
  
      if (jsonResponse.purchase_units) {
        
  
        // Check for captures within payments
        if (jsonResponse.purchase_units[0].payments && jsonResponse.purchase_units[0].payments.captures) {
          
  
          // Iterate through captures and convert timestamps to local timezone
          jsonResponse.purchase_units[0].payments.captures.forEach(capture => {
            const dateInLocalTimezone = new Date(capture.create_time).toLocaleString('en-US', {
              timeZone: 'America/New_York', // Replace with your desired timezone
            });
  
            console.log('Timestamp in Local Timezone:', dateInLocalTimezone);
          });
        }
      }
  
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }
  
  
module.exports={
    captureOrder,
    createOrder
}