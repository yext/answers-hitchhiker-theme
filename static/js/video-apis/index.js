/**
 * See https://developers.google.com/youtube/iframe_api_reference
 *
 * @returns {Promise<YoutubeAPI>}
 */
export async function requireYoutubeAPI() {
  const { default: YoutubeAPI } = await import('./youtube/loadYoutubeAPI');
  return YoutubeAPI
}

/**
 * @returns {Promise<VimeoAPI>}
 */
export async function requireVimeoAPI() {
  const { default: VimeoAPI } = await import('./VimeoAPI');
  return VimeoAPI;
}