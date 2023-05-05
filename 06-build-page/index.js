const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const dirPathComponents = path.join(__dirname, 'components');
const dirPathStyles = path.join(__dirname, 'styles');
const dirPathAssets = path.join(__dirname, 'assets');
const dirPathProjectDist = path.join(__dirname, 'project-dist', 'assets');

const filePathTemplate = path.join(__dirname, 'template.html');
const filePathIndex = path.join(__dirname, 'project-dist', 'index.html');
const filePathStyle = path.join(__dirname, 'project-dist', 'style.css');

/*Внутри функции создается регулярное выражение, которое ищет тег вида {{ tag }} 
в тексте файла и заменяет его на переданную строку replacement.*/

const replaceTags = (content, tag, replacement) => {
    const regex = new RegExp(`{{\\s*${tag}\\s*}}`, 'gm');
    return content.replace(regex, replacement);
};

/*Объявляю функцию readComponentFile, которая асинхронно читает содержимое 
компонента из файла с именем ${componentName}.html.*/

const readComponentFile = async (componentName) => {
    const filePath = path.join(dirPathComponents, `${componentName}.html`);
    return fs.promises.readFile(filePath, 'utf-8');
};

/*Объявляю функцию readStyleFile, которая асинхронно читает 
содержимое стилей из файла с именем ${styleName}.css.*/

const readStyleFile = async (styleName) => {
    const filePath = path.join(dirPathStyles, `${styleName}.css`);
    return fs.promises.readFile(filePath, 'utf-8');
};

const main = async () => {
    try {
        // Создаю папку project-dist
        await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

        // Собираю содержимое index.html
        const templateContent = await fs.promises.readFile(filePathTemplate, 'utf-8'); //читаю содержимое файла "template.html" в переменную templateContent.
        let indexContent = templateContent; //создаю переменную indexContent и присваиваю ей значение переменной templateContent.
        let matches = null; //
        const promises = [];
        while ((matches = indexContent.match(/{{\s*(\S+)\s*}}/))) { /*запускаю цикл while, который будет выполняться до тех пор, 
                                                                       пока в indexContent есть совпадения с регулярным выражением /{{\s*(\S+)\s*}}/. 
                                                                        Каждое совпадение сохраняется в переменной matches.*/
            const componentName = matches[1];
            const componentPromise = readComponentFile(componentName);
            promises.push(componentPromise); // добавляю промис чтения компонента в массив promises.
            const componentContent = await componentPromise; // ожидаю выполнение промиса чтения компонента и сохраняю его содержимое в переменную componentContent.
            indexContent = replaceTags(indexContent, componentName, componentContent); //заменяю тег {{componentName}} в indexContent на содержимое компонента componentContent с помощью функции replaceTags.
        }
        await Promise.all(promises); //жду выполнения всех промисов чтения компонентов из массива promises.
        await fs.promises.writeFile(filePathIndex, indexContent); //записываю полученный результат в файл index.html.

        // Собираю содержимое style.css
        const styleNames = await fs.promises.readdir(dirPathStyles);
        const stylePromises = styleNames
            .filter((fileName) => path.extname(fileName) === '.css')
            .map((styleName) => readStyleFile(path.parse(styleName).name));
        const styleContents = await Promise.all(stylePromises);
        const styleContent = styleContents.join('\n');
        await fs.promises.writeFile(filePathStyle, styleContent);

        // Копирую папку assets
        await fse.copy(dirPathAssets, dirPathProjectDist);

        console.log('Build succeeded!');
    } catch (error) {
        console.error('Build failed:', error);
    }
};

main();
