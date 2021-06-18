/**
 * @returns {Promise<YoutubeAPI>}
 */
export async function requireYoutubeAPI() {
  const { default: YoutubeAPI } = await import('./youtube/youtubeApiPromise');
  return YoutubeAPI;
}

/**
 * @returns {Promise<VimeoAPI>}
 */
export async function requireVimeoAPI() {
  const { default: VimeoAPI } = await import('./VimeoAPI');
  return VimeoAPI;
}
