const fs = require('fs');
const path = require('path');
const request = require('../functions/network');
const sleep = require('../functions/sleep');
const weight = require('../functions/weight');

const LIMIT = 350;

// If you are on this list and you would rather not be, you can contact me on scratch @Penthusiast
const curators = require('./curators.json');

let projects = new Map();

(async () => {
    for (const curator of curators) {
        const favorites = await request(`https://api.scratch.mit.edu/users/${curator}/favorites`);
        for (const project of favorites) {
            if (projects.has(project.id)) {
                projects.get(project.id).count++;
            } else {
                if (project.is_published) {
                    projects.set(project.id, {
                            count: 1,
                            id: project.id,
                            title: project.title,
                            shared: project.history.shared,
                            banner: project.image,
                            avatar: project.author.profile.images['32x32'],
                            loves: project.stats.loves,
                            favorites: project.stats.favorites,
                            views: project.stats.views
                        }
                    )
                }
            }
        }

        // For safety, we aren't spamming the endpoint
        await sleep(100);
    }

    console.log('[+] Finished discovering projects, processing!');

    let finalProjects = [...projects.values()].filter(project => {
        return (project.loves > 5) && (project.favorites > 5);
    }).map(project => {
        project.weight = weight(project);
        return project;
    }).sort((a, b) => b.weight - a.weight).slice(0, LIMIT);

    // Since scratch just doesn't return usernames we have to fetch 
    // per project to get the username lol

    console.log(`[+] Resolving usernames for ${finalProjects.length} projects`);

    for (const project of finalProjects) {
        const information = await request(`https://api.scratch.mit.edu/projects/${project.id}`);
        const username = information ? information.author.username : 'SERVER_ERR';
        project.username = username;
        await sleep(20);
    }

    fs.writeFileSync(path.join(__dirname, "../output/explore.json"), JSON.stringify(finalProjects, null, 2));
})();
