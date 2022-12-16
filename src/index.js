// // const dialogflow = require('dialogflow');

const {
    dialogflow,
    Image,
    BasicCard,
    Suggestions,
} = require('actions-on-google');
const dbExecutor = require('./DatabaseExecutor');

const app = dialogflow({ debug: true });
const Personalization = require('./Personalization');
const Menu = require('./Menu');
const Cart = require('./Cart');
const ResponseCodes = require('./ResponseCodes');

app.intent('Default Welcome Intent', (conv, event) => {
    conv.ask(
        'Welcome to Starbux! You can say things like: Hear menu or place an order'
    );
    conv.ask(
        new BasicCard({
            text: `Welcome to Starbux! You can say things like: Hear menu, place an order or personalize. Say help if you ever need help.`,
            title: 'Welcome to Starbux!',
            image: new Image({
                url: 'https://ecomm-starbux-artifact-bucket.s3.amazonaws.com/starbux_welcome_picture.jpg',
                alt: 'Welcome_To_Starbux_Image',
            }),
        })
    );
    conv.ask(
        new Suggestions(['Hear Menu', 'Place an order', 'Personalize', 'Help'])
    );
});

app.intent('Default Fallback Intent', (conv, event) => {
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
        'Please tell me your favorite drink and your favorite pick up location'
    );
});

app.intent('Personalize-followup', async (conv, event) => {
    console.log('Personalize-followup');
    let updateStatus = await new Personalization().update(
        event.Coffee,
        event.location['street-address']
    );

    conv.ask(
        `Okay I have updated your favorite drink to ${event.Coffee} and your favorite pick up location to ${event.location['street-address']}`
    );
    conv.ask(
        `Is there anything else you'd like to do? You can say things like order coffee or hear the menu`
    );
    conv.ask(new Suggestions(['Order Coffee', 'Hear Menu']));
});

app.intent('Menu', async (conv, event) => {
    let menu = new Menu();
    conv.ask(
        `The menu consists of ${menu.renderMenu()}, and toppings consists of ${menu.renderToppings()}. Would you like to Order Coffee or Personalize?`
    );
    conv.ask(new Suggestions(['Order Coffee', 'Personalize']));
});

app.intent('Help', (conv, event) => {
    conv.ask(
        `Let me help you. To order a custom drink, you can say 'order cinammon latte', once you've added everything to your cart you can say 'checkout' and the system will place your order for pickup at the location of your choosing.`
    );
});

app.intent('Add Item', async (conv, event) => {
    let addCartResponse = await new Cart().addToCart(conv);
    conv.ask(
        `Okay I have added ${addCartResponse} to your cart, you can either add another drink or when you're ready you can say checkout.`
    );
    conv.ask(new Suggestions(['Add Latte', 'Check Out', 'Hear Menu', 'Cart']));
});

app.intent('Show Cart', async (conv) => {
    let showCartResponse = await new Cart().showCart();
    if (showCartResponse.code == ResponseCodes.CART_IS_EMPTY) {
        conv.ask(showCartResponse.reply);
        conv.ask(new Suggestions(['Add Cinnamon Latte']));
    } else {
        conv.ask(showCartResponse.reply);
        conv.ask(new Suggestions(['Yes', 'No', 'Clear Cart']));
    }
});

app.intent('Show Cart - yes', async (conv) => {
    conv.ask(`Your order will be available for pickup in a little bit`);
});

app.intent('Show Cart - no', async (conv) => {
    conv.ask(`Ok, you can either add drinks to your cart, or clear your cart`);
    conv.ask(new Suggestions(['Add Caramel Iced Latte', 'Clear Cart']));
});

app.intent('order.clearcart', async (conv) => {
    console.log('clear cart');
    new dbExecutor().clearCart();
    conv.ask('Your cart has been cleared.');
});

app.intent('Place Order', async (conv) => {
    conv.ask(
        'Ok, what would you like to order? You can say things like Black Coffee, Cinnamon Iced Latte or Hear menu'
    );
    conv.ask(
        new Suggestions(['Black Coffee', 'Cinnamon Iced Latte', 'Hear Menu'])
    );
});

exports.handler = app;
