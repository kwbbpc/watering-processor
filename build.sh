cd src
zip -r ../target/watering-processor.zip .
cd ..
aws lambda update-function-code --function-name watering-processor --zip-file fileb://./target/watering-processor.zip
