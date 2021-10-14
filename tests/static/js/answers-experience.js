import AnswersExperience from '../../../static/js/answers-experience';
import RuntimeConfig from '../../../static/js/runtime-config';

describe('AnswersExperience works properly', () => {
  it('visitor listener is called when visitor is set', () => {
    const runtimeConfig = new RuntimeConfig();
    const experience = new AnswersExperience(runtimeConfig);
    const callListenerSpy = jest.spyOn(experience.runtimeConfig, '_callKeySpecificListeners');
    experience.runtimeConfig.set('visitor', { id: '123', idMethod: 'test' });
    expect(callListenerSpy).toHaveBeenCalledWith('update', 'visitor');
  });
});