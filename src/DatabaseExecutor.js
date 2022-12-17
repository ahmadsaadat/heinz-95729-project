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
class DatabaseExecutor {
    constructor() {}

    async insertCartItem(items) {
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
                await client
                    .db('main')
                    .collection('order')
                    .updateOne(query, {
                        $push: { items: items[0] },
                    });
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    async showCartItem() {
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

    async clearCart() {
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
        await client.connect();
        let userProfile = {};
        userProfile = await client
            .db('main')
            .collection('profile')
            .findOne({ user_id: user_id })
            .then((document) => {
                console.log('mongo: ' + document);
                client.close();
                return document;
            })
            .catch((err) => {
                console.log('mongoError: ' + err);
                client.close();
                return null;
            });

        console.log('userProfile: ' + JSON.stringify(userProfile));

        return userProfile;
    }
}

module.exports = DatabaseExecutor;
