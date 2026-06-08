import fs from 'fs';

const sitemapPath = 'public/sitemap.xml';
let content = fs.readFileSync(sitemapPath, 'utf8');

// replace <loc>https://financetoolslab.com/something</loc> with <loc>https://financetoolslab.com/something/</loc>
content = content.replace(/<loc>https:\/\/financetoolslab\.com\/([a-zA-Z0-9-]+)<\/loc>/g, "<loc>https://financetoolslab.com/$1/</loc>");

fs.writeFileSync(sitemapPath, content);
console.log('Updated sitemap.xml');
