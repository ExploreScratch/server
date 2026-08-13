const fs = require('fs');
const path = require('path');
const weight = require('../functions/weight');

const projects = require('../output/explore.json');

const weighted = projects.map(project => {
    project.weight = weight(project);
    return project;
}).sort((a, b) => b.weight - a.weight);

fs.writeFileSync(path.join(__dirname, '../output/explore.json'), JSON.stringify(weighted, null, 2));