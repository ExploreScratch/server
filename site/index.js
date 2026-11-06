import fs from 'node:fs';
import path from 'node:path';
import request from '../functions/request.js';

(async () => {
    console.log('[+] Compiling featured podcasts');
    const podcasts = await request('https://api.scratch.mit.edu/studios/51663430/projects?limit=4');
    console.log('[+] Compiling featured projects');
    const featured = await request('https://api.scratch.mit.edu/studios/52136091/projects?limit=4');

    const information = {
        podcasts: podcasts ? [...podcasts.map(project => {
            return {
                id: project.id,
                title: project.title,
                username: project.username,
                avatar: project.avatar['32x32'],
                banner: project.image
            }
        })] : [],
        featured: featured ? [...featured.map(project => {
            return {
                id: project.id,
                title: project.title,
                username: project.username,
                avatar: project.avatar['32x32'],
                banner: project.image
            }
        })] : [],
    };

    fs.writeFileSync(path.join(import.meta.dirname, '../output/site.json'), JSON.stringify(information, null, 2));
})();
