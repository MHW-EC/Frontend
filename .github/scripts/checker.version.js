const exec = require("node-os-utils/lib/exec");

const pathCurrentVersion = '../../documentation/versions.json';	

exec('git show origin/master:documentation/versions.json', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  if (stderr) {
    console.error(stderr);
    process.exit(1);
  }
  const versions = JSON.parse(stdout);

  const lastVersionMaster = Number(versions[versions.length - 1].replace(/\./g, ''));
  const currentVersion = Number(require(pathCurrentVersion).replace(/\./g, ''));

  if (currentVersion > lastVersionMaster) {
    console.error(`Current version is greater than last version on master.`);
    process.exit(0);
  }
  console.log(`Current version is equal or less than last version on master.`);
  process.exit(1);
});
