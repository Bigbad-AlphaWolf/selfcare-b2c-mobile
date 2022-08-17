var fs = require("fs");
var path = require("path");

function hasBuildGradle() {
  var target = path.join("platforms", "android", "build.gradle");
  return fs.existsSync(target);
}

/*
 * Read the project build.gradle
 */
function readProjectBuildGradle() {
  var target = path.join("platforms", "android", "build.gradle");
  return fs.readFileSync(target, "utf-8");
}

/*
 * Add a 'com.google.gms' dependency based on the known 'com.android.tools.build' dependency in the build.gradle
 */
function addDependencies(buildGradle) {
  const regexDependencies = /dependencies[^}]+/;
  const regexGoogleServicesClassPath = /com.google.gms:google-services:.+/;

  var dependenciesContent = regexDependencies.exec(buildGradle)[0];
  if (dependenciesContent) {
    const googleServicesClassPath = regexGoogleServicesClassPath.exec(dependenciesContent);
    if (googleServicesClassPath) {
      dependenciesContent = dependenciesContent.replace(regexGoogleServicesClassPath, "com.google.gms:google-services:4.3.3'");
    } else {
      dependenciesContent = dependenciesContent + "\tclasspath 'com.google.gms:google-services:4.3.3'\n\t";
    }
    buildGradle = buildGradle.replace(regexDependencies, dependenciesContent);
  }
  return buildGradle;
}

/*
 * Add 'google()' to repository repo list
 */
function addRepositories(buildGradle) {
  // line to match
  var match = buildGradle.match(/^(\s*)jcenter\(\)/m);
  var whitespace = match?.[1];

    // update projects grouping
  var allProjectsIndex = buildGradle.indexOf('allprojects');
  if (allProjectsIndex > 0) {
    // split allprojects string, get jcenter 2nd instance
    var firstHalfOfFile = buildGradle.substring(0, allProjectsIndex);
    var secondHalfOfFile = buildGradle.substring(allProjectsIndex);

    // Add google() to allprojects section of the string
    match = secondHalfOfFile.match(/^(\s*)jcenter\(\)/m);
    var googleMavenRepo = whitespace + 'google() // Google\'s Maven repository from cordova-plugin-firebase';
    modifiedLine = match?.[0] + '\n' + googleMavenRepo;
    // modify the part of the string after 'allprojects'
    secondHalfOfFile = secondHalfOfFile.replace(/^(\s*)jcenter\(\)/m, modifiedLine);

    // recombine the modified line
    buildGradle = firstHalfOfFile + secondHalfOfFile;
  } else {
    // shouldn't happen. this should not happen, but if it does, we should try to add the dependency to the buildscript
    match = buildGradle.match(/^(\s*)jcenter\(\)/m);
    var googleMavenRepo = whitespace + 'google() // Google\'s Maven repository from cordova-plugin-firebase';
    modifiedLine = match?.[0] + '\n' + googleMavenRepo;
    // modify the part of the string that is after 'allprojects'
    buildGradle = buildGradle.replace(/^(\s*)jcenter\(\)/m, modifiedLine);
  }

  return buildGradle;
}

/*
 * Write to the project build.gradle
 */
function writeProjectBuildGradle(contents) {
  var target = path.join("platforms", "android", "build.gradle");
  fs.writeFileSync(target, contents);
}

module.exports = {
  modifyProjectBuildGradle: function () {
    if (!hasBuildGradle) {
      return;
    }

    var buildGradle = readProjectBuildGradle();
		//console.log('----------gradle--------', buildGradle);
    // Add Google Play Services Dependency
    buildGradle = addDependencies(buildGradle);

    // Add Google's Maven Repo
    buildGradle = addRepositories(buildGradle);

    writeProjectBuildGradle(buildGradle);
  },

  restoreProjectBuildGradle: function () {
    if (!hasBuildGradle) {
      return;
    }

    var buildGradle = readProjectBuildGradle();

    // remove any lines we added
    buildGradle = buildGradle.replace(/(?:^|\r?\n)(.*)cordova-plugin-firebase*?(?=$|\r?\n)/g, '');

    writeProjectBuildGradle(buildGradle);
  }
};