import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const activePrompt = installPrompt || deferredPrompt;
              
              if (isCheckingInstall && !activePrompt && !inIframe) {
                return (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Menyiapkan instalasi...</p>
                  </div>
                );
              }`;

code = code.replace(target, `    const activePrompt = installPrompt || deferredPrompt;`);

fs.writeFileSync('src/App.tsx', code);
