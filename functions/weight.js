/**
 * Calculate the weight for a project
 * @param {object} project 
 * @returns {float}
 */

function weight(project) {
    const shared = new Date(project.shared);
    const now = new Date();
    const age = (now - shared) / (1000 * 60 * 60 * 24 * 40);
    const ageWeight = 2 / (age + 1);
    const curatorsWeight = project.count; 
    return ageWeight * curatorsWeight;
}

module.exports = weight;
