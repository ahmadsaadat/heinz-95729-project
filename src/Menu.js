const menuItems = [
    'Americano',
    'Black Coffee',
    'Hot Latte',
    'Iced Latte',
    'Cappuccino',
    'Mocha',
    'Macchiato',
    'Cold Brew',
];

const toppingItems = ['Cinnamon', 'Caramel'];

class Menu {
    constructor() {}

    renderMenu() {
        let menuString = '';

        menuString += menuItems[0];
        for (let i = 1; i < menuItems.length - 1; i++) {
            menuString += ', ' + menuItems[i];
        }
        menuString += ' and ' + menuItems[menuItems.length - 1];

        return menuString;
    }

    renderToppings() {
        let toppingString = '';

        toppingString = toppingItems[0];
        for (let i = 1; i < toppingItems.length; i++) {
            toppingString += 'and ' + toppingItems[i];
        }

        return toppingString;
    }
}

module.exports = Menu;
