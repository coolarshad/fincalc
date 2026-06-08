import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (file === 'page.tsx') filelist.push(dirFile);
    }
  });
  return filelist;
};

const pages = walkSync('src/app');

pages.forEach(page => {
  let content = fs.readFileSync(page, 'utf8');
  let originalContent = content;

  // Replace canonical: 'https://financetoolslab.com', with canonical: 'https://financetoolslab.com/',
  content = content.replace(/canonical:\s*'https:\/\/financetoolslab\.com',/g, "canonical: 'https://financetoolslab.com/',");
  
  // Replace canonical: `https://financetoolslab.com/something`, with canonical: `https://financetoolslab.com/something/`,
  content = content.replace(/canonical:\s*`https:\/\/financetoolslab\.com\/([^`\/]+)`/g, "canonical: `https://financetoolslab.com/$1/`");
  
  // Replace canonical: 'https://financetoolslab.com/something', with canonical: 'https://financetoolslab.com/something/',
  content = content.replace(/canonical:\s*'https:\/\/financetoolslab\.com\/([^'\/]+)'/g, "canonical: 'https://financetoolslab.com/$1/'");

  if (content !== originalContent) {
    fs.writeFileSync(page, content);
    console.log(`Updated ${page}`);
  }
});
