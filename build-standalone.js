const fs = require('fs');
const path = require('path');

const root = __dirname;
let html = fs.readFileSync(path.join(root, 'presentation.html'), 'utf8');

function toDataUri(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const images = {
  'linkedin_qr.jpg': { file: 'linkedin_qr.jpg', mime: 'image/jpeg' },
  'crewai-logo.png': { file: 'crewai-logo.png', mime: 'image/png' },
  'n8n-logo.png': { file: 'n8n-logo.png', mime: 'image/png' },
  'openclaw-logo.png': { file: 'openclaw-logo.png', mime: 'image/png' },
  'pics/ai-secure-landing.png': { file: 'pics/ai-secure-landing.png', mime: 'image/png' },
  'pics/ai-secure-report.png': { file: 'pics/ai-secure-report.png', mime: 'image/png' },
};

for (const [ref, info] of Object.entries(images)) {
  const uri = toDataUri(path.join(root, info.file), info.mime);
  html = html.replaceAll(ref, uri);
}

const bedrockSvg = fs.readFileSync('/tmp/bedrock-icon.svg', 'utf8');
const bedrockUri = `data:image/svg+xml;base64,${Buffer.from(bedrockSvg).toString('base64')}`;
html = html.replaceAll(
  'https://www.awsicon.com/static/images/Service-Icons/Artificial-Intelligence/48/svg/Bedrock.svg',
  bedrockUri
);

const hljsCss = fs.readFileSync('/tmp/hljs-github.css', 'utf8');
const cssTag = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css" />';
const cssIdx = html.indexOf(cssTag);
html = html.substring(0, cssIdx) + `<style>${hljsCss}</style>` + html.substring(cssIdx + cssTag.length);

const hljsJs = fs.readFileSync('/tmp/hljs.min.js', 'utf8');
const jsTag = '<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>';
const jsIdx = html.indexOf(jsTag);
html = html.substring(0, jsIdx) + `<script>${hljsJs}<\/script>` + html.substring(jsIdx + jsTag.length);

fs.writeFileSync(path.join(root, 'presentation-standalone.html'), html);
const sizeMB = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1);
console.log(`Done: presentation-standalone.html (${sizeMB} MB)`);
