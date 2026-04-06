const fs = require('fs');
const path = require('path');

const root = __dirname;

// Step 1: Read presentation.html
let html = fs.readFileSync(path.join(root, 'presentation.html'), 'utf8');

// Step 2: Inline content.js — replace the external script tag with inline SLIDES
const contentJs = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
html = html.replace(
  '<script src="content.js"></script>',
  `<script>\n${contentJs}\n</script>`
);

function toDataUri(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// Step 3: Inline all images
const images = {
  'linkedin_qr.jpg': { file: 'linkedin_qr.jpg', mime: 'image/jpeg' },
  'crewai-logo.png': { file: 'crewai-logo.png', mime: 'image/png' },
  'n8n-logo.png': { file: 'n8n-logo.png', mime: 'image/png' },
  'openclaw-logo.png': { file: 'openclaw-logo.png', mime: 'image/png' },
  'pics/ai-secure-landing.png': { file: 'pics/ai-secure-landing.png', mime: 'image/png' },
  'pics/ai-secure-report.png': { file: 'pics/ai-secure-report.png', mime: 'image/png' },
  'pics/combined3_split.jpg': { file: 'pics/combined3_split.jpg', mime: 'image/jpeg' },
  'pics/peachbase-global-brain.png': { file: 'pics/peachbase-global-brain.png', mime: 'image/png' },
  'pics/telegram-agents.jpg': { file: 'pics/telegram-agents.jpg', mime: 'image/jpeg' },
};

for (const [ref, info] of Object.entries(images)) {
  const fullPath = path.join(root, info.file);
  if (fs.existsSync(fullPath)) {
    const uri = toDataUri(fullPath, info.mime);
    html = html.replaceAll(ref, uri);
    console.log(`  Inlined: ${ref} (${(fs.statSync(fullPath).size / 1024).toFixed(0)}KB)`);
  } else {
    console.log(`  MISSING: ${ref}`);
  }
}

// Step 4: Inline Bedrock SVG
const bedrockSvgPath = '/tmp/bedrock-icon.svg';
if (fs.existsSync(bedrockSvgPath)) {
  const bedrockSvg = fs.readFileSync(bedrockSvgPath, 'utf8');
  const bedrockUri = `data:image/svg+xml;base64,${Buffer.from(bedrockSvg).toString('base64')}`;
  html = html.replaceAll(
    'https://www.awsicon.com/static/images/Service-Icons/Artificial-Intelligence/48/svg/Bedrock.svg',
    bedrockUri
  );
  console.log('  Inlined: Bedrock SVG');
}

// Step 5: Inline highlight.js CSS
const hljsCssPath = '/tmp/hljs-github.css';
if (fs.existsSync(hljsCssPath)) {
  const hljsCss = fs.readFileSync(hljsCssPath, 'utf8');
  const cssTag = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css" />';
  const cssIdx = html.indexOf(cssTag);
  if (cssIdx >= 0) {
    html = html.substring(0, cssIdx) + `<style>${hljsCss}</style>` + html.substring(cssIdx + cssTag.length);
    console.log('  Inlined: highlight.js CSS');
  }
}

// Step 6: Inline highlight.js
const hljsJsPath = '/tmp/hljs.min.js';
if (fs.existsSync(hljsJsPath)) {
  const hljsJs = fs.readFileSync(hljsJsPath, 'utf8');
  const jsTag = '<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>';
  const jsIdx = html.indexOf(jsTag);
  if (jsIdx >= 0) {
    html = html.substring(0, jsIdx) + `<script>${hljsJs}<\/script>` + html.substring(jsIdx + jsTag.length);
    console.log('  Inlined: highlight.js');
  }
}

// Write standalone
const outPath = path.join(root, 'ai-agent-presentation-standalone.html');
fs.writeFileSync(outPath, html);
const sizeMB = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1);
console.log(`\nDone: ai-agent-presentation-standalone.html (${sizeMB} MB)`);
