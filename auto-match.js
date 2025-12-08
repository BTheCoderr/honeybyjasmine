const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, 'public', 'images', 'meals');

// UPDATE THESE NUMBERS to match your images (1-12)
// Based on the list shown above
// Note: The script will preserve original file extensions (PNG, JPEG, etc.)
const MAPPING = {
  'salmon-bowl': 4,        // IMG_2782.png - Salmon with grains (11.11 MB)
  'chicken-wrap': 2,        // IMG_2042.jpeg - Mediterranean wrap (0.37 MB)
  'veggie-bowl': 3,        // IMG_2387.png - Chickpea salad (1.35 MB)
  'turkey-meatballs': 5,    // IMG_4814.png - Pasta dish (9.24 MB)
  'thai-curry': 6,         // IMG_4884.png - Curry dish (11.63 MB)
  'bbq-chicken': 1,         // FullSizeRender.png - BBQ dish (9.40 MB)
};

const MEAL_FILES = [
  'FullSizeRender.png',
  'IMG_2042.jpeg',
  'IMG_2387.png',
  'IMG_2782.png',
  'IMG_4814.png',
  'IMG_4884.png',
  'Untitled design (1) copy.png',
  'Untitled design (1).png',
  'Untitled design copy 2.png',
  'Untitled design copy 3.png',
  'Untitled design copy.png',
  'Untitled design.png',
];

function main() {
  console.log('\n🍯 Auto-Matching Images\n');
  
  let successCount = 0;
  
  for (const [targetFilename, imageNumber] of Object.entries(MAPPING)) {
    if (imageNumber < 1 || imageNumber > MEAL_FILES.length) {
      console.log(`⚠️  Invalid image number ${imageNumber} for ${targetFilename}`);
      continue;
    }
    
    const sourceFile = MEAL_FILES[imageNumber - 1];
    const sourcePath = path.join(TARGET_DIR, sourceFile);
    // Preserve the original file extension (PNG, JPEG, etc.)
    const sourceExt = path.extname(sourceFile).toLowerCase();
    const baseName = path.basename(targetFilename, path.extname(targetFilename));
    const finalFilename = baseName + sourceExt; // Keep original extension
    const targetPath = path.join(TARGET_DIR, finalFilename);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`❌ Source file not found: ${sourceFile}`);
      continue;
    }
    
    if (fs.existsSync(targetPath) && sourcePath !== targetPath) {
      console.log(`⚠️  ${finalFilename} already exists, skipping...`);
      continue;
    }
    
    try {
      if (sourcePath === targetPath) {
        // Need to rename
        const tempPath = path.join(TARGET_DIR, `temp_${Date.now()}${ext}`);
        fs.renameSync(sourcePath, tempPath);
        fs.renameSync(tempPath, targetPath);
        console.log(`✅ Renamed ${sourceFile} → ${finalFilename}`);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✅ Copied ${sourceFile} → ${finalFilename}`);
      }
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${sourceFile}: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Successfully matched ${successCount} image(s)!\n`);
  
  // Show final status
  const MEAL_MAPPINGS = {
    'salmon-bowl': 'Honey Glazed Salmon Bowl',
    'chicken-wrap': 'Mediterranean Chicken Wrap',
    'veggie-bowl': 'Veggie Power Bowl',
    'turkey-meatballs': 'Turkey Meatball Marinara',
    'thai-curry': 'Thai Curry with Jasmine Rice',
    'bbq-chicken': 'BBQ Pulled Chicken Bowl'
  };
  
  console.log('Final status:');
  for (const [filename, mealName] of Object.entries(MEAL_MAPPINGS)) {
    const baseName = path.basename(filename, path.extname(filename));
    // Check for any extension (png, jpg, jpeg, webp)
    const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
    let found = false;
    let foundFile = '';
    
    for (const ext of possibleExtensions) {
      const checkFile = baseName + ext;
      const checkPath = path.join(TARGET_DIR, checkFile);
      if (fs.existsSync(checkPath)) {
        found = true;
        foundFile = checkFile;
        break;
      }
    }
    
    const status = found ? '✅' : '❌';
    console.log(`  ${status} ${foundFile || filename} - ${mealName}`);
  }
  console.log('');
}

main();

