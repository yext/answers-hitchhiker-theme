const { parse, stringify } = require('comment-json');
const fs = require('fs');
const {
  parseCommentedOutConfig,
  mergeGlobalConfigs,
  getPropCommentSymbols,
  pruneDuplicatedComments
} = require('../../postupgrade/utils');

it('mergeGlobalConfigs merges together two global configs, and removes duplicated comments', () => {
  const originalConfig = fs.readFileSync('./tests/postupgrade/original.json', 'utf-8');
  const newConfig = fs.readFileSync('./tests/postupgrade/new.json', 'utf-8');
  const expected = fs.readFileSync('./tests/postupgrade/merged.json', 'utf-8');
  const mergedConfig = mergeGlobalConfigs(newConfig, originalConfig);
  expect(mergedConfig).toEqual(expected);
});

it('getPropCommentSymbols ', () => {
  const testJson = parse(`{
    // "sdkVersion": "1.9", // sdkVersion comment
    "experienceVersion": "<REPLACE ME>", // experienceVersion comment
    "businessId": "<REPLACE ME>", // businessId comment
    // "initializeManually": true, // manualInit comment
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

it('parseCommentedOutConfig parses correctly', () => {
  const commentJson = parse(`{
    // "sdkVersion": "1.9", // sdkVersion comment
    "experienceVersion": "<REPLACE ME>", // experienceVersion comment
    "businessId": "<REPLACE ME>", // businessId comment
    // "initializeManually": true, // manualInit comment
  }`);
  const commentTokens = parseCommentedOutConfig(commentJson);
  expect(commentTokens).toMatchObject([
    {
      'inline': false,
      'type': 'LineComment',
      'value': ' "sdkVersion": "1.9", // sdkVersion comment'
    },
    {
      'inline': false,
      'type': 'LineComment',
      'value': ' "initializeManually": true, // manualInit comment'
    }
  ]);
});

it('pruneDuplicatedComments prunes all comments that match value, type, and inlining', () => {
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
  const prunedJson = stringify(pruneDuplicatedComments(jsonToPrune, commentsToDedupe), null, 2);
  const expected = stringify(parse(`{
    "experienceVersion": "<REPLACE ME>", //a comment
    /*a comment*/
    "businessId": "<REPLACE ME>" //a comment
  }`), null, 2);
  expect(prunedJson).toEqual(expected);
});