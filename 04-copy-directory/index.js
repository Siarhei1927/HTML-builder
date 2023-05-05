const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    const srcDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');

    try {
        await fs.access(destDir);
    } catch (err) {
        await fs.mkdir(destDir);
    }

    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }

    const copyFiles = await fs.readdir(destDir);
    for (const file of copyFiles) {
        if (!entries.some(entry => entry.name === file)) {
            const filePath = path.join(destDir, file);
            await fs.unlink(filePath);
            console.log(`File ${file} was removed successfully`);
        }
    }
}

copyDir().catch(console.error);