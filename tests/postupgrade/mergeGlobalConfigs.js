const { parse } = require('comment-json');
const { readFileSync } = require('fs');
const path = require('path');
const {
  mergeGlobalConfigs,
  mergeTokens,
  tokenize,
  transformToCommentJsonObject
} = require('../../postupgrade/mergeGlobalConfigs');

describe('mergeGlobalConfigs', () => {
  it('new-incoming-props', () => {
    const { incoming, original, expected } = readFixtures('new-incoming-props');
    const mergedConfig = mergeGlobalConfigs(original, incoming);
    expect(mergedConfig).toEqual(expected);
  });

  it('additional-prop-in-original', () => {
    const { incoming, original, expected } = readFixtures('additional-prop-in-original');
    const mergedConfig = mergeGlobalConfigs(original, incoming);
    expect(mergedConfig).toEqual(expected);
  });

  it('extra-comments', () => {
    const { incoming, original, expected } = readFixtures('extra-comments');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mergedConfig = mergeGlobalConfigs(original, incoming);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    consoleErrorSpy.mockRestore();
    expect(mergedConfig).toEqual(expected);
  });
});

it('tokenize works for both Property and CommentedOutProperty tokens', () => {
  const tokens = tokenize(parse(`
  {
    "sdkVersion": "new" // The version of the Answers SDK to use
    // "token": "<REPLACE ME>", // The auth token to access Answers experience.
  }
  `));
  expect(tokens).toEqual([
    {
      type: 'Property',
      key: 'sdkVersion',
      value: 'new',
      inlineComment: {
        type: 'LineComment',
        inline: true,
        value: ' The version of the Answers SDK to use'
      }
    },
    {
      type: 'CommentedOutProperty',
      key: 'token',
      comment: {
        type: 'LineComment',
        value: ' "token": "<REPLACE ME>", // The auth token to access Answers experience.',
        inline: false
      }
    }
  ]);
});

describe('mergeTokens', () => {
  it('favors the incoming config for CommentedOutProperty tokens', () => {
    const incoming = [
      {
        type: 'CommentedOutProperty',
        key: 'aKey',
        comment: {
          type: 'LineComment',
          inline: false,
          value: '"aKey": "incoming"'
        }
      }
    ];
    const original = [
      {
        type: 'CommentedOutProperty',
        key: 'aKey',
        inlineComment: {
          type: 'LineComment',
          inline: false,
          value: '"aKey": "original"'
        }
      }
    ];
    expect(mergeTokens(original, incoming)).toEqual(incoming);
  });

  it('favors the original config for Property tokens', () => {
    const incoming = [
      {
        type: 'Property',
        key: 'aKey',
        value: 'incoming value',
        inlineComment: {
          type: 'LineComment',
          inline: true,
          value: 'incoming comment'
        }
      }
    ];
    const original = [
      {
        type: 'Property',
        key: 'aKey',
        value: 'original value',
        inlineComment: {
          type: 'LineComment',
          inline: true,
          value: 'original comment'
        }
      }
    ];
    expect(mergeTokens(original, incoming)).toEqual(original)
  });
});

it('transformToCommentJsonObject transforms to a CommentJSONObject equivalent', () => {
  const tokens = [
    {
      type: 'Property',
      key: 'sdkVersion',
      value: 'new',
      inlineComment: {
        type: 'LineComment',
        inline: true,
        value: ' The version of the Answers SDK to use'
      }
    },
    {
      type: 'CommentedOutProperty',
      key: 'token',
      comment: {
        type: 'LineComment',
        value: ' "token": "<REPLACE ME>", // The auth token to access Answers experience.',
        inline: false
      }
    }
  ];
  expect(transformToCommentJsonObject(tokens)).toEqual({
    sdkVersion: 'new',
    [Symbol.for('after:sdkVersion')]: [
      {
        type: 'LineComment',
        value: ' The version of the Answers SDK to use',
        inline: true
      },
      {
        type: 'LineComment',
        value: ' "token": "<REPLACE ME>", // The auth token to access Answers experience.',
        inline: false
      }
    ]
  });
});

function readFixtures(testCase) {
  function readFixture(file) {
    return readFileSync(path.resolve('tests/postupgrade/fixtures', testCase, file), 'utf-8')
  }
  const incoming = readFixture('incoming.json');
  const original = readFixture('original.json');
  const expected = readFixture('merged.json');

  return { incoming, original, expected };
}