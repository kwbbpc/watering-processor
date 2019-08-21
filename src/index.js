
var sqs = require('./sqs.js');
var message = require('./message.js');
var db = require('./db.js');
var processor = require('./proto/processToProtobuf.js');


exports.handler = async (event, context) => {

    if(event === undefined){
        console.log("No event body was provided in event: " + JSON.stringify(event));
        return;
    }
    

    return new Promise((resolve, reject) => {
        ``//parse the request
        console.log("Got event:" + JSON.stringify(event));

        var request = {};
        try{
            request = message.parse(event, err => {
                console.error("An error occurred during parsing of request: " + err);
                console.error("event: " + JSON.stringify(event));
                sqs.notifyError(err);
                resolve(
                    {
                        statusCode: 500,
                        body: JSON.stringify(err)
                    }
                );
                throw new Error(err);
            });
        }catch(err){
            return;
        }
        
        console.log("Got request: " + JSON.stringify(request));

        //create the protobuf message for watering command
        processor.convert(request).then( (msg) => {


                //publish the xbee protobuf message
                console.log("Sending xbee message.");
                sqs.sqsSend(msg).then( () => {

                    //log the command to db
                    console.log("Logging the command to the db.");
                    db.logWateringCommand(msg).then( 
                        () => resolve({ responseCode: 200, body: {message: "Success"}, headers: {}, isBase64Encoded: false }), 
                        (err) => {
                            sqs.notifyError("Watering command was posted, but: " 
                            + JSON.stringify(err));
                            resolve({
                                responseCode: 200, 
                                body: {"message": "There was an error saving  this command to the db: " + 
                                    JSON.stringify(msg) + ".  However, it still executed."
                                }
                            });
                        }
                    );

                }, (err) => sqs.notifyError(err));

            }, (err) => {

                //return a response
                resolve({
                    statusCode: 500,
                    body: {"message": "" + JSON.stringify(err)}
                });
        });

        
    });



};



//exports.handler({body:{isOn:true, runTimeMs:5000, valveNumber:2, xbeeAddr: "000000000"}}).then( () => console.log('done.'));

