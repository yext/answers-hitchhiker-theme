const { SnapshotWidths } = require('./constants');

/**
 * Responsible for taking Percy snapshots
 */
class Camera {
  /**
   * @param {function} percySnapshot The percy snapshot function
   * @param {boolean} iframeMode Enables capturing iframe snapshots
   * @param {string} locale Enables capturing locale specific snapshots
   */
  constructor(percySnapshot, iframeMode, locale='en') {
    this._percySnapshot = percySnapshot;
    this._iframeMode = iframeMode;
    this._locale = locale;
  }

  /**
   * Set locale for snapshot of the site
   * 
   * @param {string} locale 
   */
  setLocale(locale) {
    this._locale = locale;
  }

  /**
   * Take a mobile and desktop snapshot of the current page
   * 
   * @param {string} snapshotName The name of the snapshot to capture.
   */
  async snapshot(snapshotName) {
    const updatedSnapshotName = this._getSnapshotName(snapshotName);
    await this._percySnapshot(updatedSnapshotName);
  }

  /**
   * Take a desktop snapshot of the current page
   * 
   * @param {string} snapshotName The name of the snapshot to capture.
   */
  async snapshotDesktopOnly(snapshotName) {
    const updatedSnapshotName = this._getSnapshotName(snapshotName);
    await this._percySnapshot(updatedSnapshotName, { widths: [SnapshotWidths.Desktop] });
  }

  /**
   * Take a mobile snapshot of the current page
   * 
   * @param {string} snapshotName The name of the snapshot to capture.
   */
  async snapshotMobileOnly(snapshotName) {
    const updatedSnapshotName = this._getSnapshotName(snapshotName);
    await this._percySnapshot(updatedSnapshotName, { widths: [SnapshotWidths.Mobile] });
  }

  /**
   * Returns the correct snapshot name based on the iframe mode and locale
   * 
   * @param {string} snapshotName 
   * @returns {string}
   */
  _getSnapshotName(snapshotName) {
    let updatedSnapshotName = this._iframeMode ? snapshotName + '_iframe' : snapshotName;
    return this._locale === 'en' ? updatedSnapshotName : this._locale + '--' + updatedSnapshotName;
  }
}

module.exports = Camera;