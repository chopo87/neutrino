const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const yaml = require('js-yaml');

module.exports = async function (context) {
  const date = new Date().toISOString();
  console.log(JSON.stringify(context));

  const { mainFile, files } = await processFilesSequentially(
    context?.artifactPaths
  );

  console.log('mainFile: ', mainFile);
  console.log('files: ', files);

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
  } else console.log('No installer file found in artifactPaths.');
};

const processFilesSequentially = async (artifactPaths) => {
  let mainFile = null;
  const files = [];
  for (const artifactPath of artifactPaths) {
    if (artifactPath.endsWith('.msi')) {
      const file = await recordFile(artifactPath);
      files.push(file);
      if (!mainFile) mainFile = recordAsMainFile(file);
    } else if (artifactPath.endsWith('.exe')) {
      const file = await recordFile(artifactPath);
      files.push(file);
      mainFile = recordAsMainFile(file);
    }
  }
  return {
    mainFile: mainFile,
    files: files,
  };
};

const recordFile = async (artifactPath) => {
  const url = path.basename(artifactPath);
  const stats = fs.statSync(artifactPath);
  const sha512 = await evalSha512(artifactPath);

  return {
    url: url,
    sha512: sha512,
    size: stats.size,
    isAdminRightsRequired: true,
  };
};

const evalSha512 = async (artifactPath) => {
  const sha512 = await new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha512');
    const stream = fs.createReadStream(artifactPath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => {
      resolve(hash.digest('base64'));
    });
    stream.on('error', (err) => reject(err));
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return error;
    });
  return sha512;
};

const recordAsMainFile = (file) => {
  const versionMatch = file.url.match(/(\d+\.\d+\.\d+)(?=\.(exe|msi)$)/);

  return {
    path: file.url,
    sha512: file.sha512,
    version: versionMatch ? versionMatch[1] : null,
  };
};
