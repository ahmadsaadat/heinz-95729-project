const dbExecutor = require('./DatabaseExecutor');
//response codes
const ResponseCodes = require('./ResponseCodes');

class Personalization {
    constructor() {}

    /*
        relays until personalization is complete
        1: checks to see what has already been personalized and if anything is missing it asks the user for that input, inputs are favorite_drink and favorite_location for pickup
        2: sets up personalization for the first time if it hasn't been done already
        3: modifications to personalization
    */
    async relay() {
        const userProfile = await new dbExecutor().readProfileItem();

        if (userProfile == null) {
            console.log('USER_DOES_NOT_EXIST');
            return ResponseCodes.USER_DOES_NOT_EXIST;
        } else {
            return 2;
        }
    }

    async update(coffee, location) {
        console.log('Personalization update');
        if (coffee && location) {
            const updateUserProfile = await new dbExecutor().updateProfileItems(
                coffee,
                location
            );
        }
        console.log('Personalization update close');
        return;
    }
}

module.exports = Personalization;
