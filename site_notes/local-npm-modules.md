#install local modules with npm

**To include a local package it needs to be described by a package.json file**

Installing like this: `npm install --save ./local_modules/metalsmith-add-canonical` will result in an entry in package.json like this: `"metalsmith-add-canonical": "file:local_modules/metalsmith-add-canonical",`

Now we can include the package in our gulpfile.js just like all the others `const addCanonicalURL = require('metalsmith-add-canonical');`
 