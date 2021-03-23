import chainedLookup from '../../hbshelpers/chainedLookup';

it('performs a chained lookup', () => {
  const context = {
    a: {
      b: {
        c: 123
      }
    }
  };
  expect(chainedLookup(context, 'a', 'b', 'c', {})).toEqual(123);
});

it('short circuits when key does not exist', () => {
  const context = {
    a: {
      b: {
        c: 123
      }
    }
  };
  expect(chainedLookup(context, 'a', '123', 'asdf', {})).toEqual(undefined);
});


it('short circuits when intermediate key points to non-object', () => {
  const context = {
    a: {
      b: 123
    }
  };
  expect(chainedLookup(context, 'a', 'b', 'c', 'd', {})).toEqual(undefined);
});
