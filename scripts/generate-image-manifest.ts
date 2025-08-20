#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Thumbnail sizes for small painting thumbnails
const THUMBNAIL_SIZES = [
  { width: 64, height: 64, suffix: '-thumb' },
  { width: 128, height: 128, suffix: '-medium' },
  { width: 256, height: 256, suffix: '-large' }
];

// Function to convert filename to readable name
function filenameToName(filename: string): string {
  // Remove .png extension
  const nameWithoutExt = filename.replace(/\.png$/i, '');
  
  // Convert camelCase or kebab-case to readable format
  // Handle special cases like "TSAWater" -> "TSA Water"
  const readableName = nameWithoutExt
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
  
  return readableName;
}

// Function to generate thumbnails for an image
async function generateThumbnails(imagePath: string, outputDir: string, filename: string): Promise<string[]> {
  const thumbnails: string[] = [];
  
  try {
    const image = sharp(imagePath);
    
    for (const size of THUMBNAIL_SIZES) {
      const thumbnailFilename = filename.replace('.png', `${size.suffix}.png`);
      const thumbnailPath = path.join(outputDir, thumbnailFilename);
      
      await image
        .resize(size.width, size.height, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png({ quality: 90 })
        .toFile(thumbnailPath);
      
      thumbnails.push(`ingredients/${thumbnailFilename}`);
    }
    
    return thumbnails;
  } catch (error) {
    console.error(`❌ Error generating thumbnails for ${filename}:`, error);
    return [];
  }
}

// Function to generate the manifest
async function generateImageManifest(): Promise<void> {
  const ingredientsDir = path.join(process.cwd(), 'public', 'ingredients');
  
  try {
    // Read all files in the ingredients directory
    const files = fs.readdirSync(ingredientsDir);
    
    // Filter for PNG files (excluding thumbnails)
    const originalFiles = files.filter(file => 
      file.toLowerCase().endsWith('.png') && 
      !file.includes('-thumb') && 
      !file.includes('-medium') && 
      !file.includes('-large')
    );
    
    console.log(`🖼️  Found ${originalFiles.length} original images`);
    
    // Generate thumbnails for each image
    const images = [];
    
    for (const file of originalFiles) {
      const imagePath = path.join(ingredientsDir, file);
      const thumbnails = await generateThumbnails(imagePath, ingredientsDir, file);
      
      images.push({
        url: `ingredients/${file}`,
        name: filenameToName(file),
        thumbnails: {
          small: thumbnails.find(t => t.includes('-thumb')) || `ingredients/${file}`,
          medium: thumbnails.find(t => t.includes('-medium')) || `ingredients/${file}`,
          large: thumbnails.find(t => t.includes('-large')) || `ingredients/${file}`
        }
      });
      
      console.log(`✅ Generated thumbnails for ${file}`);
    }
    
    // Sort alphabetically by name
    images.sort((a, b) => a.name.localeCompare(b.name));
    
    // Generate the manifest content
    const manifestContent = `// Auto-generated image manifest
// Generated on: ${new Date().toISOString()}

export interface ImageManifest {
  url: string;
  name: string;
  thumbnails: {
    small: string;
    medium: string;
    large: string;
  };
}

export const images: ImageManifest[] = [
${images.map(img => `  {
    url: "${img.url}",
    name: "${img.name}",
    thumbnails: {
      small: "${img.thumbnails.small}",
      medium: "${img.thumbnails.medium}",
      large: "${img.thumbnails.large}"
    }
  }`).join(',\n')}
];

export default images;
`;
    
    // Write to src/lib/image-manifest.ts
    const outputPath = path.join(process.cwd(), 'src', 'lib', 'image-manifest.ts');
    const outputDir = path.dirname(outputPath);
    
    // Ensure the lib directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, manifestContent);
    
    console.log(`\n✅ Generated image manifest with ${images.length} images and thumbnails`);
    console.log(`📁 Output: ${outputPath}`);
    
    // Log summary
    console.log('\n📋 Generated manifest:');
    images.forEach(img => {
      console.log(`  - ${img.name}`);
      console.log(`    Original: ${img.url}`);
      console.log(`    Thumbnails: ${img.thumbnails.small}, ${img.thumbnails.medium}, ${img.thumbnails.large}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating image manifest:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateImageManifest().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
