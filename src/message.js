

exports.parse = function(e, err){

    console.log("Got body: " + e.body);

    var body = JSON.parse(e.body);
    
    
    var success = true;
    success = success && body.runTimeMs !== undefined;
    success = success && body.isOn !== undefined;
    success = success && body.valveNumber !== undefined;
    success = success && body.xbeeAddr !== undefined;


    if(success){
        return body;
    }else{
        err("Failed to validate and parse body.  Recieved " + JSON.stringify(body));
    }



}