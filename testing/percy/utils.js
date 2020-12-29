exports.waitTillHTMLRendered = async (page) => {
  const timeout = 30000;
  const checkDurationMsecs = 500;
  const minStableIterations = 3;
  const maxChecks = timeout / checkDurationMsecs;

  let lastHTMLSize = 0;
  let numChecks = 0;
  let numStableIterations = 0;

  let isFullyRendered = false;
  let isMaxChecksReached = false;

  while (!isFullyRendered && !isMaxChecksReached) {
    await page.waitForTimeout(checkDurationMsecs);

    let currentHTMLSize = (await page.content()).length;

    numStableIterations = (currentHTMLSize === lastHTMLSize) ? numStableIterations + 1 : 0
    isFullyRendered = (numStableIterations >= minStableIterations && currentHTMLSize > 0);
    isMaxChecksReached = (numChecks >= maxChecks);

    lastHTMLSize = currentHTMLSize;
  }
};