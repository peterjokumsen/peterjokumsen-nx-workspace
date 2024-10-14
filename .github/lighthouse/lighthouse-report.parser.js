// @ts-check

/**
 * @typedef {Object} Summary
 * @prop {number} performance
 * @prop {number} accessibility
 * @prop {number} best-practices
 * @prop {number} seo
 * @prop {number} pwa
 */

/**
 * @typedef {Object} Manifest
 * @prop {string} url
 * @prop {boolean} isRepresentativeRun
 * @prop {string} htmlPath
 * @prop {string} jsonPath
 * @prop {Summary} summary
 */

/**
 * @typedef {Object} LighthouseOutputs
 * @prop {Record<string, string>} links
 * @prop {Manifest[]} manifest
 */

/**
 * @typedef {function} summaryAddRaw
 * @param {string} rawString
 * @param {boolean} useEOL
 * @returns {void}
 */

/**
 * @typedef {function} write
 * @returns {void}
 */

/**
 * @typedef {Object} CoreSummary
 * @prop {summaryAddRaw} addRaw
 * @prop {write} write
 */

/** @typedef {Record<'performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa', number>} LighthouseSummary */

/** @type {Record<keyof LighthouseSummary, string>} */
const summaryKeys = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
  //  pwa: 'PWA',
};

/** @param {number} rawScore */
const scoreEntry = (rawScore) => {
  const score = Math.round(rawScore * 100);
  // eslint-disable-next-line no-nested-ternary
  const scoreIcon = score >= 85 ? '🟢' : score >= 50 ? '🟠' : '🔴';
  return `${scoreIcon} ${score}`;
};

/**
 * @param {string} url
 * @returns {module:url.URL}
 */
function createURL(url) {
  try {
    return new URL(url);
  } catch (e) {
    throw new Error(`Can't create URL for string=${url}, ${e}`);
  }
}

/**
 * @param {Object} param0
 * @param {string} param0.url
 * @param {LighthouseSummary} param0.summary
 * @param {string} param0.reportUrl
 */
const createMarkdownTableRow = ({ url, summary, reportUrl }) =>
  [
    `| [${createURL(url).pathname}](${url})`,
    .../** @type {(keyof LighthouseSummary)[]} */ (
      Object.keys(summaryKeys)
    ).map((k) => scoreEntry(summary[k])),
    `[Report](${reportUrl}) |`,
  ].join(' | ');

const createMarkdownTableHeader = () => [
  ['| URL', ...Object.values(summaryKeys), 'Report |'].join(' | '),
  ['|---', ...Array(Object.keys(summaryKeys).length).fill('---'), '---|'].join(
    '|',
  ),
];

/**
 * @param {LighthouseOutputs} lighthouseOutputs
 * @param {Record<string, string>} projectUrls
 * @param {CoreSummary} coreSummary
 * @returns {string}
 */
const createLighthouseReport = (
  { links, manifest },
  projectUrls,
  coreSummary,
) => {
  const tableHeader = createMarkdownTableHeader();
  const commentLines = [`### ⚡️ Lighthouse reports`];
  const reportedUrls = [];

  for (const projectName of Object.keys(projectUrls)) {
    commentLines.push(...['', `#### ${projectName}`, '']);
    const tableLines = manifest
      .filter(({ url }) => url.startsWith(projectUrls[projectName]))
      .map((result) => {
        const testUrl = /** @type {string} */ (
          Object.keys(links).find((key) => key === result.url)
        );
        reportedUrls.push(result.url);
        const reportPublicUrl = /** @type {string} */ (links[testUrl]);

        return createMarkdownTableRow({
          url: testUrl,
          summary: result.summary,
          reportUrl: reportPublicUrl,
        });
      });

    if (tableLines.length === 0) {
      commentLines.push('> No reports available for this project');
    } else {
      commentLines.push(...tableHeader);
      commentLines.push(...tableLines);
    }
  }

  const unreportedUrls = manifest.filter(
    ({ url }) => !reportedUrls.includes(url),
  );
  if (unreportedUrls.length > 0) {
    commentLines.push(...['', '#### Unknown URLs', '']);
    commentLines.push('> The following URLs were not included in the report:');
    commentLines.push(...unreportedUrls.map(({ url }) => `- ${url}`));
  }

  for (const line of commentLines) {
    coreSummary.addRaw(line, true);
  }

  coreSummary.write();

  return commentLines.join('\n');
};

module.exports = ({ lighthouseOutputs, project_urls }, coreSummary) => {
  console.log('exampleOutput: %o', _exampleOutputs);
  return createLighthouseReport(lighthouseOutputs, project_urls, coreSummary);
};

/** @type {LighthouseOutputs} */
const _exampleOutputs = {
  links: {
    'https://url-to-test/': 'https://report.html',
  },
  manifest: [
    {
      url: 'https://url-to-test/',
      isRepresentativeRun: true,
      htmlPath:
        '{workingDirectory}/.lighthouseci/{appUrl}-_-2022_01_29_06_23_27.report.html',
      jsonPath:
        '{workingDirectory}/.lighthouseci/{appUrl}-_-2022_01_29_06_23_27.report.json',
      summary: {
        performance: 0.27,
        accessibility: 0.97,
        'best-practices': 0.93,
        seo: 1,
        pwa: 0.64,
      },
    },
  ],
};
