const bcrypt = require('bcrypt');
const salt_round = 10;


async function hashPassword(password) {
    return await bcrypt.hash(password, salt_round);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {hashPassword, comparePassword};