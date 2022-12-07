#run prettier
npm run format

#set the correct environment variable
export AWS_DEFAULT_PROFILE=ecomm
export AWS_DEFAULT_REGION=us-east-1

#remove previous zip folder
rm ./deployable.zip

#zip project
zip -r ./deployable.zip ./src ./node_modules ./package*

#upload zip file to s3
aws s3 mv deployable.zip s3://ecomm-starbux-artifact-bucket

#update lambda to point to new zip 
aws lambda update-function-code --function-name "starbux" --s3-bucket "ecomm-starbux-artifact-bucket" --s3-key "deployable.zip"

