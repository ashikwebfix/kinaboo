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

const replaceRouter = () => {
    const files = walk('./src');
    files.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(file, 'utf8');
            let originalContent = content;

            // Handle imports
            if (content.includes('react-router-dom')) {
                let hooksToImport = [];
                if (content.includes('useNavigate')) hooksToImport.push('useRouter');
                if (content.includes('useParams')) hooksToImport.push('useParams');
                if (content.includes('useLocation')) hooksToImport.push('usePathname', 'useSearchParams');
                if (content.includes('useSearchParams')) hooksToImport.push('useSearchParams');

                // Remove react-router-dom import
                content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
                    let nextImports = '';
                    if (hooksToImport.length > 0) {
                        nextImports += `import { ${[...new Set(hooksToImport)].join(', ')} } from 'next/navigation';\n`;
                    }
                    if (imports.includes('Link')) {
                        nextImports += `import Link from 'next/link';\n`;
                    }
                    return nextImports;
                });
                
                content = content.replace(/import\s+Link\s+from\s+['"]react-router-dom['"];?/g, `import Link from 'next/link';\n`);
            }

            // Replace useNavigate
            content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
            content = content.replace(/navigate\(/g, 'router.push(');

            // Replace useLocation (this is tricky, usually used for location.pathname)
            content = content.replace(/const\s+location\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();\n  const searchParams = useSearchParams();\n  const location = { pathname, search: searchParams.toString() ? "?" + searchParams.toString() : "" };');

            // Replace <Link to="..."> with <Link href="...">
            content = content.replace(/<Link([^>]+)to=/g, '<Link$1href=');

            if (content !== originalContent) {
                fs.writeFileSync(file, content, 'utf8');
                console.log(`Updated router in ${file}`);
            }
        }
    });
};

replaceRouter();
