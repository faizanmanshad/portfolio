const fs = require('node:fs');
// Optional authoring tool; normal builds use the checked-in outlines.
// Supply a local opentype.js 1.3.4 module path as the first argument.
const ot = require(process.argv[2] || 'opentype.js');
const font = ot.loadSync('public/fonts/Pacifico-Regular.ttf');
const words = ['Faizan', 'Manshad'].map(text => ({text, commands: font.getPath(text, 0, 0, 1).commands}));
fs.writeFileSync('src/assets/hero/name-outlines.json', JSON.stringify(words));
