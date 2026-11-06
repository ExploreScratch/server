import fs from 'node:fs';
import path from 'node:path';
import request from '../functions/request.js';
import sleep from '../functions/sleep.js';
import weight from '../functions/weight.js';

const dirname = import.meta.dirname;

const LIMIT = 350;

// If you are on this list and you would rather not be, you can contact me on scratch @Penthusiast
const curators = JSON.parse(fs.readFileSync(path.join(dirname, './curators.json'), 'utf-8'));

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
        return (project.loves > 10) && (project.favorites > 10);
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

    fs.writeFileSync(
        path.join(dirname, "../output/explore.json"), 
        JSON.stringify(finalProjects.filter(project => (project.username !== 'SERVER_ERR')), null, 2)
    );
})();
