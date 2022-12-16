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
            time: new Date(),
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
                // add the current coffee into the document
                await client
                    .db('main')
                    .collection('order')
                    .updateOne(query, {
                        $push: { items: { $each: items } },
                    });

                // aggregate duplicated coffees
                const agg = [
                    { $match: { placed: false, user_id: user_id } },
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
                        .updateOne(query, { $set: doc });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    async showCartItem(user_id) {
        let cart = {};

        await client.connect();
        cart = await client
            .db('main')
            .collection('order')
            .findOne({ user_id: user_id, placed: false })
            .then((document) => {
                console.log(document);
                client.close();
                if (!document) {
                    return [];
                } else {
                    return document.items;
                }
            })
            .catch((err) => {
                console.log(err);
                client.close();
                return [];
            });

        //console.log('cart: ' + JSON.stringify(cart));

        return cart;
    }

    async placeOrder(user_id) {
        let update = {
            $set: {
                placed: true,
            },
        };

        await client.connect();
        return await client
            .db('main')
            .collection('order')
            .updateOne({ user_id: user_id, placed: false }, update, {
                upsert: false,
            })
            .then(() => {
                client.close();
                return;
            });
    }

    async clearCart(user_id) {
        let update = {
            $set: {
                items: [],
            },
        };

        await client.connect();
        return await client
            .db('main')
            .collection('order')
            .deleteOne({ user_id: user_id, placed: false })
            .then(() => {
                client.close();
                return;
            });
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
