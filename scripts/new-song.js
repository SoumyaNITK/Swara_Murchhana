const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rawName = process.argv.slice(2).join(' ');
if (!rawName) {
  console.error('❌ Usage: npm run new "Song Name"');
  process.exit(1);
}

const slug = rawName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const songsDir = path.join(__dirname, '..', 'songs');
if (!fs.existsSync(songsDir)) fs.mkdirSync(songsDir);

const filePath = path.join(songsDir, `${slug}.md`);

if (!fs.existsSync(filePath)) {
  const template = `---
Name: ${rawName}
Singer: 
Composer: 
Lyricist: 
Movie: 
---

`;
  fs.writeFileSync(filePath, template, 'utf-8');
  console.log(`✨ Created: songs/${slug}.md`);
} else {
  console.log(`📂 Opening existing: songs/${slug}.md`);
}

exec(`start "" "notepads" "${filePath}"`, (err) => {
  if (err) {
    exec(`start "" "${filePath}"`);
  }
});