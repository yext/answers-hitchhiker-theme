const { parse, stringify } = require('comment-json');

/**
 * @typedef {import('comment-json').CommentJSONObject} CommentJSONObject
 * @typedef {import('comment-json').CommentToken} CommentToken
 * 
 * @typedef {{
 *   type: 'CommentedOutProperty',
 *   key: string,
 *   comment: Omit<CommentToken, 'loc'>
 * }} CommentedOutPropertyToken
 * 
 * @typedef {{
 *   type: 'Property',
 *   key: string,
 *   value: string | number | null
 *   inlineComment?: Omit<CommentToken, 'loc'>
 * }} PropertyToken
 * 
 * @typedef {PropertyToken | CommentedOutPropertyToken} GlobalConfigToken
 */

/**
 * Merges two global configs.
 * For regular properties, the original config has priority.
 * For commented out properties, the incoming config has priority.
 * The `sdkVersion` is a special property which will always favor the incoming config's value,
 * but the original's inline comment (if one exists).
 *
 * This is not intended to handle json with duplicate keys, i.e. a json config
 * with an `apiKey` property in addition to a commented out `apiKey` property.
 * 
 * @param {string} originalConfig 
 * @param {string} incomingConfig 
 * @return {string}
 */
exports.mergeGlobalConfigs = function mergeGlobalConfigs(originalConfig, incomingConfig) {
  const originalJson = parse(originalConfig);
  const incomingJson = parse(incomingConfig);
  const originalTokens = tokenize(originalJson);
  const incomingTokens = tokenize(incomingJson);
  const mergedTokens = mergeTokens(originalTokens, incomingTokens);
  const commentJsonObject = transformToCommentJsonObject(mergedTokens);
  if (incomingJson.sdkVersion) {
    commentJsonObject.sdkVersion = incomingJson.sdkVersion;
  }

  return stringify(commentJsonObject, null, 2);
};

/**
 * Parses a {@link CommentJSONObject} into an array of {@link GlobalConfigToken}s
 * 
 * @param {CommentJSONObject}  
 * @returns {GlobalConfigToken[]}
 */
function tokenize(commentJsonObject) {
  /** @type {GlobalConfigToken[]} */
  const tokens = [];

  Object.keys(commentJsonObject).forEach(key => {
    const commentsBeforeCurrentKey = commentJsonObject[Symbol.for(`before:${key}`)] || [];
    appendCommentsAsTokens(commentsBeforeCurrentKey);

    appendCurrentPropertyAsToken(key);

    const commentsAfterCurrentKey = commentJsonObject[Symbol.for(`after:${key}`)] || [];
    appendCommentsAsTokens(commentsAfterCurrentKey);
  });

  return tokens;

  /**
   * Appends the given comments to the tokens array.
   *
   * @param {CommentToken[]} comments 
   */
  function appendCommentsAsTokens(comments) {
    comments.forEach(comment => {
      if (comment.inline) return;
      const propCommentRegex = /^\s?"([^"]+)":.*$/g;
      const val = comment.value;
      const match = [...val.matchAll(propCommentRegex)][0];
      if (!match || match.length !== 2) {
        console.error(`Dropped the following comment: \`${val}\``);

        return;
      }
      tokens.push({
        type: 'CommentedOutProperty',
        key: match[1],
        comment: {
          type: comment.type,
          value: comment.value,
          inline: comment.inline
        }
      });
    });
  };

  /**
   * Appends the property with the given key to the tokens array.
   * If an inline comment exists for the property, that will also be recorded.
   * 
   * @param {string} key 
   */
  function appendCurrentPropertyAsToken(key) {
    const commentsAfterKey = commentJsonObject[Symbol.for(`after:${key}`)] || [];
    const inlineComment = commentsAfterKey.find(c => c.inline);
    tokens.push({
      type: 'Property',
      key,
      value: commentJsonObject[key],
      inlineComment: inlineComment ? {
        type: inlineComment.type,
        value: inlineComment.value,
        inline: inlineComment.inline
      } : null
    });
  }
}
exports.tokenize = tokenize;

/**
 * Transforms an array of {@link GlobalConfigToken} into an equivalent {@link CommentJSONObject}
 * 
 * @param {GlobalConfigToken[]} tokens 
 * @returns {CommentJSONObject}
 */
function transformToCommentJsonObject(tokens) {
  const commentJsonObject = {};
  let previousPropertyKey = null;
  tokens.forEach(token => {
    switch (token.type) {
      case 'Property':
        commentJsonObject[token.key] = token.value;
        previousPropertyKey = token.key;
        if (token.inlineComment) {
          const symbol = Symbol.for(`after:${token.key}`);
          commentJsonObject[symbol] =
            (commentJsonObject[symbol] || []).concat([token.inlineComment]);
        }
        break;
      case 'CommentedOutProperty':
        const symbol = previousPropertyKey
          ? Symbol.for(`after:${previousPropertyKey}`)
          : Symbol.for('before');
        commentJsonObject[symbol] = (commentJsonObject[symbol] || []).concat([token.comment]);
        break;
      default:
        throw new Error(`Unknown token type "${token.type}"`);
    }
  });

  return commentJsonObject;
}
exports.transformToCommentJsonObject = transformToCommentJsonObject;

/**
 * The logic for merging two arrays of {@link GlobalConfigToken}.
 * 
 * @param {GlobalConfigToken[]} original 
 * @param {GlobalConfigToken[]} incoming 
 * @returns 
 */
function mergeTokens(original, incoming) {
  const mergedTokens = [];
  const originalCopy = [...original];

  incoming.forEach(incomingToken => {
    const i = originalCopy.findIndex(t => t.key === incomingToken.key);
    if (i < 0) {
      mergedTokens.push(incomingToken);

      return;
    }
    const originalToken = originalCopy[i];
    if (originalToken.type === 'Property') {
      mergedTokens.push(originalToken);
    } else if (originalToken.type === 'CommentedOutProperty') {
      mergedTokens.push(incomingToken);
    }
    originalCopy.splice(i, 1);
  });

  // Append any leftover tokens from the original,
  // i.e tokens with keys that weren't present in the incoming tokens,
  // or for duplicate keys (which we don't really worry about handling)
  mergedTokens.push(...originalCopy);

  return mergedTokens;
}
exports.mergeTokens = mergeTokens;