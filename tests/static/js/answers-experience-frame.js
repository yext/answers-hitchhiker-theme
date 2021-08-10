import AnswersExperienceFrame from '../../../static/js/answers-experience-frame';
import RuntimeConfig from '../../../static/js/runtime-config';
import { sendToIframe } from '../../../static/js/iframe-common';

jest.mock('../../../static/js/iframe-common');

describe('AnswersExperienceFrame works propertly', () => {
  let answersExperienceFrame;

  beforeEach(() => {
    const runtimeConfig = new RuntimeConfig();
    answersExperienceFrame = new AnswersExperienceFrame(runtimeConfig);
    jest.clearAllMocks(); // ensure mock.calls are cleared before each test
  });

  it('The init function sends an init message to the iframe', () => {
    answersExperienceFrame.init({});
    const expectedMessage = {
      initAnswersExperience: true,
      runtimeConfig: {}
    };
    expect(sendToIframe).toHaveBeenCalledWith(expectedMessage);
  });

  it('Runtime config passed to the init function is sent to the child iframe', () => {
    answersExperienceFrame.init({linkTarget: '_blank'});
    const expectedMessage = {
      initAnswersExperience: true,
      runtimeConfig: {linkTarget: '_blank'}
    };
    expect(sendToIframe).toHaveBeenCalledWith(expectedMessage);
  });

  it('An init message will only be sent once', () => {
    answersExperienceFrame.init({});
    answersExperienceFrame.init({});
    expect(sendToIframe).toHaveBeenCalledTimes(1);
  });
});