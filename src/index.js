// // const dialogflow = require('dialogflow');

const { dialogflow, Image } = require('actions-on-google');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
    'mongodb+srv://ecomm:0Ax6t45R3tdgU8oR@cluster0.z4xh1w1.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function insert_cart_item(user_id, items) {
    var rec = {
        user_id: user_id,
        items,
        placed: false,
    };

    try {
        await client.connect();
        const query = { user_id: user_id, placed: false };
        newdoc = await client.db('main').collection('order').findOne(query);

        if (newdoc == null) {
            await client.db('main').collection('order').insertOne(rec).catch();
        } else {
            const update_query = { user_id: user_id };
            console.log('has document');

            // add the current coffee into the document
            await client
                .db('main')
                .collection('order')
                .updateOne(update_query, {
                    $push: { items: { $each: items } },
                });

            // aggregate duplicated coffees
            const agg = [
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.coffee',
                        number: { $sum: '$items.number' },
                    },
                },
                {
                    $group: {
                        _id: 0,
                        items: { $push: { coffee: '$_id', number: '$number' } },
                    },
                },
                { $project: { _id: 0, items: 1 } },
            ];

            const result = await client
                .db('main')
                .collection('order')
                .aggregate(agg);

            for await (const doc of result) {
                await client
                    .db('main')
                    .collection('order')
                    .updateOne({ user_id: user_id }, { $set: doc });
                return doc;
            }
        }
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
    console.log('additem');

    // user id is assumed to be always one
    // this isn't correct in production, but within the scope of project, user
    // authentication / authorization will be too much work
    user_id = 1;

    params = conv.body.queryResult.parameters;
    items = params['number-coffee'];
    console.log(items);
    insert_cart_item(user_id, items);

    conv.ask('Coffee added to cart. Current cart includes ');
});

exports.handler = app;
