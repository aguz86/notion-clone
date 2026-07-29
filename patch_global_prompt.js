import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');

if (!code.includes('deferredPrompt')) {
  code = `
export let deferredPrompt: any = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
` + code;
  fs.writeFileSync('src/main.tsx', code);
}
