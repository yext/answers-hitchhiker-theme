import { OpenStatusStrings, OpenStatusTypes } from '../../../../../static/js/hours/open-status/constants';
import OpenStatusMessageFactory from '../../../../../static/js/hours/open-status/messagefactory';

const localizer = {
  getLocalizedTime: jest.fn(yextTime => {
    let time = new Date();
    time.setHours(Math.floor(yextTime / 100));
    time.setMinutes(yextTime % 100);

    return time.toLocaleString('en', {
      hour: 'numeric',
      minute: 'numeric'
    });
  }),
  getTranslation: jest.fn(str => {
    const translations = {
      [OpenStatusStrings.CLOSED]: 'Closed',
      [OpenStatusStrings.OPEN_24_HOURS]: 'Open 24 Hours',
      [OpenStatusStrings.OPENS_AT]: 'Opens at',
      [OpenStatusStrings.OPEN_NOW]: 'Open Now',
      [OpenStatusStrings.CLOSES_AT]: 'Closes at',
    }
    return translations[str];
  })
};
const messageFactory = new OpenStatusMessageFactory(localizer);
const sanitizeMessage = msg => msg.replace(/\s/g, '');

describe('Open Status messages are generated correctly', () => {
  it(`generates ${OpenStatusTypes.OPENS_TODAY} message correctly`, () => {
    const hoursToday = {
      status: OpenStatusTypes.OPENS_TODAY,
      nextTime: 1700
    };

    const expectedMessage = `<span class="Hours-statusText Hours-opensToday">
      <span class="Hours-statusText--current Hours-closed">
        Closed
      </span> · Opens at <span class="HoursInterval-time Hours-opensAtTime">
        5:00 PM
      </span>
    </span>`;

    expect(sanitizeMessage(messageFactory.create(hoursToday)))
      .toEqual(sanitizeMessage(expectedMessage));
    expect(localizer.getLocalizedTime.mock.calls[0][0]).toBe(1700);
    expect(localizer.getTranslation.mock.calls[0][0]).toBe(OpenStatusStrings.CLOSED);
    expect(localizer.getTranslation.mock.calls[1][0]).toBe(OpenStatusStrings.OPENS_AT);
  });
});