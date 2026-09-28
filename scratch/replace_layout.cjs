const fs = require('fs');
const file = 'e:/Faizan Manshad Portfolio/src/layouts/Layout.astro';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import ContextReturn from "../components/ContextReturn.astro";',
  'import ContextReturn from "../components/ContextReturn.astro";\nimport { SITE_METADATA } from "../consts";'
);

content = content.replace(
  'const {\r\n  title = "Faizan Manshad",\r\n  description = "Civil engineer, BIM specialist and digital construction researcher. Working across physical structures, digital models, and emerging construction technology.",\r\n  mode = "explore",\r\n} = Astro.props;',
  'const {\n  title = SITE_METADATA.default.title,\n  description = SITE_METADATA.default.description,\n  mode = "explore",\n} = Astro.props;'
);

// If the previous replace didn't work due to \n vs \r\n, try this one:
content = content.replace(
  'const {\n  title = "Faizan Manshad",\n  description = "Civil engineer, BIM specialist and digital construction researcher. Working across physical structures, digital models, and emerging construction technology.",\n  mode = "explore",\n} = Astro.props;',
  'const {\n  title = SITE_METADATA.default.title,\n  description = SITE_METADATA.default.description,\n  mode = "explore",\n} = Astro.props;'
);

fs.writeFileSync(file, content);
console.log("Replaced");
