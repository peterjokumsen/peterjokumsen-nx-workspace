const fs = require('fs');
const path = require('path');

const rootPackageJson = require('./package.json');

/**
 * Update the dependencies in the given package.json file to match the root package
 * @param {Object.<string, string>} target
 * @param {Object.<string, string>} source
 * @returns {{ changed: boolean, updated: Object.<string, string> }}
 */
const adjustDependencies = (target, source) => {
  let changed = false;
  const updated = {};
  for (const dep of Object.keys(target || {})) {
    if (source[dep] && target[dep] !== source[dep]) {
      updated[dep] = source[dep];
      changed = true;
    }
  }

  return { changed, updated };
};

const updatePeerDependencies = (filePath) => {
  const packageJson = require(`./${filePath}`);
  if (!packageJson.peerDependencies) {
    console.log(`No peer dependencies in ${filePath}`);
    return;
  }

  console.log(`Checking dependencies in ${filePath}`);
  const { changed, updated } = adjustDependencies(
    packageJson.peerDependencies,
    { ...rootPackageJson.dependencies, ...rootPackageJson.devDependencies },
  );

  if (changed) {
    console.log('Updating peer dependencies: ', updated);
    packageJson.peerDependencies = {
      ...packageJson.peerDependencies,
      ...updated,
    };
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
    console.log(`Saved changes for ${filePath}`);
  } else {
    console.log(`No changes for ${filePath}`);
  }
  console.log('');
};

const findPackageJsonFiles = (dir) => {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file[0] === '.' || file === 'dist') {
      continue;
    }

    const stat = fs.lstatSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...findPackageJsonFiles(filePath));
    } else if (file === 'package.json') {
      results.push(filePath);
    }
  }

  return results;
};

const packageJsonFiles = findPackageJsonFiles('./'); // Start from the root directory

packageJsonFiles.forEach((filePath) => {
  if (filePath !== 'package.json') {
    // Skip the root package.json
    updatePeerDependencies(filePath);
  }
});
