const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const yaml = require('js-yaml');

module.exports = async function (context) {
  const date = new Date().toISOString();
  console.log(JSON.stringify(context));

  let mainFile = null;
  const files = [];
  context?.artifactPaths.forEach((artifactPath) => {
    if (artifactPath.endsWith('.msi')) {
      const file = recordFile(artifactPath);
      files.push(file);
      if (!mainFile) mainFile = recordAsMainFile(file);
    } else if (artifactPath.endsWith('.exe')) {
      const file = recordFile(artifactPath);
      files.push(file);
      mainFile = recordAsMainFile(file);
    }
  });

  if (mainFile && files.length > 0) {
    const latest = {
      version: mainFile.version,
      files: files,
      path: mainFile.path,
      sha512: mainFile.sha512,
      releaseDate: date,
    };

    console.log('Latest file report: \n', latest);
    fs.writeFileSync(
      path.join(context?.outDir, 'latest.json'),
      JSON.stringify(latest, null, 2),
      'utf8'
    );
    fs.writeFileSync(
      path.join(context?.outDir, 'latest2.yml'),
      yaml.dump(latest),
      'utf8'
    );
  } else console.log('No MSI file found in artifactPaths.');
};

const recordFile = (artifactPath) => {
  const url = path.basename(artifactPath);
  const hash = crypto.createHash('sha512');
  const stats = fs.statSync(artifactPath);

  return {
    url: url,
    sha512: hash.digest('base64'),
    size: stats.size,
    isAdminRightsRequired: true,
  };
};

const recordAsMainFile = (file) => {
  const versionMatch = file.url.match(/(\d+\.\d+\.\d+)(?=\.(exe|msi)$)/);

  return {
    path: file.url,
    sha512: file.sha512,
    version: versionMatch ? versionMatch[1] : null,
  };
};
