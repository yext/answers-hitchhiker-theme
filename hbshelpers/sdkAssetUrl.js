const RELEASE_BRANCH_REGEX = /^release\/v[0-9.]+$/;
const SEM_VER_REGEX = /^[1-9]+$|^[1-9]+\.[0-9]+$|^[1-9]+\.[0-9]+\.[0-9]+$/;

module.exports = function sdkAssetUrl(branch, locale, assetName) {
  const isReleasedBranch = SEM_VER_REGEX.test(branch);

  let parsedBranch;
  if (isReleasedBranch) {
    parsedBranch = `v${branch}`;
  } else {
    parsedBranch = `dev/${branch.replace(/\//g, '-')}`;
  }

  const isPreReleaseBranch = RELEASE_BRANCH_REGEX.test(branch);
  const isLocalizationSupported = 
    (isReleasedBranch || isPreReleaseBranch) && 
    !(locale.startsWith('en') || assetName === 'answers.css') ;
  
  const parsedAssetName = isLocalizationSupported ?
    `${locale}-${assetName}` :
    assetName;

  return `https://assets.sitescdn.net/answers/${parsedBranch}/${parsedAssetName}`;
};