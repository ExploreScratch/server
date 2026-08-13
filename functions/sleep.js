/**
 * Wait for a certain amount of time, you know the drill
 * @param {integer} ms 
 * @returns {Promise}
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = sleep;