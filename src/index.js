
var sqs = require('./sqs.js');
var message = require('./message.js');
var db = require('./db.js');
var processor = require('./proto/processToProtobuf.js');


exports.handler = async (event) => {
    

    return new Promise((resolve, reject) => {
        ``//parse the request
        console.log("Got event:" + JSON.stringify(event));
        let request = message.parse(event, err => {console.log(err); process.exit(1);});
        
        console.log("Got reqeust: " + JSON.stringify(request));

        //create the protobuf message for watering command
        processor.convert(request).then( (msg) => {

                //publish the xbee protobuf message
                sqs.sqsSend(msg);

                //log the command to db
                db.logWateringCommand(msg);

        
                resolve('Success');

            }, (err) => {

                //return a response
                reject(err);
        });

        
    });



};



exports.handler({body:{isOn:true, runTimeMs:5000, valveNumber:2, xbeeAddr: "000000000"}}).then( () => console.log('done.'));

