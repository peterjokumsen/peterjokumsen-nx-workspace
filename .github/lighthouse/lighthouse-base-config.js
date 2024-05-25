// see https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md
/**
 * @param {object | undefined} param0
 * @param {boolean | undefined} param0.isMobile
 * @returns {{settings: {skipAudits: string[]}, extends: string, passes: [{gatherers: string[], passName: string},{gatherers: string[], networkQuietThresholdMs: number, passName: string, recordTrace: boolean, useThrottling: boolean}]}}
 */
const getLighthouseConfig = ({ isMobile }) => {
  // audits can be found here:
  // https://github.com/GoogleChrome/lighthouse/blob/eba2a4d19c5786dc37e993858ff4b663181f81e5/lighthouse-core/config/default-config.js#L174
  const skipAudits = [
    'canonical', // for staging sites this will always be incorrect
    'is-crawlable', // for staging sites the x-robots-tag: none is served to prevent the staging site being indexed
    // 'maskable-icon',
    // 'valid-source-maps',
    // 'unsized-images',
    // 'offline-start-url',
  ];

  const settings = {
    skipAudits,
  };

  const passes = [
    {
      passName: 'fastPass',
      gatherers: ['fast-gatherer'],
    },
    {
      passName: 'slowPass',
      recordTrace: true,
      useThrottling: true,
      networkQuietThresholdMs: 1000,
      gatherers: ['slow-gatherer'],
    },
  ];

  return {
    extends: `lighthouse:${!isMobile ? 'desktop' : 'default'}`,
    settings,
    passes,
  };
};

export { getLighthouseConfig };
