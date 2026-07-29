import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('isCheckingInstall')) {
  code = code.replace(
    /const \[showInstallModal, setShowInstallModal\] = useState\(false\);/g,
    `const [showInstallModal, setShowInstallModal] = useState(false);
  const [isCheckingInstall, setIsCheckingInstall] = useState(false);`
  );
  
  code = code.replace(
    /if \(params\.get\('install'\) === '1'\) {/,
    `if (params.get('install') === '1') {
      setIsCheckingInstall(true);
      setTimeout(() => setIsCheckingInstall(false), 3000);`
  );
  
  code = code.replace(
    /const activePrompt = installPrompt \|\| deferredPrompt;/g,
    `const activePrompt = installPrompt || deferredPrompt;
              
              if (isCheckingInstall && !activePrompt && !inIframe) {
                return (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Menyiapkan instalasi...</p>
                  </div>
                );
              }`
  );
  
  // also inject `inIframe` check higher up in the modal so it's available
  code = code.replace(
    /let inIframe = false;\s*try \{ inIframe = window\.self !== window\.top; \} catch \(e\) \{ inIframe = true; \}/g,
    `let inIframe = false;
              try { inIframe = window.self !== window.top; } catch (e) { inIframe = true; }`
  );

  fs.writeFileSync('src/App.tsx', code);
}
