const { execSync } = require('child_process');

try {
  console.log('🚀 Pushing songs to live server...');
  execSync('git add .', { stdio: 'inherit' });
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  execSync(`git commit -m "Update lyrics (${timestamp})"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('✅ Live! Your site will update in ~30 seconds.');
} catch (err) {
  console.log('⚠️ Nothing new to deploy or git remote not configured yet.');
}