var AWS = require('aws-sdk');

exports.getMessageId = function(messageType, onSuccess){
    AWS.config.update({
        region: "us-east-1"
      });
      
      var docClient = new AWS.DynamoDB.DocumentClient();
      
      var table = "MessageIdMapping";
      
      
      var params = {
        TableName:table,
        IndexName: "messageType-index",
        KeyConditionExpression: 'messageType = :msgType',
        ExpressionAttributeValues: {
            ':msgType': messageType
        }
    };
    
    return docClient.query(params, onSuccess);
}

exports.logWateringCommand = function(cmd){
    AWS.config.update({
        region: "us-east-1"
      });
      
      var docClient = new AWS.DynamoDB.DocumentClient();
      
      var table = "WateringCommandLog";
      
      
      var params = {
        TableName:table,
        Item: {
            timestamp: new Date().toISOString(),
            messageSent: cmd
        }
    };
    
    console.log("Adding a new item: " + JSON.stringify(params));

    return new Promise( (resolve, reject) => {
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}