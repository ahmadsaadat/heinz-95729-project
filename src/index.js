// const dialogflow = require('dialogflow');

exports.handler = function (event, context, callback) {
    console.log(JSON.stringify(event));

    var response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
        body: 'Connor is the best!',
    };
    callback(null, response);
};
