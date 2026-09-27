const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
};

const renamePages = () => {
    // 1. Rename the directory
    if (fs.existsSync('./src/pages')) {
        fs.renameSync('./src/pages', './src/views');
    }

    // 2. Replace imports
    const files = walk('./src');
    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let originalContent = content;
            
            // Regex to replace 'pages' in import paths
            content = content.replace(/from\s+['"]([^'"]*)pages\/(.*?)['"]/g, "from '$1views/$2'");
            content = content.replace(/import\s+['"]([^'"]*)pages\/(.*?)['"]/g, "import '$1views/$2'");

            if (content !== originalContent) {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`Updated paths in ${file}`);
            }
        }
    });
};

renamePages();
