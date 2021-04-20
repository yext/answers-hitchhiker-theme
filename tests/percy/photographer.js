class Photographer {
  constructor({ page, percySnapshot, siteUrl } = {}) {}

  async gotoUniversalPage({ queryParams = '' } = {}) {}

  async gotoVerticalPage({ vertical, queryParams = '' } = {}) {}

  async snapshot(snapshotName) {}

  async snapshotDesktopOnly(snapshotName) {}

  async snapshotMobileOnly(snapshotName) {}

  async click(selector) {}
}

module.exports = Photographer;