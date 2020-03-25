/**
 * Contains some of the commonly used formatters for parsing pieces
 * of profile information.
 */
export default class Formatters {
    static phoneLink(profile, key = 'mainPhone') {
        if (!profile[key]) {
            return '';
        }
        return `tel:${profile[key]}`;
    }

    static phoneDisplay(profile, key = 'mainPhone') {
        if (!profile[key]) {
            return '';
        }
        return `${profile[key]}`;
    }

    static emailLink(profile) {
        return profile.emails ? "mailto:" + profile.emails[0] : ''
    }

    static getDirectionsUrl(profile, key = 'address') {
        const addr = profile[key];
        if (!addr) {
          return '';
        }

        const line2 = addr.line2 ? ` ${addr.line2},` : ``;
        const rawQuery = `${addr.line1},${line2} ${addr.city},${addr.region} ${addr.postalCode} ${addr.countryCode}`;
        const query = encodeURIComponent(rawQuery);
        return `https://www.google.com/maps/search/?api=1&query=${query}&output=classic`
    }

  static isTodayHoliday(holidayItem, todayDate) {
    if (!holidayItem.date) {
      return false;
    }

    const holidayDate = holidayItem.date.split('-');

    return parseInt(holidayDate[0]) === todayDate.getFullYear() &&
      parseInt(holidayDate[1]) === todayDate.getMonth() + 1 &&
      parseInt(holidayDate[2]) === todayDate.getDate()
  }

  static _getProfileFieldAtKeyPath(profile, keypath) {
    const paths = keypath.split('.');

    if (!paths.length) {
      console.error('invalid key path', keypath);
      return null;
    }

    return paths.reduce((haystack, needleKey) => {
      if (!haystack) {
        console.log('haystack was null or undefined', haystack, needleKey, idx);
        return null;
      }
      const needle = haystack[needleKey];
      if (!needle) {
        console.log('could not find ' + needleKey, haystack);
        return null;
      }

      return needle;
    }, profile);
  }

  static bigDate(profile, keyPath = 'time.start') {
    const dateString = this._getProfileFieldAtKeyPath(profile, keyPath);
    if (!dateString) {
      return null;
    }

    const date = this.betterTime(dateString);
    const locale = document.documentElement.lang.replace('_', '-');
    const time = date.toLocaleString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return {
      day: date.getDate(),
      month: date.toLocaleString(locale, { month: 'long' }),
      time: time,
    };
  }

  static betterTime(stamp) {
    const offset = new Date(stamp).getTimezoneOffset() / 60;
    const offsetStr = (offset < 0 ? '+0' : '-0') + Math.abs(offset) + ':00';
    return new Date(stamp + offsetStr);
  }

