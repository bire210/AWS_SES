const nodemailer = require("nodemailer");
const AWS = require("aws-sdk");
require("dotenv").config();
const { ACCESS_KEY, SECRET_KEY, REGION, BUCKET_NAME } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

const s3 = new AWS.S3();

const transporter = nodemailer.createTransport({
  SES: {
    ses: new AWS.SES({ apiVersion: "2019-12-01", region: REGION }),
    aws: AWS,
  },
});

const sendEmail = async () => {
  try {
    // Specify the key (filename) of the object in your S3 bucket
    const s3ObjectKey = "0062bc3f-3dcc-4682-94a2-1fa017951e75.png";

    // Download the file from S3
    const s3Object = await s3
      .getObject({ Bucket: BUCKET_NAME, Key: s3ObjectKey })
      .promise();
    // console.log("objetc ************************", s3Object);
    const mailOptions = {
      from: {
        name: "Email From AWS",
        address: "aman.maddhesia@furation.tech",
      },
      to: ["birendra.mahto@furation.tech"],
      subject: "Test Email with sending the  attached files",
      text: "Hello, This is a test email with attachments",
      html: "<b> Hello, This is a test email with attachments</b>",
      attachments: [
        {
          filename: s3ObjectKey,
          content: s3Object.Body,
          encoding: "base64",
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully", result.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

sendEmail();
