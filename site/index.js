const fs = require('fs');
const path = require('path');
const request = require('../functions/network');

(async () => {
    const podcasts = await request('https://api.scratch.mit.edu/studios/51663430/projects?limit=4');

    if (podcasts) {
        const information = {
            podcasts: podcasts.map(project => {
                return {
                    id: project.id,
                    title: project.title,
                    username: project.username,
                    avatar: project.avatar['32x32'],
                    banner: project.image
                }
            })
        };

        fs.writeFileSync(path.join(__dirname, '../output/site.json'), JSON.stringify(information, null, 2));
    }
})();
