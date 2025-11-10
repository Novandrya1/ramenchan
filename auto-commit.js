const { execSync } = require('child_process');
const fs = require('fs');

console.log('========================================');
console.log('      RamenChan Auto Commit Script');
console.log('========================================');
console.log('');

// Get current timestamp
const now = new Date();
const timestamp = now.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

try {
    // Check if git is initialized
    if (!fs.existsSync('.git')) {
        console.log('Initializing Git repository...');
        execSync('git init', { stdio: 'inherit' });
        execSync('git branch -M main', { stdio: 'inherit' });
        console.log('');
    }

    // Add all changes
    console.log('Adding all changes...');
    execSync('git add .', { stdio: 'inherit' });

    // Check if there are changes to commit
    try {
        execSync('git diff --cached --quiet');
        console.log('No changes to commit.');
        process.exit(0);
    } catch (error) {
        // There are changes to commit
    }

    // Show status
    console.log('');
    console.log('Current status:');
    execSync('git status --short', { stdio: 'inherit' });

    // Auto-generate commit message based on changes
    console.log('');
    console.log('Generating commit message...');

    let commitMsg = `🚀 Auto-commit: ${timestamp}`;

    // Check for specific file changes
    try {
        const changedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' });
        
        if (changedFiles.includes('.html')) {
            commitMsg += ' - HTML updates';
        }
        if (changedFiles.includes('.css')) {
            commitMsg += ' - CSS improvements';
        }
        if (changedFiles.includes('.js')) {
            commitMsg += ' - JavaScript enhancements';
        }
    } catch (error) {
        // Continue with base message
    }

    // Commit changes
    console.log('');
    console.log(`Committing with message: ${commitMsg}`);
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });

    console.log('');
    console.log('✅ Successfully committed changes!');

    // Ask if user wants to push (simplified for Node.js)
    console.log('');
    console.log('To push to remote, run: git push origin main');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}

console.log('');
console.log('========================================');
console.log('          Process Complete');
console.log('========================================');