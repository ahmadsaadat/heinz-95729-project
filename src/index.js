// // const dialogflow = require('dialogflow');

const { dialogflow, Image } = require('actions-on-google');
const { MongoClient, ServerApiVersion } = require('mongodb');

async function insert_cart_item(user_id, cart_item, quantity) {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri =
        'mongodb+srv://ecomm:0Ax6t45R3tdgU8oR@cluster0.z4xh1w1.mongodb.net/?retryWrites=true&w=majority';

    const client = new MongoClient(uri);

    var rec = {
        user_id: user_id,
        cart: { cart_item: cart_item, quantity: quantity },
    };

    try {
        await client.connect();
        await client
            .db('main')
            .collection('order')
            .insertOne(rec)
            .catch(console.log('failed insertion'));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const app = dialogflow({ debug: true });
console.log('in index.js');

app.intent('Default Welcome Intent', (conv) => {
    console.log(JSON.stringify(conv));

    console.log('in default welcome intent handler');
    conv.ask('Hello from the a team!');
});

app.intent('Default Fallback Intent', (conv) => {
    conv.ask(`Sorry I didn't get that`);
    conv.ask(
        new Image({
            url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
            alt: 'A cat',
        })
    );
});

app.intent('order.additem', (conv) => {
    console.log(JSON.stringify(conv));
    console.log('additem');
    console.log(JSON.stringify(conv.body.queryResult.parameters));

    // user id is assumed to be always one
    // this isn't correct in production, but within the scope of project, user
    // authentication / authorization will be too much work
    user_id = 1;
    item = 'coffee';
    quantity = 1;
    insert_cart_item(user_id, item, quantity);

    conv.ask('Yes');
});

exports.handler = app;
