import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('setInterval(() => {')) {
  code = code.replace(
    /window\.addEventListener\('beforeinstallprompt', handler\);/g,
    `window.addEventListener('beforeinstallprompt', handler);
    const timer = setInterval(() => {
      if (deferredPrompt && !installPrompt) {
        setInstallPrompt(deferredPrompt);
      }
    }, 500);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearInterval(timer);
    };`
  );
  // Remove the old return statement
  code = code.replace(/return \(\) => window\.removeEventListener\('beforeinstallprompt', handler\);/g, '');
  fs.writeFileSync('src/App.tsx', code);
}
