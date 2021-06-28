import ManualInitializer from '../../../static/js/manual-initializer';

describe('The manual initializer works', () => {
  let initAnswers;

  beforeEach(() => {
    window.AnswersExperience = {
      runtimeConfig: {
        get: jest.fn(),
        set: jest.fn()
      }
    };
    initAnswers = jest.fn();
    const manualInitializer = new ManualInitializer(initAnswers);
    manualInitializer.setup();
  })

  it('The manual init function calls initAnswers', () => {
    window.AnswersExperience.init();
    expect(initAnswers).toHaveBeenCalledTimes(1);
  });

  it('Data passed into the init function is set on the runtimeConfig', () => {
    window.AnswersExperience.init({ 
      token: '123abc',
      linkTarget: '_blank'
    });
    const runtimeConfigSet = window.AnswersExperience.runtimeConfig.set;
    expect(runtimeConfigSet).toHaveBeenCalledWith('token', '123abc');
    expect(runtimeConfigSet).toHaveBeenCalledWith('linkTarget', '_blank');
  });
});