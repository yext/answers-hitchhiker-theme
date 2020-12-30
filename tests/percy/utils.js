/**
 * Waits until the content of the page stops changing.
 * 
 * This methods polls the html content length and waits until the value is the same for three
 * consecutive samples before returning.
 * 
 * @param {Puppeteer.Page} page 
 */
exports.waitTillHTMLRendered = async (page) => {
  const pollingIntervalMsecs = 750;
  const minNumStableIntervals = 3;

  let previousHTMLSize = 0;
  let numStableIntervals = 0;
  let isHTMLStabilized = false;

  while (!isHTMLStabilized) {
    await page.waitForTimeout(pollingIntervalMsecs);

    const currentHTMLSize = (await page.content()).length;

    if (currentHTMLSize === previousHTMLSize) {
      numStableIntervals++;
    } else {
      numStableIntervals = 0;
    }

    isHTMLStabilized = (numStableIntervals >= minNumStableIntervals && currentHTMLSize > 0);

    previousHTMLSize = currentHTMLSize;
  }
};