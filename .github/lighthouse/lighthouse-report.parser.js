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
 * @param {string} param0.label
 * @param {string} param0.url
 * @param {LighthouseSummary} param0.summary
 */
const createMarkdownTableRow = ({ label, url, summary }) =>
  [
    label ? `| ${label}` : `| [${createURL(url).pathname}](${url})`,
    .../** @type {(keyof LighthouseSummary)[]} */ (
      Object.keys(summaryKeys)
    ).map((k) => scoreEntry(summary[k])),
  ].join(' | ') + '|';

const createMarkdownTableHeader = () => [
  ['| URL', ...Object.values(summaryKeys)].join(' | ') + '|',
  ['|---', ...Array(Object.keys(summaryKeys).length).fill('---')].join('|') +
    '|',
];

/**
 * @param {(LighthouseOutputs & project_name: string)[]} outputs
 * @param {CoreSummary} coreSummary
 * @returns {string}
 */
const createLighthouseReport = (outputs, coreSummary) => {
  const tableHeader = createMarkdownTableHeader();
  const commentLines = [`## ⚡️ Lighthouse reports`];

  for (const { manifest, project_name } of outputs) {
    const averageSummary = manifest.reduce(
      (acc, { summary }) => {
        Object.keys(summary).forEach((key) => {
          acc[key] += summary[key];
        });
        return acc;
      },
      {
        performance: 0,
        accessibility: 0,
        'best-practices': 0,
        seo: 0,
        pwa: 0,
      },
    );
    Object.keys(averageSummary).forEach((key) => {
      averageSummary[key] /= manifest.length;
    });
    const icon =
      averageSummary.performance >= 0.85
        ? '🤠'
        : averageSummary.performance >= 0.5
          ? '🐌'
          : '🦥';
    commentLines.push(...['', `### ${icon} ${project_name}`, '']);
    const sortedManifest = manifest.sort((a, b) => {
      if (a.url < b.url) {
        return -1;
      }
      if (a.url > b.url) {
        return 1;
      }
      return 0;
    });
    const tableLines = sortedManifest.map((result) => {
      const testUrl = /** @type {string} */ result.url;

      return createMarkdownTableRow({
        url: testUrl,
        summary: result.summary,
      });
    });

    if (tableLines.length === 0) {
      commentLines.push('> No reports available for this project');
    } else {
      commentLines.push(...tableHeader);
      commentLines.push(...tableLines);
      commentLines.push(
        createMarkdownTableRow({
          label: '**Average**',
          url: '',
          summary: averageSummary,
        }),
      );
    }
  }

  for (const line of commentLines) {
    coreSummary.addRaw(line, true);
  }

  coreSummary.write();

  return commentLines.join('\n');
};

module.exports = ({ lighthouseOutputs }, coreSummary) => {
  console.log('exampleOutput: %o', _exampleOutputs);
  return createLighthouseReport(lighthouseOutputs, coreSummary);
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
