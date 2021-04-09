const { execSync } = require('child_process')
const fs = require('fs');
const path = require('path');

/**
 * Responsible for applying patches to jambo page templates
 */
class PagePatcher {
  constructor ({ pagesDir, patchesDir }) {
    /**
     * The path to the pages folder
     * @type {string}
     */
    this._pagesDir = pagesDir; 

    /**
     * The path to the patches folder
     * @type {string}
     */
    this._patchesDir = patchesDir;
  }

  applyPatchToPage(pageName) {
    if (!this._pagesDir) {
      throw new Error('Invalid pages directory');
    }
    if (!this._patchesDir) {
      throw new Error('Invalid patches directory');
    }
    if (!pageName) {
      throw new Error('A pageName must be specified');
    }

    const pageFile = path.resolve(this._pagesDir, `${pageName}.html.hbs`);
    const patchFile = path.resolve(this._patchesDir, `${pageName}.html.hbs.patch`);

    if(!fs.existsSync(pageFile)) {
      console.log(`No page template found for the ${pageName} page.`);
      return;
    }

    if(!fs.existsSync(patchFile)) {
      console.log(`No patch found for the ${pageName} page. The page template will remain unchanged.`);
      return;
    }

    execSync(`patch -i ${patchFile} ${pageFile}`);
  }
}

module.exports = PagePatcher;