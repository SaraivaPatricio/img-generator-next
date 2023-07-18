const fse = require("fs-extra");

const srcDir = `../components/dist`;
const destDir = `./pages/api/dist`;

// To copy a folder or file, select overwrite accordingly
try {
  fse.copySync(srcDir, destDir, { overwrite: true | false });
  console.log("success!");
} catch (err) {
  console.error(err);
}
