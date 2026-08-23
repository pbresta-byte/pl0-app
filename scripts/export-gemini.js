const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'pl0-app-gemini.zip');
const archive = archiver('zip', { zlib: { level: 9 } });
const output = fs.createWriteStream(outputPath);

output.on('close', () => {
  console.log(`Created ${path.basename(outputPath)} (${archive.pointer()} bytes)`);
});

archive.on('error', (error) => {
  throw error;
});

archive.pipe(output);
archive.file(path.join(projectRoot, 'README.md'), { name: 'README.md' });
archive.file(path.join(projectRoot, 'capacitor.config.json'), { name: 'capacitor.config.json' });
archive.file(path.join(projectRoot, 'package.json'), { name: 'package.json' });
archive.file(path.join(projectRoot, 'www', 'index.html'), { name: 'www/index.html' });
archive.file(path.join(projectRoot, 'www', 'manifest.json'), { name: 'www/manifest.json' });
archive.file(path.join(projectRoot, 'www', 'robots.txt'), { name: 'www/robots.txt' });
archive.file(path.join(projectRoot, 'www', 'sw.js'), { name: 'www/sw.js' });
archive.directory(path.join(projectRoot, 'www', 'icons'), 'www/icons');
archive.append(
  [
    '# PL0 app export',
    '',
    'This archive contains the readable web app source for PL0, a Sarvato Bhadra Chakra analyzer.',
    '',
    'Primary implementation: www/index.html',
    'Static assets: www/manifest.json, www/sw.js, and www/icons/',
    'Native wrapper configuration: capacitor.config.json',
    '',
    'The app is a static Capacitor web app. Its HTML contains the CSS and JavaScript implementation inline, so no build step is required to inspect the core behavior.',
  ].join('\n'),
  { name: 'GEMINI_CONTEXT.md' },
);
archive.finalize();