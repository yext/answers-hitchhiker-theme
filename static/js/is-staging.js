const defaultStagingDomains = ['127.0.0.1', 'localhost', 'office.yext.com'];
let stagingDomains = defaultStagingDomains;

export function isStaging(host = window.location.host) {
  return stagingDomains.some(domain => host.includes(domain));
}

export function addStagingDomains(_stagingDomains) {
  stagingDomains = defaultStagingDomains.concat(_stagingDomains);
}
