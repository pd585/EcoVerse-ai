const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, '../public/learn'),
  path.join(__dirname, '../public/images'),
  path.join(__dirname, '../public/assests/Ecoverse Bg image')
];

async function convert() {
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.warn(`Directory not found: ${dir}`);
      continue;
    }
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const inputPath = path.join(dir, file);
        const outputPath = path.join(dir, file.replace('.png', '.webp'));
        console.log(`Converting ${file} to WebP...`);
        
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        fs.unlinkSync(inputPath);
        console.log(`Deleted original: ${file}`);
      }
    }
  }
}

convert()
  .then(() => console.log('Image conversion complete! All PNGs converted to WebP.'))
  .catch(console.error);
