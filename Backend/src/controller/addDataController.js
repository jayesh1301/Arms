const pool = require("../config/dbConfig.js");
const jwt=require('jsonwebtoken')
const util = require('util');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer');
const Login = async (req, res) => {
    const { username, password } = req.body;
  console.log(req.body)
    // Set the hardcoded username and password
    const hardcodedUsername = 'admin';
    const hardcodedPassword = '123';
  
    if (username == hardcodedUsername && password == hardcodedPassword) {
      const userType = 'admin'; // Set the user type
      const token = jwt.sign({userType }, 'jwt-secret-key', {
        expiresIn: '1d'
      });
      console.log(token)
      res.cookie('token', token); // 1 day
  
      return res.status(200).json({ status: 'Success', token,});
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  };
  
const addData = async (req, res) => {
    console.log("Request Body:", req.body);
    let amount = req.body.amount;
    
    // Check if shouldDisableCheckbox is false, then apply a 25% discount on the amount
     if (req.body.shouldDisableCheckbox === 'false' || req.body.setIsCheckboxDisabledbox === false) {
       if(req.body.click === 'true'){
         amount = Math.round(amount * 0.75); // Apply a 25% discount
         console.log("cost", amount);
       }
      
     }

     try {
         const {
             country,
             memberType,
             registrationType,
             name,
             email,
             organization,
             designation,
             address,
             postalCode,
             dob,
             passportNo,
             dateOfIssue,
             dateOfExpiry,
           placeOfIssue,
             dateOfArrival,
             dateOfDeparture,
             orderId,
             payment_type,
             status,
             course,
             cname,
             cdob,
             crelationship,
             cpassportno,
             cdateodissue,
             cdateodexpiry,
             cplaceofissue,
         } = req.body;

         const formattedDob = dayjs(dob).format('YYYY-MM-DD');
         const formattedDateOfIssue = dayjs(dateOfIssue).format('YYYY-MM-DD');
         const formattedDateOfExpiry = dayjs(dateOfExpiry).format('YYYY-MM-DD');
         const formattedDateOfArrival = dayjs(dateOfArrival).format('YYYY-MM-DD');
         const formattedDateOfDeparture = dayjs(dateOfDeparture).format('YYYY-MM-DD');
         const formattedcdob = cdateodexpiry ? dayjs(cdob).format('YYYY-MM-DD') : null;
         const formattedcdateodissue = cdateodexpiry ? dayjs(cdateodissue).format('YYYY-MM-DD') : null;
         const formattedCdateodexpiry = cdateodexpiry ? dayjs(cdateodexpiry).format('YYYY-MM-DD') : null;


         const query = `
             INSERT INTO payment_details (
                 country,
                 member_type,
                 events,
                 name,
                 email,
               organization,
                 designation,
                 address,
                 postal_code,
                 date_of_birth,
                 passport_no,
                 date_of_issue,
                 date_of_expiry,
               place_of_issue,
                 date_of_arrival,
                 date_of_departure,
                 amount,
                 transection_id,
               payment_type,
                 status,
                 course,
                 accompanyname,
                 accompanydob,
                 accompanyrelationship,
                 accompanypassportno,
                 accompanydateodissue,
                 accompanydateodexpiry,
                 accompanyplaceofissue
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)
         `;
     
        const result = await pool.query(query, [
             country,
             memberType,
             registrationType,
             name,
             email,
             organization,
             designation,
             address,
             postalCode,
             formattedDob,
             passportNo,
             formattedDateOfIssue,
             formattedDateOfExpiry,
             placeOfIssue,
             formattedDateOfArrival,
             formattedDateOfDeparture,
             amount || null,
             orderId || null,
             payment_type || null,
             status,
             course,
             cname || null,
             formattedcdob,
             crelationship || null,
             cpassportno || null,
             formattedcdateodissue,
             formattedCdateodexpiry ,
             cplaceofissue,
         ]);

         if(status == 1){
          sendMail(email)
         }
      return   res.send({message:"Data Add Successfully"})
        
   
    } catch (error) {
        console.error("Error adding data:", error.message);
      return  res.status(500).send("Internal Server Error");
    }
};





const getAllData = async (req, res) => {
  const q = "SELECT * FROM payment_details";

  pool.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
console.log(data)
    const processedData = data.map((row) => {
      const sourceCourseIdSet = new Set(['SC-1', 'SC-2', 'SC-3']);
      const workshopCourseIdSet = new Set(['WS-1', 'WS-2', 'WS-3', 'WS-4']);
    
      const source = sourceCourseIdSet.has(row.course) ? row.course : '';
      const workshop = workshopCourseIdSet.has(row.course) ? row.course : '';
      return {
        id: row.id,
        country: row.country,
        member_type: row.member_type,
        
        events:row.events, 
        name:row.name,
        email:row.email, 
        organization:row.organization,
        designation:row.designation,
        address:row.address,
        postal_code:row.postal_code,
        date_of_birth:row.date_of_birth, 
        passport_no:row.passport_no, 
        date_of_issue:row.date_of_issue, 
        date_of_expiry:row.date_of_expiry, 
        place_of_issue:row.place_of_issue,
        date_of_arrival:row.date_of_arrival,
        date_of_departure:row.date_of_departure, 
        amount:row.amount,
        transection_id:row.transection_id,
        payment_type:row.payment_type, 
        status: row.status === '1' ? 'Success' : 'Fail',
        source: source, // New field added for source
        workshop: workshop,
        accompanyname:row.accompanyname,
        accompanydob:row.accompanydob,
        accompanyrelationship:row.accompanyrelationship,
        accompanypassportno:row.accompanypassportno,
        accompanydateodissue:row.accompanydateodissue,
        accompanydateodexpiry:row.accompanydateodexpiry,
        accompanyplaceofissue:row.accompanyplaceofissue
      };
    });


    return res.json(processedData);
  });
};

const transporter = nodemailer.createTransport({
  host: 'mail.arms2024.org',
  port: 25,
  secure: false, 
  auth: {
    user: 'support@arms2024.org', 
    pass: 'VebK4c264' 
  },
  tls: {
    rejectUnauthorized: false 
  },
  
});

const sendMail = (email) => {

  const message=`Dear Delegate,

We are pleased to inform you that your payment has been successfully received and your registration is confirmed.

We are truly honoured to have you on board and are eager to collaborate with you to make ARMS-13 a successful and memorable event.
Thanks and Regards 
ISRM India`
  const mailOptions = {
    
    from: '"ISRM India" <support@arms2024.org>',
    to: email,
    subject: 'Registration confirmation',
    text: message,
    bcc: 'wadkarjay64@gmail.com'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Optional: Log the error or take further action, but don't send a response here
    } else {
      console.log('Email sent successfully');
    }
  });
};
module.exports={
    addData,
    getAllData,
    Login
}