function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

module.exports = {
    randomInt,
    randomIntInc
};