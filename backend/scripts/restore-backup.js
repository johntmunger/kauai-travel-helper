#!/usr/bin/env node

/**
 * Restore Database from Backup
 * 
 * This script restores your local database from a backup file.
 * 
 * Usage:
 *   node scripts/restore-backup.js [backup-file]
 *   
 * If no backup file is specified, shows list of available backups.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, existsSync, readdirSync, statSync } from 'fs';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../database/kauai.db');
const BACKUPS_DIR = join(__dirname, '../database/backups');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

// Get list of backup files
function getBackups() {
  if (!existsSync(BACKUPS_DIR)) {
    return [];
  }

  const files = readdirSync(BACKUPS_DIR)
    .filter(file => file.endsWith('.db'))
    .map(file => {
      const fullPath = join(BACKUPS_DIR, file);
      const stats = statSync(fullPath);
      return {
        name: file,
        path: fullPath,
        size: stats.size,
        created: stats.mtime,
      };
    })
    .sort((a, b) => b.created - a.created); // Most recent first

  return files;
}

// Format file size
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Format date
function formatDate(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Prompt user for confirmation
function confirm(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// List available backups
function listBackups() {
  const backups = getBackups();

  if (backups.length === 0) {
    logWarning('No backups found.');
    log('\nBackups directory: ' + BACKUPS_DIR, 'blue');
    return;
  }

  log('\nAvailable backups:', 'bright');
  log('─'.repeat(70));
  
  backups.forEach((backup, index) => {
    log(`${index + 1}. ${backup.name}`, 'blue');
    log(`   Created: ${formatDate(backup.created)}`);
    log(`   Size: ${formatSize(backup.size)}`);
    log('');
  });

  log('─'.repeat(70));
  log(`\nTo restore a backup, run:`, 'bright');
  log(`  node scripts/restore-backup.js backups/BACKUP_NAME.db\n`, 'blue');
}

// Restore from backup
async function restoreBackup(backupPath) {
  log('\n╔══════════════════════════════════════════════════════╗', 'bright');
  log('║  Restore Database from Backup                        ║', 'bright');
  log('╚══════════════════════════════════════════════════════╝', 'bright');

  // Check if backup file exists
  if (!existsSync(backupPath)) {
    logError(`Backup file not found: ${backupPath}`);
    log('\nRun without arguments to see available backups:', 'yellow');
    log('  node scripts/restore-backup.js\n', 'blue');
    process.exit(1);
  }

  // Show what will be restored
  const stats = statSync(backupPath);
  log(`\nBackup file: ${backupPath}`, 'blue');
  log(`Created: ${formatDate(stats.mtime)}`);
  log(`Size: ${formatSize(stats.size)}\n`);

  // Confirm with user
  logWarning('⚠️  This will REPLACE your current local database!');
  const confirmed = await confirm('\nAre you sure you want to restore this backup?');

  if (!confirmed) {
    log('\nRestore cancelled.', 'yellow');
    process.exit(0);
  }

  try {
    // Create backup of current database before restoring
    if (existsSync(DB_PATH)) {
      const preRestoreBackup = join(BACKUPS_DIR, `pre-restore-${Date.now()}.db`);
      copyFileSync(DB_PATH, preRestoreBackup);
      logSuccess(`Created safety backup: ${preRestoreBackup}`);
    }

    // Restore the backup
    copyFileSync(backupPath, DB_PATH);
    logSuccess('Database restored successfully!');

    log('\n╔══════════════════════════════════════════════════════╗', 'green');
    log('║  ✓ Restore completed successfully!                  ║', 'green');
    log('╚══════════════════════════════════════════════════════╝', 'green');

    log('\nNext steps:', 'bright');
    log('  1. Stop your dev server if running (Ctrl+C)');
    log('  2. Run: npm run dev');
    log('  3. Test the app at http://localhost:5173\n');

    process.exit(0);
  } catch (error) {
    logError(`Failed to restore backup: ${error.message}`);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments - list backups
    listBackups();
  } else {
    // Restore specified backup
    let backupPath = args[0];
    
    // If relative path doesn't include 'backups/', add it
    if (!backupPath.includes('/') && !backupPath.startsWith('backups/')) {
      backupPath = join(BACKUPS_DIR, backupPath);
    } else if (backupPath.startsWith('backups/')) {
      backupPath = join(__dirname, '../database/', backupPath);
    } else if (!backupPath.startsWith('/')) {
      // Relative path from current directory
      backupPath = join(process.cwd(), backupPath);
    }

    await restoreBackup(backupPath);
  }
}

// Run the script
main();

