const RELEASE_BRANCH_REGEX = /^release\/v[0-9.]+$/;
const HOTFIX_BRANCH_REGEX = /^hotfix\/v[0-9.]+$/;
const I18N_FEATURE_BRANCH_REGEX = /^feature\/.+-i18n$/;
const SEM_VER_REGEX = /^[1-9]+$|^[1-9]+\.[0-9]+$|^[1-9]+\.[0-9]+\.[0-9]+$/;

/**
 * Given a branch (or release) of the SDK and a locale, this helper provides the correct
 * URL in the CDN for the asset.
 * 
 * @param {string} branch The branch (or release) of the SDK.
 * @param {string} locale The locale to use.
 * @param {string} assetName The name of the desired asset.
 * @returns {string} The CDN URL of the localized asset.
 */
module.exports = function sdkAssetUrl(branch, locale, assetName) {
  const isReleasedBranch = SEM_VER_REGEX.test(branch);

  let parsedBranch;
  if (isReleasedBranch) {
    parsedBranch = `v${branch}`;
  } else if (branch === 'develop') {
    parsedBranch = 'canary/latest';
  } else {
    parsedBranch = `dev/${branch.replace(/\//g, '-')}`;
  }

  const isPreReleaseBranch = 
    RELEASE_BRANCH_REGEX.test(branch) || HOTFIX_BRANCH_REGEX.test(branch);
  const isI18nFeatureBranch = I18N_FEATURE_BRANCH_REGEX.test(branch);
  const isDevelopBranch = branch === 'develop';
  const isLocalizationSupported = 
    (isReleasedBranch || isPreReleaseBranch || isI18nFeatureBranch || isDevelopBranch) && 
    !(locale.startsWith('en') || assetName === 'answers.css') ;
  
  const parsedAssetName = isLocalizationSupported ?
    `${locale}-${assetName}` :
    assetName;

  return `https://assets.sitescdn.net/answers/${parsedBranch}/${parsedAssetName}`;
};
