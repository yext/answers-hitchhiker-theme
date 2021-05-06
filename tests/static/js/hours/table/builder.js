import HoursTableBuilder from 'static/js/hours/table/builder.js';
import { DayNames, TableHeaders } from 'static/js/hours/constants';
import Hours from 'static/js/hours/models/hours';
import { OpenStatusStrings, OpenStatusTypes } from 'static/js/hours/open-status/constants.js';

describe('HoursTableBuilder properly builds hours table', () => {
  /**
   * A mock implementation of {@link HoursStringsLocalizer}
   */
  const localizer = {
    getLocalizedTime: (yextTime) => {
      let time = new Date();
      time.setHours(Math.floor(yextTime / 100));
      time.setMinutes(yextTime % 100);

      return time.toLocaleString('en', {
        hour: 'numeric',
        minute: 'numeric'
      });
    },
    getTranslation: (str) => {
      const translations = {
        [DayNames.MONDAY]: 'Monday',
        [DayNames.TUESDAY]: 'Tuesday',
        [DayNames.WEDNESDAY]: 'Wednesday',
        [DayNames.THURSDAY]: 'Thursday',
        [DayNames.FRIDAY]: 'Friday',
        [DayNames.SATURDAY]: 'Saturday',
        [DayNames.SUNDAY]: 'Sunday',
        [TableHeaders.DAY_OF_WEEK]: 'Day of the Week',
        [TableHeaders.HOURS]: 'Hours',
        [OpenStatusStrings.CLOSED]: 'Closed',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Open 24 Hours',
        [OpenStatusStrings.OPENS_AT]: 'Opens at',
        [OpenStatusStrings.OPEN_NOW]: 'Open Now',
        [OpenStatusStrings.CLOSES_AT]: 'Closes at',
      }
      return translations[str];
    }
  };

  const days = [
    {
      day: DayNames.MONDAY,
      intervals: [
        { start: '0100', end: '1400'}
      ]
    },
    {
      day: DayNames.TUESDAY,
      intervals: [
        { start: '0200', end: '1500' },
        { start: '1600', end: '1700'}
      ],
    },
    {
      day: DayNames.WEDNESDAY,
      intervals: [
        { start: '0000', end: '2359'}
      ],
    },
    {
      day: DayNames.THURSDAY,
      intervals: []
    },
    {
      day: DayNames.FRIDAY,
      intervals: [
        { start: '1200', end: '1800'}
      ],
      dailyHolidayHours: {
        intervals: [
          { start: '1200', end: '1400'}
        ]
      },
    },
    {
      day: DayNames.SATURDAY,
      intervals: [
        { start: '1200', end: '1300'}
      ],
      dailyHolidayHours: {
        isRegularHours: true
      }
    },
    {
      day: DayNames.SUNDAY,
      intervals: []
    }
  ];

  it('works with default config options', () => {
    const hoursTable = new HoursTableBuilder(localizer).build(new Hours({
      days: days,
      today: {
        day: DayNames.WEDNESDAY,
        time: 1600
      },
      openStatus: {
        status: OpenStatusTypes.OPEN_24_HOURS,
      },
    }));
    const expectedHoursTable = `
    <div class="c-hours-details-wrapper js-hours-table">
      <table class="c-hours-details">
        <thead class="sr-only">
          <tr>
            <th scope="col">Day of the Week</th>
            <th scope="col">Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr class="c-hours-details-row is-today">
            <td class="c-hours-details-row-day">
              Wednesday
            </td>
            <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">
            <span class="c-hours-details-row-intervals-instance-open">

                  <span class="Hours-statusText Hours-open24Hours">
                    Open 24 Hours
                  </span>
            </span>
          </span>
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Thursday
            </td>
            <td class="c-hours-details-row-intervals">
              Closed
            </td>
          </tr>
          <tr class="c-hours-details-row is-holiday">
            <td class="c-hours-details-row-day">
              Friday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            12:00 PM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            2:00 PM
          </span>
            </span>
            </td>
          </tr>
          <tr class="c-hours-details-row is-holiday">
            <td class="c-hours-details-row-day">
              Saturday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            12:00 PM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            1:00 PM
          </span>
            </span>
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Sunday
            </td>
            <td class="c-hours-details-row-intervals">
              Closed
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Monday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            1:00 AM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            2:00 PM
          </span>
            </span>
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Tuesday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            2:00 AM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            3:00 PM
          </span>
            </span>
            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            4:00 PM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            5:00 PM
          </span>
            </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;

    expect(hoursTable.replace(/\s/g, '')).toEqual(expectedHoursTable.replace(/\s/g, ''));
  });

  it('works with all config specified', () => {
    const config = {
      disableOpenStatus: true,
      firstDayInList: 'SUNDAY',
    };
    const hoursTable = new HoursTableBuilder(localizer).build(new Hours({
      days: days,
      today: {
        day: DayNames.WEDNESDAY,
        time: 1600
      },
      openStatus: {
        status: OpenStatusTypes.OPEN_24_HOURS,
      },
    }), config);
    const expectedHoursTable = `<div class="c-hours-details-wrapper js-hours-table">
    <table class="c-hours-details">
      <thead class="sr-only">
        <tr>
          <th scope="col">Day of the Week</th>
          <th scope="col">Hours</th>
        </tr>
      </thead>
      <tbody>
        <tr class="c-hours-details-row">
          <td class="c-hours-details-row-day">
            Sunday
          </td>
          <td class="c-hours-details-row-intervals">
            Closed
          </td>
        </tr>
        <tr class="c-hours-details-row">
          <td class="c-hours-details-row-day">
            Monday
          </td>
          <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">

        <span class="c-hours-details-row-intervals-instance-open">
          1:00 AM
        </span>
        <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
          -
        </span>
        <span class="c-hours-details-row-intervals-instance-close">
          2:00 PM
        </span>
          </span>
          </td>
        </tr>
        <tr class="c-hours-details-row">
          <td class="c-hours-details-row-day">
            Tuesday
          </td>
          <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">

        <span class="c-hours-details-row-intervals-instance-open">
          2:00 AM
        </span>
        <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
          -
        </span>
        <span class="c-hours-details-row-intervals-instance-close">
          3:00 PM
        </span>
          </span>
          <span class="c-hours-details-row-intervals-instance">

        <span class="c-hours-details-row-intervals-instance-open">
          4:00 PM
        </span>
        <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
          -
        </span>
        <span class="c-hours-details-row-intervals-instance-close">
          5:00 PM
        </span>
          </span>
          </td>
        </tr>
        <tr class="c-hours-details-row is-today">
          <td class="c-hours-details-row-day">
            Wednesday
          </td>
          <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">
            Open 24 Hours
          </span>
          </td>
        </tr>
        <tr class="c-hours-details-row">
          <td class="c-hours-details-row-day">
            Thursday
          </td>
          <td class="c-hours-details-row-intervals">
            Closed
          </td>
        </tr>
        <tr class="c-hours-details-row is-holiday">
          <td class="c-hours-details-row-day">
            Friday
          </td>
          <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">

        <span class="c-hours-details-row-intervals-instance-open">
          12:00 PM
        </span>
        <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
          -
        </span>
        <span class="c-hours-details-row-intervals-instance-close">
          2:00 PM
        </span>
          </span>
          </td>
        </tr>
        <tr class="c-hours-details-row is-holiday">
          <td class="c-hours-details-row-day">
            Saturday
          </td>
          <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">

        <span class="c-hours-details-row-intervals-instance-open">
          12:00 PM
        </span>
        <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
          -
        </span>
        <span class="c-hours-details-row-intervals-instance-close">
          1:00 PM
        </span>
          </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>`;
    expect(hoursTable.replace(/\s/g, '')).toEqual(expectedHoursTable.replace(/\s/g, ''));
  });

  // Edge case: tests that it does not use the open status message when there are split hours
  it('handles split hours properly', () => {
    const config = {
      disableOpenStatus: false,
      firstDayInList: 'WEDNESDAY',
    };
    const hoursTable = new HoursTableBuilder(localizer).build(new Hours({
      days: days,
      today: {
        day: DayNames.TUESDAY,
        time: 1600
      },
      openStatus: {
        status: OpenStatusTypes.CLOSES_TODAY,
        nextTime: 1700
      },
    }), config);
    const expectedHoursTable = `
    <div class="c-hours-details-wrapper js-hours-table">
      <table class="c-hours-details">
        <thead class="sr-only">
          <tr>
            <th scope="col">Day of the Week</th>
            <th scope="col">Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Wednesday
            </td>
            <td class="c-hours-details-row-intervals">

          <span class="c-hours-details-row-intervals-instance">
            Open 24 Hours
          </span>
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Thursday
            </td>
            <td class="c-hours-details-row-intervals">
              Closed
            </td>
          </tr>
          <tr class="c-hours-details-row is-holiday">
            <td class="c-hours-details-row-day">
              Friday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            12:00 PM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            2:00 PM
          </span>
            </span>
            </td>
          </tr>
          <tr class="c-hours-details-row is-holiday">
            <td class="c-hours-details-row-day">
              Saturday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            12:00 PM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            1:00 PM
          </span>
            </span>
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Sunday
            </td>
            <td class="c-hours-details-row-intervals">
              Closed
            </td>
          </tr>
          <tr class="c-hours-details-row">
            <td class="c-hours-details-row-day">
              Monday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            1:00 AM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            2:00 PM
          </span>
            </span>
            </td>
          </tr>
          <tr class="c-hours-details-row is-today">
            <td class="c-hours-details-row-day">
              Tuesday
            </td>
            <td class="c-hours-details-row-intervals">

            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            2:00 AM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            3:00 PM
          </span>
            </span>
            <span class="c-hours-details-row-intervals-instance">

          <span class="c-hours-details-row-intervals-instance-open">
            4:00 PM
          </span>
          <span class="c-hours-details-row-intervals-instance-separator" aria-label="To">
            -
          </span>
          <span class="c-hours-details-row-intervals-instance-close">
            5:00 PM
          </span>
            </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;

    expect(hoursTable.replace(/\s/g, '')).toEqual(expectedHoursTable.replace(/\s/g, ''));
  });
});
