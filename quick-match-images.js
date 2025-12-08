const fs = require('fs');
const path = require('path');

const MEAL_MAPPINGS = {
  'salmon-bowl.jpg': 'Honey Glazed Salmon Bowl',
  'chicken-wrap.jpg': 'Mediterranean Chicken Wrap',
  'veggie-bowl.jpg': 'Veggie Power Bowl',
  'turkey-meatballs.jpg': 'Turkey Meatball Marinara',
  'thai-curry.jpg': 'Thai Curry with Jasmine Rice',
  'bbq-chicken.jpg': 'BBQ Pulled Chicken Bowl'
};

const TARGET_DIR = path.join(__dirname, 'public', 'images', 'meals');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

function findImagesInDirectory(dir) {
  const files = [];
  try {
    if (!fs.existsSync(dir)) {
      return files;
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_FORMATS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  return files;
}

// Mapping based on image descriptions you provided earlier
// You can adjust these numbers based on which image matches which meal
const IMAGE_MAPPING = {
  // Update these numbers to match your images
  // Format: 'meal-filename': imageNumber (1-based index)
  'salmon-bowl.jpg': null,      // Will be set
  'chicken-wrap.jpg': null,
  'veggie-bowl.jpg': null,
  'turkey-meatballs.jpg': null,
  'thai-curry.jpg': null,
  'bbq-chicken.jpg': null,
};

async function main() {
  console.log('\n🍯 Quick Image Matcher\n');
  
  const images = findImagesInDirectory(TARGET_DIR);
  
  if (images.length === 0) {
    console.log('❌ No images found in the meals directory.\n');
    return;
  }
  
  console.log(`✅ Found ${images.length} image(s):\n`);
  images.forEach((img, index) => {
    const basename = path.basename(img);
    const size = (fs.statSync(img).size / 1024 / 1024).toFixed(2);
    console.log(`  ${index + 1}. ${basename} (${size} MB)`);
  });
  
  console.log('\n📋 Meal images needed:\n');
  Object.entries(MEAL_MAPPINGS).forEach(([filename, mealName], index) => {
    const exists = fs.existsSync(path.join(TARGET_DIR, filename));
    const status = exists ? '✅' : '❌';
    console.log(`  ${index + 1}. ${status} ${filename} - ${mealName}`);
  });
  
  console.log('\n💡 To match images, update the IMAGE_MAPPING object in this script\n');
  console.log('   Or use the interactive script: npm run organize-images\n');
  
  // Show current mapping status
  let mappedCount = 0;
  for (const [filename, imageNum] of Object.entries(IMAGE_MAPPING)) {
    if (imageNum !== null && imageNum > 0 && imageNum <= images.length) {
      const sourceImage = images[imageNum - 1];
      const targetPath = path.join(TARGET_DIR, filename);
      const ext = path.extname(filename) || path.extname(sourceImage);
      const finalFilename = path.basename(filename, path.extname(filename)) + ext;
      const finalTargetPath = path.join(TARGET_DIR, finalFilename);
      
      if (sourceImage !== finalTargetPath) {
        try {
          if (fs.existsSync(finalTargetPath)) {
            console.log(`⚠️  ${finalFilename} already exists, skipping...`);
          } else {
            fs.copyFileSync(sourceImage, finalTargetPath);
            console.log(`✅ Copied ${path.basename(sourceImage)} → ${finalFilename}`);
            mappedCount++;
          }
        } catch (error) {
          console.error(`❌ Error copying ${path.basename(sourceImage)}: ${error.message}`);
        }
      }
    }
  }
  
  if (mappedCount === 0) {
    console.log('\n📝 No mappings configured. Here\'s a template to help:\n');
    console.log('Based on your images, here are suggested matches:\n');
    console.log('Update the IMAGE_MAPPING object with these numbers:\n');
    console.log('const IMAGE_MAPPING = {');
    console.log('  \'salmon-bowl.jpg\': 1,      // Enter number for salmon dish');
    console.log('  \'chicken-wrap.jpg\': 2,     // Enter number for chicken wrap');
    console.log('  \'veggie-bowl.jpg\': 3,      // Enter number for veggie bowl');
    console.log('  \'turkey-meatballs.jpg\': 4, // Enter number for pasta/meatballs');
    console.log('  \'thai-curry.jpg\': 5,       // Enter number for curry dish');
    console.log('  \'bbq-chicken.jpg\': 6,      // Enter number for BBQ dish');
    console.log('};\n');
  } else {
    console.log(`\n✨ Successfully mapped ${mappedCount} image(s)!\n`);
  }
}

main().catch(console.error);

