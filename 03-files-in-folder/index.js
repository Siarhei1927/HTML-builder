const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

(async () => {
    try {
        const files = await fs.readdir(folderPath, { withFileTypes: true });

        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(folderPath, file.name);
                const { name, ext } = path.parse(filePath);
                const stats = await fs.stat(filePath);

                console.log(`${name} - ${ext} - ${stats.size}b`);
            }
        }
    } catch (err) {
        console.error(err);
    }
})();