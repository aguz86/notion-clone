import fs from 'fs';
let code = fs.readFileSync('vite.config.ts', 'utf8');

code = code.replace(
  "registerType: 'autoUpdate',",
  `registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html',
        },`
);

fs.writeFileSync('vite.config.ts', code);
