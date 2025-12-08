const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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

async function findImagesInDirectory(dir) {
  const files = [];
  try {
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

async function main() {
  console.log('\n🍯 HoneyByJasmine Image Organizer\n');
  console.log('This script will help you organize your meal images.\n');
  
  // Ask for source directory
  const sourceDir = await question('Enter the path to the folder containing your images (or press Enter for Downloads): ');
  const searchDir = sourceDir.trim() || path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads');
  
  console.log(`\n📁 Searching for images in: ${searchDir}\n`);
  
  // Find all images
  const images = await findImagesInDirectory(searchDir);
  
  if (images.length === 0) {
    console.log('❌ No images found in that directory.');
    console.log('Please make sure you have image files (.jpg, .png, .webp) in the folder.\n');
    rl.close();
    return;
  }
  
  console.log(`✅ Found ${images.length} image(s):\n`);
  images.forEach((img, index) => {
    console.log(`  ${index + 1}. ${path.basename(img)}`);
  });
  
  console.log('\n📋 Meal images needed:\n');
  Object.entries(MEAL_MAPPINGS).forEach(([filename, mealName], index) => {
    const exists = fs.existsSync(path.join(TARGET_DIR, filename));
    const status = exists ? '✅' : '❌';
    console.log(`  ${index + 1}. ${status} ${filename} - ${mealName}`);
  });
  
  console.log('\n🔧 Let\'s match your images to the meals:\n');
  
  const matchedImages = {};
  
  for (const [filename, mealName] of Object.entries(MEAL_MAPPINGS)) {
    const targetPath = path.join(TARGET_DIR, filename);
    
    // Skip if already exists
    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  ${filename} already exists, skipping...`);
      continue;
    }
    
    console.log(`\n📸 ${mealName}`);
    console.log(`   Target filename: ${filename}`);
    console.log('\n   Available images:');
    images.forEach((img, index) => {
      const basename = path.basename(img);
      console.log(`     ${index + 1}. ${basename}`);
    });
    
    const answer = await question(`\n   Enter the number of the image to use (or 's' to skip): `);
    
    if (answer.toLowerCase() === 's' || answer.trim() === '') {
      console.log('   ⏭️  Skipped');
      continue;
    }
    
    const imageIndex = parseInt(answer) - 1;
    if (imageIndex >= 0 && imageIndex < images.length) {
      const sourceImage = images[imageIndex];
      const ext = path.extname(filename) || path.extname(sourceImage);
      const finalFilename = path.basename(filename, path.extname(filename)) + ext;
      const finalTargetPath = path.join(TARGET_DIR, finalFilename);
      
      // Ensure target directory exists
      if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
      }
      
      // Copy the image
      try {
        fs.copyFileSync(sourceImage, finalTargetPath);
        console.log(`   ✅ Copied to ${finalFilename}`);
        matchedImages[filename] = sourceImage;
      } catch (error) {
        console.error(`   ❌ Error copying image: ${error.message}`);
      }
    } else {
      console.log('   ❌ Invalid selection');
    }
  }
  
  console.log('\n✨ Image organization complete!\n');
  console.log('Summary:');
  Object.entries(MEAL_MAPPINGS).forEach(([filename]) => {
    const targetPath = path.join(TARGET_DIR, filename);
    const exists = fs.existsSync(targetPath);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${filename}`);
  });
  
  console.log('\n💡 Tip: If some images are missing, the site will show gradient placeholders.\n');
  rl.close();
}

main().catch(console.error);

