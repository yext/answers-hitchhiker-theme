import { DayNames } from '../../../../static/js/hours/constants';
import HoursTransformer from '../../../../static/js/hours/transformer';

const dateClass = Date;
const mockDateClass = class extends Date {
  constructor(date = 'July 21, 2020 12:42:00 GMT-0500') {
    super(date);
  }
};

describe('formats hours for answers', () => {
  beforeEach(() => {
    // Mock the date class because holiday hours are only applied if they are for
    // dates which are within one week of the current date.
    global.Date = mockDateClass;
  });

  afterEach(() => {
    global.Date = dateClass;
  })

  it('formats hours for multiple days', () => {
    const expectedFormattedHours = [
      {
        day: DayNames.MONDAY,
        intervals: [{end: 400, start: 100}],
        isClosed: false,
        openIntervals: [{end: 400, start: 100}],
      },
      {
        day: DayNames.TUESDAY,
        intervals: [{end: 800, start: 100}],
        openIntervals: [{end: 800, start: 100}],
        isClosed: false
      },
      {
        day: DayNames.WEDNESDAY,
        intervals: [],
        openIntervals: [],
        isClosed: true
      }
    ];
    const days = {
      monday: {
        isClosed: false,
        openIntervals: [{ start: '01:00', end: '04:00' }]
      },
      tuesday: {
        isClosed: false,
        openIntervals: [{ start: '01:00', end: '08:00' }]
      },
      wednesday: {
        isClosed: true
      }
    }
    const timezoneOffset = '-04:00';
    const actualFormattedHours = HoursTransformer._formatHoursForAnswers(days, timezoneOffset);
    expect(actualFormattedHours).toEqual(expectedFormattedHours);
  });

  it('formats hours for multiple days and holiday hours', () => {
    const expectedFormattedHours = [
      {
        day: DayNames.TUESDAY,
        intervals: [{end: 800, start: 100}],
        openIntervals: [{end: 800, start: 100}],
        isClosed: false,
        dailyHolidayHours: {
          date: '2020-07-21',
          intervals: [{end: 200, start: 100}],
          openIntervals: [
            {
              end: 200,
              start: 100,
            },
          ],
        },
      },
      {
        day: DayNames.WEDNESDAY,
        intervals: [{end: 1000, start: 100}],
        openIntervals: [{end: 1000, start: 100}],
        isClosed: false,
        dailyHolidayHours: {
          date: '2020-07-22',
          isClosed: true,
          intervals: [],
          openIntervals: [],
        },
      },
      {
        day: DayNames.THURSDAY,
        intervals: [{end: 400, start: 100}],
        isClosed: false,
        openIntervals: [{end: 400, start: 100}],
        dailyHolidayHours: {
          date: '2020-07-23',
          intervals: [],
          openIntervals: [],
          isRegularHours: true
        },
      },
    ];
    const days = {
      tuesday: {
        isClosed: false,
        openIntervals: [{ start: '01:00', end: '08:00' }]
      },
      wednesday: {
        isClosed: false,
        openIntervals: [{ start: '01:00', end: '10:00' }]
      },
      thursday: {
        isClosed: false,
        openIntervals: [{ start: '01:00', end: '04:00' }]
      },
      holidayHours: [
        { date: '2020-07-21', openIntervals: [{ start: '01:00', end: '02:00' }] },
        { date: '2020-07-22', isClosed: true },
        { date: '2020-07-23', isRegularHours: true }
      ]
    }
    const timezoneOffset = '-04:00';
    const actualFormattedHours = HoursTransformer._formatHoursForAnswers(days, timezoneOffset);
    expect(actualFormattedHours).toEqual(expectedFormattedHours);
  });
});
