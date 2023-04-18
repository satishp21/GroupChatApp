const fs = require('fs');
const AWS = require('aws-sdk');
const { resolve } = require('path');

const ID = process.env.ACCESS_KEY_ID;
const SECRET = process.env.SECRET_KEY;

// // The name of the bucket that you have created
// const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'flower.jpg', // File name you want to save as in S3
        Body: fileContent,
        ACL:'public-read',
    };

    // Uploading files to the bucket
    return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        } else {
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data.Location)
        }
    });
    })
};

module.exports = {
     uploadFile
}