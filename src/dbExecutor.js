const { MongoClient } = require('mongodb');
const uri =
    'mongodb+srv://ecomm:0Ax6t45R3tdgU8oR@cluster0.z4xh1w1.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

/*
TODO: to set up full personalization, this will require more work 
such as setting up user authentication & authorization, however for now
we will assume that one person is using this app, thus user_id will always be 1
*/
const user_id = 1;
class dbExecutor {
    constructor() {}

    async insertCartItem(user_id, items) {
        var rec = {
            user_id: user_id,
            items,
            placed: false,
        };

        try {
            await client.connect();
            const query = { user_id: user_id, placed: false };
            let newdoc = await client
                .db('main')
                .collection('order')
                .findOne(query);

            if (newdoc == null) {
                await client
                    .db('main')
                    .collection('order')
                    .insertOne(rec)
                    .catch();
            } else {
                const update_query = { user_id: user_id };

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
                            items: {
                                $push: { coffee: '$_id', number: '$number' },
                            },
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
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    async updateProfileItems(coffee, location) {
        let update = {
            $set: {
                favorite_drink: coffee,
                favorite_location: location,
            },
        };

        await client.connect();
        return await client
            .db('main')
            .collection('profile')
            .updateOne({ user_id: user_id }, update, { upsert: false })
            .then(() => {
                client.close();
                return;
            });
    }

    async readProfileItem() {
        let userProfile = {};
        userProfile = await client
            .db('main')
            .collection('profile')
            .findOne({ user_id: user_id })
            .then((document) => {
                client.close();
                return document;
            })
            .catch((err) => {
                client.close();
                return null;
            });

        console.log('userProfile: ' + JSON.stringify(userProfile));

        return userProfile;
    }
}

module.exports = dbExecutor;
