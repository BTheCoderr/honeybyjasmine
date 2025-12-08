const fs = require('fs');
const path = require('path');

// Map your new image filenames to the meal slots
const MEAL_IMAGE_MAPPING = {
  'salmon-bowl': 'Pan-seared salmon over farro with a butternut squash.png',
  'chicken-wrap': 'chicken-wrap.jpeg', // Already correct
  'veggie-bowl': 'Levantine Chickpea & Pomegranate Fattoush.png',
  'turkey-meatballs': 'Chicken Bacon Alfredo.png',
  'thai-curry': 'Herb-Crusted Salmon with Garlic Spinach Cream.jpeg',
  'bbq-chicken': 'Grilled ribeye over a Caesar salad with homemade croutons.png',
};

const MEALS_DIR = path.join(__dirname, 'public', 'images', 'meals');

console.log('\n🍯 Meal Image Mapping\n');
console.log('Current mapping:');
Object.entries(MEAL_IMAGE_MAPPING).forEach(([mealKey, filename]) => {
  const filePath = path.join(MEALS_DIR, filename);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${mealKey} → ${filename}`);
});

console.log('\n💡 Update the MEAL_IMAGE_MAPPING object in this file to change mappings.\n');

