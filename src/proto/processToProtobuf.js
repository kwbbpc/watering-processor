
var flowCmd = require('./flowCommand_pb');
var db = require('../db.js');
var promise = require('promise');


exports.convert = function(request) {

    
    var cmd = new proto.FlowCommandMessage;
    cmd.setPinnumber(request.pinNumber);
    cmd.setRuntimems(request.runTimeMs);
    cmd.setIson(request.isOn);


    console.log("Getting msg id");
    return new Promise( (resolve, reject) => {
        db.getMessageId("flow_control", (err, msgTypeResponse) => {

            if(err){
                console.log("error getting message id for type flow_control: " + JSON.stringify(err));
                reject(err);
            }
            
            console.log("done");

            let messageId = msgTypeResponse.Items[0].messageId;
    
            let message = {};
            message.payload = cmd.serializeBinary();

            var msg = proto.FlowCommandMessage.deserializeBinary(message.payload);


            message.payload = new Uint8Array([messageId, ...message.payload]);
            message.xbeeAddr = request.xbeeAddr;
            message.messageType = messageId;
    
            resolve(message);
     
        });
    });


}
