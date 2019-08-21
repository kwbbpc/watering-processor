// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var proto = require('./proto/processToProtobuf');

exports.notifyError = function(errorMsg){

  // Create an SQS service object
  var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  sqs.config.update({region:'us-east-1'});

  var params = {
    DelaySeconds: 10,
    MessageBody: errorMsg,
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/051846041120/api-errors"
  };

  sqs.sendMessage(params, function(err, data) {
    console.log("Executed.");
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
}


exports.sqsSend = function(msg){


  // Create an SQS service object
  var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  sqs.config.update({region:'us-east-1'});

  var params = {
    DelaySeconds: 10,
    MessageAttributes: {
        "xbeeAddr": {
          DataType: "String",
          StringValue: msg.xbeeAddr
        },
        "messageType": {
          DataType: "String",
          StringValue: ""+msg.messageType
        }
    },
    MessageBody: "" + msg.payload,
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/051846041120/xbee-commands"
  };

  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, function(err, data) {
      console.log("Executed SQS send.");
      if (err) {
        console.log("Error during SQS Send: " + err);
        reject(err);
      } else {
        console.log("Successfully sent SQS packet for messageType: " + data.MessageId);
        resolve();
      }
  })});

};