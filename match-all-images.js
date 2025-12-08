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

// Based on the image descriptions provided earlier, here's a suggested mapping
// You can adjust these numbers (1-12) based on which image matches which meal
const SUGGESTED_MAPPING = {
  'salmon-bowl.jpg': [1, 4, 5, 6],  // Salmon dishes - adjust these numbers
  'veggie-bowl.jpg': [2, 3],        // Veggie/chickpea bowls
  'turkey-meatballs.jpg': [7, 8, 9, 10, 11, 12], // Pasta dishes
  'chicken-wrap.jpg': null,
  'thai-curry.jpg': null,
  'bbq-chicken.jpg': null,
};

function main() {
  console.log('\n🍯 Image Matcher - Quick Setup\n');
  
  const images = findImagesInDirectory(TARGET_DIR);
  
  if (images.length === 0) {
    console.log('❌ No images found.\n');
    return;
  }
  
  console.log(`✅ Found ${images.length} image(s):\n`);
  images.forEach((img, index) => {
    const basename = path.basename(img);
    const size = (fs.statSync(img).size / 1024 / 1024).toFixed(2);
    console.log(`  ${index + 1}. ${basename} (${size} MB)`);
  });
  
  console.log('\n📋 Please tell me which image number matches each meal:\n');
  console.log('Based on the descriptions, here are suggestions:\n');
  console.log('1. Salmon with grains/puree → salmon-bowl.jpg');
  console.log('2. Chickpea salad with pomegranate → veggie-bowl.jpg');
  console.log('3-12. Other dishes → match to remaining meals\n');
  
  console.log('To match them, I\'ll create copies with the correct names.\n');
  console.log('For now, let me show you what needs to be matched:\n');
  
  Object.entries(MEAL_MAPPINGS).forEach(([filename, mealName]) => {
    const targetPath = path.join(TARGET_DIR, filename);
    const exists = fs.existsSync(targetPath);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${filename} - ${mealName}`);
  });
  
  console.log('\n💡 Run the interactive script to match: npm run organize-images\n');
  console.log('   Or manually rename/copy images to match the filenames above.\n');
}

main();