  static dateRange(
    profile,
    key = 'time',
    dateFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
    separator = '-') {

    const dateField = profile[key];
    if (!dateField) {
      console.error('could not find ', key, profile);
      return null;
    }

    if (!(dateField.start || dateField.end)) {
      console.error(key, 'is empty', profile);
      return null;
    }

    const locale = document.documentElement.lang.replace('_', '-');
    const start = this.betterTime(dateField.start);
    const end = this.betterTime(dateField.end);
    const startString = start.toLocaleString(locale, dateFormatOptions);
    let endString = end.toLocaleString(locale, dateFormatOptions);

    if (startString && endString) {
      if (start.toLocaleDateString() === end.toLocaleDateString()) {
        endString = end.toLocaleString(locale, {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
      }

      return `${startString} ${separator} ${endString}`;
    }

    if (startString) {
      return startString;
    }

    return endString;
  }

  static snakeToTitle(snake) {
    return snake.split('_')
      .map(frag => `${frag.charAt(0).toUpperCase()}${frag.slice(1)}`)
      .join(' ');
  }

  static prettyPrintObject(obj) {
    switch (typeof obj) {
      case 'string':
      case 'number':
      case 'bigint':
        return obj.toLocaleString();
      case 'boolean':
        return obj ? 'Yes' : 'No';
      case 'object':
        // check for null
        if (!obj) {
          return '';
        }
        if (Array.isArray(obj)) {
          return obj.map(sub => this.prettyPrintObject(sub)).join('<br>');
        }
        return Object.entries(obj)
          .map(([_, val]) => this.prettyPrintObject(val)).join(', ');
      default:
        return '';
    }
  }

  static joinList(list, separator) {
    if (!list) {
      return '';
    }
    return list.join(separator);
  }

  /*
  * Given object with url and alternateText, changes url to use https
  */
  static image(img, size = '200x', atLeastAsLarge = true) {
    if (!img) {
      return null;
    }
    if (!img.url) {
      return img;
    }

    function imageBySizeEntity(image, desiredSize, atLeastAsLarge = true) {
      if ((image == null) || !(Object.prototype.toString.call(image).indexOf('Object') > 0)) {
        throw new Error("Expected parameter of type Map");
      }
      if ((typeof desiredSize !== 'string') || (desiredSize == null)) {
        throw new Error(`Object of type string expected. Got ${typeof desiredSize}.`);
      }
      if (desiredSize.indexOf('x') === -1) {
        throw new Error("Invalid desired size");
      }
      if ((typeof atLeastAsLarge !== 'boolean') || (atLeastAsLarge == null)) {
        throw new Error(`Object of type boolean expected. Got ${typeof atLeastAsLarge}.`);
      }

      if (!image.thumbnails) {
        image.thumbnails = [];
      }

      if (!Array.isArray(image.thumbnails)) {
        throw new Error(`Object of type array expected. Got ${typeof image.thumbnails}.`);
      }

      if (image.width != undefined && image.height != undefined && image.url != undefined) {
        image.thumbnails.push({
          'width': image.width,
          'height': image.height,
          'url': image.url
        });
      }

      let height, index;
      let width = (height = -1);
      let desiredDims = desiredSize.split('x');

      if (desiredDims[0] !== '') {
        width = Number.parseInt(desiredDims[0]);
        if (Number.isNaN(width)) {
          throw new Error("Invalid width specified");
        }
      }

      if (desiredDims[1] !== '') {
        height = Number.parseInt(desiredDims[1]);
        if (Number.isNaN(height)) {
          throw new Error("Invalid height specified");
        }
      }

      let widthOk = width === -1;
      let heightOk = height === -1;

      if (atLeastAsLarge) {
        index = image.thumbnails.length - 1;

        while (index >= 0) {
          if (!(image.thumbnails[index].width && image.thumbnails[index].height)) {
            return image.thumbnails[index].url;
          }

          widthOk = width > 0 ? (image.thumbnails[index].width >= width) : widthOk;
          heightOk = height > 0 ? (image.thumbnails[index].height >= height) : heightOk;

          if (heightOk && widthOk) {
            break;
          }

          index--;
        }

        // if we exhausted the list
        if (index <= 0) {
          index = 0;
        }
      } else {
        index = 0;

        while (index < image.thumbnails.length) {
          if (!(image.thumbnails[index].width && image.thumbnails[index].height)) {
            return image.thumbnails[index].url;
          }

          if (width > 0) {
            widthOk = image.thumbnails[index].width <= width;
          }

          if (height > 0) {
            heightOk = image.thumbnails[index].height <= height;
          }

          if (heightOk && widthOk) { break; }

          index++;
        }

        // if we exhausted the list
        if (index >= image.thumbnails.length) {
          index = image.thumbnails.length - 1;
        }
      }

      return image.thumbnails[index].url;
    }

    const result = imageBySizeEntity(img, size, atLeastAsLarge);

    return Object.assign(
      {},
      img,
      {
        url: result.replace('http://', 'https://')
      }
    );
  }


  /**
  * Truncates strings to 250 characters, attempting to preserve whole words
  * @param str {string} the string to truncate
  * @param limit {Number} the maximum character length to return
  * @param trailing {string} a trailing string to denote truncation, e.g. '...'
  * @param sep {string} the word separator
  * @returns {string}
  */
  static truncate(str, limit = 250, trailing = '...', sep = ' ') {
    if (!str || str.length <= limit) {
      return str;
    }

    // TODO (bmcginnis): split punctuation too so we don't end up with "foo,..."
    const words = str.split(sep);
    const max = limit - trailing.length;
    let truncated = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (truncated.length + word.length > max ||
        (i !== 0 && truncated.length + word.length + sep.length > max)) {
        truncated += trailing;
        break;
      }

      truncated += i === 0 ? word : sep + word;
    }

    return truncated;
  }
}
