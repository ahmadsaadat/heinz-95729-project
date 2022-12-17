const dbExecutor = require('./DatabaseExecutor');
const ResponseCodes = require('./ResponseCodes');

class Cart {
    constructor() {}

    async addFavorite() {
        console.log('add favorite');

        const fav = await new dbExecutor().readProfileItem();
        await new dbExecutor().insertCartItem([fav.favorite_drink]).then();

        return fav.favorite_drink;
    }

    async addToCart(conv) {
        let params = conv.body.queryResult.parameters;
        let items = params['ToppingAndCoffee'];
        await new dbExecutor().insertCartItem(items);

        console.log('addToCart items: ' + items);

        return items;
    }

    async showCart() {
        var result = await new dbExecutor().showCartItem(1).then();
        let coffeeOrderMap = new Map();
        let reply = '';

        if (result.length == 0) {
            reply = 'Your cart is empty! Maybe consider adding some drinks!';
        } else {
            reply = 'Your cart includes ';
            result.forEach(function (value, i) {
                if (!coffeeOrderMap.has(value)) {
                    coffeeOrderMap.set(value, 1);
                } else {
                    let quantity = coffeeOrderMap.get(value);
                    quantity += 1;
                    coffeeOrderMap.set(value, quantity);
                }
            });

            let order = '';
            let index = 0;
            coffeeOrderMap.forEach((val, key) => {
                index++;
                if (index != coffeeOrderMap.size) {
                    order += val + ' ' + key + 's, ';
                } else {
                    order += 'and ' + val + ' ' + key + 's';
                }
            });

            reply =
                reply +
                order +
                `, would you like to checkout? You can always say clear cart to clear your cart`;
        }

        return {
            reply: reply,
            code: result.length == 0 ? ResponseCodes.CART_IS_EMPTY : '',
        };
    }

    async clearCart() {
        return await new dbExecutor().clearCart();
    }
}

module.exports = Cart;
