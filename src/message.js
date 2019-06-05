

exports.parse = function(e, err){

    try{
        var body = e.body;
    }catch(e){
        err("Could not parse http body: " + JSON.stringify(e));
    }
    
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