const fs = require('fs').promises;
const path = require('path');

const styles = [];

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

fs.readdir(stylesDir)
    .then(files => {
        const cssFiles = files.filter((file) => path.extname(file) === '.css');

        return Promise.all(
            cssFiles.map(cssFiles => {
                const cssFilePath = path.join(stylesDir, cssFiles);
                return fs.readFile(cssFilePath, 'utf8');
            })
        );
    })
    .then(cssContents => {
        styles.push(...cssContents);

        const bundleFilePath = path.join(distDir, 'bundle.css');
        return fs.writeFile(bundleFilePath, styles.join('\n'), 'utf8');
    })
    .catch(console.error);
