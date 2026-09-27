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

const fixLocalStorage = () => {
    const files = walk('./src');
    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let originalContent = content;
            
            // Safe replacement for localStorage.getItem
            // We want to replace `localStorage.getItem('key')` with `(typeof window !== 'undefined' ? localStorage.getItem('key') : null)`
            content = content.replace(/localStorage\.getItem\(([^)]+)\)/g, "(typeof window !== 'undefined' ? localStorage.getItem($1) : null)");
            
            // Clean up any double wrappers just in case
            content = content.replace(/\(typeof window !== 'undefined' \? \(typeof window !== 'undefined' \? localStorage\.getItem\(([^)]+)\) : null\) : null\)/g, "(typeof window !== 'undefined' ? localStorage.getItem($1) : null)");

            // Safe replacement for localStorage.setItem and removeItem
            // But usually setItem/removeItem happens inside useEffect or handlers, so they are fine, but let's be safe.
            // content = content.replace(/localStorage\.setItem/g, "typeof window !== 'undefined' && localStorage.setItem");
            
            if (content !== originalContent) {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`Updated localStorage in ${file}`);
            }
        }
    });
};

fixLocalStorage();
