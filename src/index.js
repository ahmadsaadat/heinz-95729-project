// // const dialogflow = require('dialogflow');

const {
    dialogflow,
    Image,
    BasicCard,
    Suggestions,
} = require('actions-on-google');

const app = dialogflow({ debug: true });
const Personalization = require('./Personalization');
const ResponseCodes = require('./ResponseCodes');

console.log('in index.js');

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(
        'Welcome to Starbux! You can say things like: Hear menu or place an order'
    );
    conv.ask(
        new BasicCard({
            text: `Welcome to Starbux! You can say things like: Hear menu, place an order or personalize`,
            title: 'Welcome to Starbux!',
            image: new Image({
                url: 'https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/starbux_welcome_picture.jpg',
                alt: 'Welcome_To_Starbux_Image',
            }),
        })
    );
    conv.ask(new Suggestions(['Hear Menu', 'Place an order', 'Personalize']));
});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask(
        `Sorry I didn't get that, you can say things like Hear the menu, place an order or personalize`
    );
    conv.ask(
        new BasicCard({
            text: `Sorry I didn't get that, you can say things like Hear the menu, place an order or personalize`,
            title: `Sorry I didn't get that 😔`,
            image: new Image({
                url: 'https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/starbux_sad_but_rad.png',
                alt: 'Starbux_sad_but_rad',
            }),
        })
    );
    conv.ask(new Suggestions(['Hear Menu', 'Place an order', 'Personalize']));
});

app.intent('Personalize', async (conv) => {
    let responseCode = await new Personalization().relay();

    conv.ask(
        'Please tell me your favorite drink and favorite pick up location'
    );
});

app.intent('Personalize-followup', async (conv, event) => {
    console.log('Personalize-followup');
    let updateStatus = await new Personalization().update(
        event.Coffee,
        event.location['street-address']
    );

    console.log('updateStatus: ' + updateStatus);

    conv.ask(
        `Okay I have updated your favorite drink to ${event.Coffee} and your favorite pick up location to ${event.location['street-address']}`
    );
    conv.ask(
        `Is there anything else you'd like to do? You can say things like order coffee or hear the menu`
    );
});

app.intent('order.additem', (conv) => {
    console.log('additem');

    // user id is assumed to be always one
    // this isn't correct in production, but within the scope of project, user
    // authentication / authorization will be too much work
    // user_id = 1;

    // params = conv.body.queryResult.parameters;
    // items = params['number-coffee'];

    // insert_cart_item(user_id, items);

    conv.ask('Coffee added to order.');
});

exports.handler = app;
