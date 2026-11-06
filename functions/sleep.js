/**
 * Wait for a certain amount of time, you know the drill
 * @param {integer} ms 
 * @returns {Promise}
 */

export default function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
