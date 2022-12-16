const dbExecutor = require('./dbExecutor');
const responseCodes = require('./ResponseCodes');

function run() {
    return new dbExecutor()
        .updateProfileItems('Black Coffee', 'Craig St.')
        .then(async (code) => {
            console.log(code);
            return code;
        });
}

function add() {
    new dbExecutor()
        .insertCartItem(1, [{ coffee: 'Machiato', number: 1 }])
        .then();
}

async function t2() {
    result = await new dbExecutor().showCartItem(1).then();
    if (result.length == 0) {
        reply = 'Your cart is empty! Maybe consider add some coffee here!';
    } else {
        reply = 'Your cart includes ';
        result.forEach((value, i) => {
            if (i == 0) {
                reply =
                    reply + result[0].number + ' cups of ' + result[0].coffee;
            } else {
                reply =
                    reply +
                    ' and ' +
                    result[i].number +
                    ' cups of ' +
                    result[i].coffee;
            }
        });
    }
    console.log(reply);
}

async function cart() {
    const c = await new dbExecutor().showCartItem(1);
    console.log(c);
}

function t3() {
    new dbExecutor().placeOrder(1);
}

function clear() {
    new dbExecutor().clearCart(1);
}

add();
