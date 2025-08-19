import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run(cmd, cwd) {
  console.log(`→ ${cmd}`);
  await execAsync(cmd, { cwd, env: process.env });
}

(async function main() {
  try {
    await fs.remove(path.join(__dirname, 'dist'));
    await fs.ensureDir(path.join(__dirname, 'dist'));

    console.log('🏗️ Building admin...');
    await run('npm install --no-fund --no-audit', path.join(__dirname, 'admin'));
    await run('npm run build', path.join(__dirname, 'admin'));
    await fs.copy(path.join(__dirname, 'admin', 'dist'), path.join(__dirname, 'dist', 'admin'));

    console.log('📦 Copying booking...');
    await fs.copy(path.join(__dirname, 'booking'), path.join(__dirname, 'dist', 'booking'));

    console.log('⚙️ Aggregating functions...');
    await fs.remove(path.join(__dirname, 'netlify', 'functions'));
    await fs.ensureDir(path.join(__dirname, 'netlify', 'functions'));
    const adminFns = path.join(__dirname, 'admin', 'functions');
    if (await fs.pathExists(adminFns)) await fs.copy(adminFns, path.join(__dirname, 'netlify', 'functions'));
    const bookingFns = path.join(__dirname, 'booking', 'netlify', 'functions');
    if (await fs.pathExists(bookingFns)) await fs.copy(bookingFns, path.join(__dirname, 'netlify', 'functions'));

    console.log('✅ Build complete');
  } catch (e) {
    console.error('❌ Build failed', e);
    process.exit(1);
  }
})();
