const { execSync } = require('child_process')
const fs = require('fs');
const path = require('path');

/**
 * Responsible for applying patches to jambo page templates
 */
class PagePatcher {
  constructor ({ pagesDir, patchesDir }) {
    if (!pagesDir) {
      throw new Error('Invalid pages directory');
    }
    if (!patchesDir) {
      throw new Error('Invalid patches directory');
    }

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

  /**
   * Applies a diff from the patches directory to the corresponding config in the config
   * directory for a given page
   * 
   * @param {string} pageName 
   */
  applyPatchToPage(pageName) {
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