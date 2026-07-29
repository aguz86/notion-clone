import fs from 'fs';
import pngToIco from 'png-to-ico';

pngToIco('public/icon-192x192.png')
  .then(buf => {
    fs.writeFileSync('public/favicon.ico', buf);
    console.log('favicon.ico created');
  })
  .catch(console.error);
