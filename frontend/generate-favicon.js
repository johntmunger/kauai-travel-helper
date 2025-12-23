#!/usr/bin/env node

/**
 * Generate PNG favicons from SVG logo
 * 
 * This script converts the pineapple.svg to various PNG sizes
 * needed for different devices and platforms.
 * 
 * Requirements: Node.js with sharp package
 * Run: npm install sharp --save-dev
 * Then: node generate-favicon.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Icon sizes we need
const SIZES = [
  { size: 180, name: 'apple-touch-icon.png', desc: 'Apple Touch Icon (iOS/iPadOS)' },
  { size: 192, name: 'android-chrome-192x192.png', desc: 'Android Chrome' },
  { size: 512, name: 'android-chrome-512x512.png', desc: 'Android Chrome Large' },
  { size: 32, name: 'favicon-32x32.png', desc: 'Standard Favicon' },
  { size: 16, name: 'favicon-16x16.png', desc: 'Small Favicon' },
];

console.log('🍍 Favicon Generator\n');
console.log('This script converts pineapple.svg to PNG icons for various devices.\n');

// Check if sharp is installed
try {
  const sharp = await import('sharp');
  const svgPath = join(__dirname, 'public/pineapple.svg');
  const svgBuffer = readFileSync(svgPath);

  console.log('✓ Found pineapple.svg');
  console.log('✓ Sharp library loaded\n');

  // Generate each size
  for (const { size, name, desc } of SIZES) {
    try {
      await sharp.default(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(__dirname, 'public', name));
      
      console.log(`✓ Generated ${name} (${size}x${size}) - ${desc}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n✅ All icons generated successfully!');
  console.log('\nGenerated files in frontend/public/:');
  SIZES.forEach(({ name, size }) => {
    console.log(`  - ${name} (${size}x${size})`);
  });

} catch (error) {
  if (error.code === 'ERR_MODULE_NOT_FOUND') {
    console.error('❌ Sharp library not found!\n');
    console.log('Please install it first:');
    console.log('  cd frontend');
    console.log('  npm install sharp --save-dev\n');
    console.log('Then run this script again:');
    console.log('  node generate-favicon.js\n');
    
    console.log('Alternative: Use an online converter:');
    console.log('  1. Open https://www.aconvert.com/image/svg-to-png/');
    console.log('  2. Upload frontend/public/pineapple.svg');
    console.log('  3. Convert to these sizes:');
    SIZES.forEach(({ size, name }) => {
      console.log(`     - ${size}x${size} → save as ${name}`);
    });
    console.log('  4. Save all PNG files to frontend/public/\n');
    
    process.exit(1);
  } else {
    throw error;
  }
}

