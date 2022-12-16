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

run();
