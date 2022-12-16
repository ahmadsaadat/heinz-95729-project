# Welcome to Starbux!
Starbux is a conversational user interface (CUI) that helps the user to order coffee, deployed on dialogflow. The user can add item to the cart, view current cart, check out, set personalizations, and more. 

#### Deployment Requirements:
1. install node.js v12.18.4
2. try to use git bash instead of powershell or command prompt
3. install aws cli: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
4. run `npm install -g prettier`
5. run `npm ci`
6. set up aws configs - ask Ahmad for credentials

#### Project Set Up Directions:
1. scripts/deploy.sh zips the workspace and deploys it to S3
2. our webhook url POST: https://u9ofbpxmqd.execute-api.us-east-1.amazonaws.com/Prod/resource
3. TODO: set up deploy script for CICD, thoughts: just send new object to S3 as lambda is already hooked up
4. TODO: npm install https://stackoverflow.com/questions/34437900/how-to-load-npm-modules-in-aws-lambda
5. #use proper credentials ==> export AWS_DEFAULT_PROFILE=ecomm

#### Features
Personaliazation of favorite coffee and location for user profile
Order from menu and related interactions
Pick a location for the order
Pay for the order with credit card using stripe
Pickup invalid input with helpful suggestions


#### Sample Input Script
##### 0. Initiate the Converstaion
Talk to Starbux
##### 1. Personalization
Personalize
##### 2. Order
Place an order
Hear menu
Add one cup of black coffee
View cart
Clear cart
##### 3. Pick Location
##### 4. Place the Order
##### 5. Invalid Input
What is the answer to life, the universe, and everything?
I want a cup of Andrew Carnegie
##### 6. Exit
Cancel

#### Limitations
##### User id is fixed to 1
While on a production application, user id should be based on actual user data, implementing authentication and authorization far exceeds the scope of this project, and it provides little add-on value for experiencing with CUI but would be extremely time consuming. Therefore, all user is fixed to user_id of 1, which means there is only "1 user" for the entire application.
#### Coffee customization is disabled
Due to the limitation of dialogflow, the order supports only "number of coffee" cups of "type of coffee". Add another entity "size of coffee" in the middle would be very time consuming and hard to implement. Using an advanced NLP solution would be far too difficult for the project. Also, this "a cup of coffee" isn't supported due to limitation of dialogflow entity recognition.