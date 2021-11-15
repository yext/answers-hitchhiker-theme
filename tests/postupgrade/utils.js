const { parse, stringify, assign } = require('comment-json');
const fs = require('fs');
const path = require('path');
const {
  parseAllPropComments,
  mergeGlobalConfigs,
  getPropCommentSymbols,
  pruneComments
} = require('../../postupgrade/utils');

it('mergeGlobalConfigs merges together two global configs, and removes duplicated comments', () => {
  const { original, incoming, merged: expected } = readFixtures();
  const mergedConfig = mergeGlobalConfigs(incoming, original);
  expect(mergedConfig).toEqual(expected);
});

it('merges comments that are in the same comment-json "location", for example (before:sessionTrackingEnabled)', () => {
  const { original, incoming, merged: expected } = readFixtures('merges-prop-comments');
  const mergedConfig = mergeGlobalConfigs(incoming, original);
  expect(mergedConfig).toEqual(expected);
});

it('getPropCommentSymbols ', () => {
  const testJson = parse(`{
    // "sdkVersion": "1.9", // sdkVersion comment
    "experienceVersion": "<REPLACE ME>", // experienceVersion comment
    "businessId": "<REPLACE ME>", // businessId comment
    // "initializeManually": true // manualInit comment
  }`);
  const commentSymbols = getPropCommentSymbols(testJson);
  expect(commentSymbols).toEqual([
    Symbol.for('before:experienceVersion'),
    Symbol.for('after:experienceVersion'),
    Symbol.for('before:businessId'),
    Symbol.for('after:businessId'),
    Symbol.for('before')
  ]);
});

describe('parseAllPropComments', () => {
  it('parses comments correctly', () => {
    const commentJson = parse(`{
      // "sdkVersion": "1.9", // sdkVersion comment
      "experienceVersion": "<REPLACE ME>", // experienceVersion comment
      "businessId": "<REPLACE ME>", // businessId comment
      // "initializeManually": true // manualInit comment
    }`);
    const commentTokens = parseAllPropComments(commentJson);
    expect(commentTokens).toMatchObject([
      {
        'inline': false,
        'type': 'LineComment',
        'value': ' "sdkVersion": "1.9", // sdkVersion comment'
      },
      {
        'inline': false,
        'type': 'LineComment',
        'value': ' "initializeManually": true // manualInit comment'
      }
    ]);
  });

  it('ignores block comments, and comments that dont "look like" config props', () => {
    const commentJson = parse(`{
      // ignore me
      "experienceVersion": "<REPLACE ME>",
      /* ignore me too */
      "businessId": "<REPLACE ME>"
      // 'lol': "only double quotes are valid json"
    }`);
    const commentTokens = parseAllPropComments(commentJson);
    expect(commentTokens).toEqual([]);
  });
});

it('pruneComments prunes all comments that match value, type, and inlining', () => {
  const jsonToPrune = parse(`{
    //a comment
    "experienceVersion": "<REPLACE ME>", //a comment
    /*a comment*/
    "businessId": "<REPLACE ME>" //a comment
    //a comment
  }`);
  const commentsToDedupe = [
    {
      'inline': false,
      'type': 'LineComment',
      'value': 'a comment'
    }
  ];
  const prunedJson = stringify(pruneComments(jsonToPrune, commentsToDedupe), null, 2);
  const expected = stringify(parse(`{
    "experienceVersion": "<REPLACE ME>", //a comment
    /*a comment*/
    "businessId": "<REPLACE ME>" //a comment
  }`), null, 2);
  expect(prunedJson).toEqual(expected);
});

function readFixtures(testCase = 'default-test') {
  function readFixture(file) {
    return fs.readFileSync(path.resolve('tests/postupgrade/fixtures', testCase, file), 'utf-8')
  }
  const incoming = readFixture('incoming.json');
  const original = readFixture('original.json');
  const merged = readFixture('merged.json');
  return { incoming, original, merged };
}