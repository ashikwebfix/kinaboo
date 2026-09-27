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

const replaceEnv = () => {
    const files = walk('./src');
    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let newContent = content.replace(/import\.meta\.env\.VITE_API_URL/g, "process.env.NEXT_PUBLIC_API_URL");
            
            // Temporary measure: add 'use client' to files using hooks
            if (newContent.includes('useParams') || newContent.includes('useNavigate') || newContent.includes('useLocation') || newContent.includes('useState') || newContent.includes('useEffect')) {
                if (!newContent.startsWith('"use client";') && !newContent.startsWith("'use client';")) {
                    newContent = '"use client";\n' + newContent;
                }
            }
            
            if (content !== newContent) {
                fs.writeFileSync(file, newContent, 'utf8');
                console.log(`Updated ${file}`);
            }
        }
    });
};

replaceEnv();
