const mockedDate = new Date('December 25, 2020 12:42:00');
global.Date = class extends Date {
  constructor(date) {
    return date ? super(date) : mockedDate;
  }
};