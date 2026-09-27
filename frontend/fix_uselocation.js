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

const fixLocation = () => {
    const files = walk('./src');
    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let originalContent = content;
            
            // If the file uses `const { pathname } = useLocation();`
            content = content.replace(/const\s*{\s*pathname\s*}\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();');
            // If the file uses `useLocation().pathname`
            content = content.replace(/useLocation\(\)\.pathname/g, 'usePathname()');
            // Any remaining useLocation
            content = content.replace(/useLocation\(\)/g, '{ pathname: usePathname(), search: useSearchParams().toString() }');

            if (content !== originalContent) {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`Updated useLocation in ${file}`);
            }
        }
    });
};

fixLocation();
