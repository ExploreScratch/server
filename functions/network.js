/**
 * Abstraction layer for the fetch function
 * @param {string} url 
 * @returns {object}
 */

async function request(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const json = await response.json();
        return json;

    } catch (error) {
        console.error(error);
    }
}

module.exports = request;
