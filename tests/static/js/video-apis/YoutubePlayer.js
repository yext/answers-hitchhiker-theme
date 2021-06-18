import YoutubePlayer from '../../../../static/js/video-apis/youtube/YoutubePlayer';

const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};

function createPlayer() {
  const YT = {
    PlayerState,
    Player: jest.fn().mockImplementation(() => ({}))
  }
  return new YoutubePlayer(YT, null, jest.fn());
}

it('is instantiated with state UNSTARTED', () => {
  const player = createPlayer();
  expect(player.playerState).toEqual(PlayerState.UNSTARTED);
});

describe('onPlay', () => {
  it('does not call onPlay on startup', () => {
    const player = createPlayer();
    expect(player.onPlay).toHaveBeenCalledTimes(0);
  });
  
  const videoNotPlayingStates = ['UNSTARTED', 'ENDED', 'PAUSED', 'CUED']
  for (const state of videoNotPlayingStates) {
    it(`calls onPlay when going from ${state} to PLAYING`, () => {
      const player = createPlayer();
      player.handleStateChange({ data: PlayerState[state] });
      expect(player.onPlay).toHaveBeenCalledTimes(0);
      player.handleStateChange({ data: PlayerState.PLAYING });
      expect(player.onPlay).toHaveBeenCalledTimes(1);
    });
  }

  const videoPlayingStates = ['PLAYING', 'BUFFERING'];
  for (const state of videoPlayingStates) {
    it(`does NOT call onPlay when going from ${state} to PLAYING`, () => {
      const player = createPlayer();
      player.handleStateChange({ data: PlayerState[state] });
      expect(player.onPlay).toHaveBeenCalledTimes(1);
      player.handleStateChange({ data: PlayerState.PLAYING });
      expect(player.onPlay).toHaveBeenCalledTimes(1);
    });
  }
});
