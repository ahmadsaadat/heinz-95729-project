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

class Menu {
    constructor() {}

    render() {
        let menuString = '';

        menuString += menuItems[0];
        for (let i = 1; i < menuItems.length - 1; i++) {
            menuString += ', ' + menuItems[i];
        }
        menuString += ' and ' + menuItems[menuItems.length - 1];

        return menuString;
    }
}

module.exports = Menu;
