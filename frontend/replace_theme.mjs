import fs from 'fs';
import path from 'path';

const dir = 'c:\\Users\\krish\\smartcar-solutions\\frontend\\src';

function walkPath(dirPath, callback) {
  fs.readdirSync(dirPath).forEach(f => {
    let dirPathFile = path.join(dirPath, f);
    let isDirectory = fs.statSync(dirPathFile).isDirectory();
    if (isDirectory) {
      walkPath(dirPathFile, callback);
    } else {
      if (dirPathFile.endsWith('.js') || dirPathFile.endsWith('.css')) {
         callback(dirPathFile);
      }
    }
  });
}

walkPath(dir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace CSS variables and classes
  content = content.replace(/primary-gold/g, 'primary-blue');
  content = content.replace(/secondary-gold/g, 'secondary-blue');
  content = content.replace(/text-gold/g, 'text-blue');
  content = content.replace(/btn-gold/g, 'btn-blue');
  
  // Replace hex codes
  content = content.replace(/#d4af37/gi, '#4FA8D1'); // Soft smooth blue
  content = content.replace(/#D4AF37/gi, '#4FA8D1'); 
  content = content.replace(/#b8860b/gi, '#3E8CB3'); // Darker smooth blue
  content = content.replace(/#B8860B/gi, '#3E8CB3');
  
  // Replace random inline styles using the hex
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
});
console.log("Done");
