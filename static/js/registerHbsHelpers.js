const all = require('HbsHelpers/all') ;
const any = require('HbsHelpers/any');
const isNonRelativeUrl = require('HbsHelpers/isNonRelativeUrl');
const relativePathHandler = require('HbsHelpers/relativePathHandler');

export default function registerHbsHelpers() {
  ANSWERS.registerHelper('all', all);
  ANSWERS.registerHelper('any', any);
  ANSWERS.registerHelper('isNonRelativeUrl', isNonRelativeUrl);
  ANSWERS.registerHelper('relativePathHandler', relativePathHandler);

  /**
   * @deprecated in favor of isNonRelativeUrl
   */
  ANSWERS.registerHelper('matches', function(str, regexPattern) {
    const regex = new RegExp(regexPattern)
    return str && str.match(regex);
  });
}