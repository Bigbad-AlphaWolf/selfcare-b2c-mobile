var helper = require("./helper");
var config = require("./configure_fa_sdk");
module.exports = function (context) {
  helper.restoreProjectBuildGradle();
  config.functions.restoreConfigs();
};