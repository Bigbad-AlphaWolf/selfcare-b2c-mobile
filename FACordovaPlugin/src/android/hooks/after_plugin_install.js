var helper = require('./helper');
module.exports = function (context) {
  helper.restoreProjectBuildGradle();
  helper.modifyProjectBuildGradle();
};