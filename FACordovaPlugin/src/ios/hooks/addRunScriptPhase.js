module.exports = function (ctx) {

    var fs = require("fs");
    var path = require("path");
    var xcode = require("xcode");
    var deferral = require('q').defer();

    const regexScript = /(\/\* FollowAnalyticsScript \*\/[\s]+=[\s]+{[\s\S]+)(shellScript[\s\S][^;]+)/;

    /**
     * Recursively search for file with the tiven filter starting on startPath
     */
    function searchRecursiveFromPath(startPath, filter, rec, multiple) {
        if (!fs.existsSync(startPath)) {
            console.log("no dir ", startPath);
            return;
        }

        var files = fs.readdirSync(startPath);
        var resultFiles = []
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startPath, files[i]);
            var stat = fs.lstatSync(filename);
            if (stat.isDirectory() && rec) {
                fromDir(filename, filter); //recurse
            }

            if (filename.indexOf(filter) >= 0) {
                if (multiple) {
                    resultFiles.push(filename);
                } else {
                    return filename;
                }
            }
        }
        if (multiple) {
            return resultFiles;
        }
    }

    if (process.length >= 5 && process.argv[1].indexOf('cordova') == -1) {
        if (process.argv[4] != 'ios') {
            return; // plugin only meant to work for ios platform.
        }
    }

    var xcodeProjPath = searchRecursiveFromPath('platforms/ios', '.xcodeproj', false);
    var projectPath = xcodeProjPath + '/project.pbxproj';
    console.log("Found RunScript", projectPath);

    var proj = xcode.project(projectPath);
    proj.parseSync();

    //Path to strip-framework.sh
    var options = { shellPath: '/bin/sh', shellScript: '$SRCROOT/$PROJECT_NAME/Plugins/cordova.plugin.followanalytics/strip-frameworks.sh' };

    const xcodeProjectContent = fs.readFileSync(projectPath, "utf8");
    let hasScript = regexScript.exec(xcodeProjectContent);

    if (proj.buildPhase("FollowAnalyticsScript", proj.getFirstTarget().uuid)) {
        let shellScriptModified = hasScript[2].replace(
            hasScript[2],
            'shellScript = "$SRCROOT/$PROJECT_NAME/Plugins/cordova.plugin.followanalytics/strip-frameworks.sh"'
        );
        let shellScript = hasScript[1] + shellScriptModified;
        let result = xcodeProjectContent.replace(
            regexScript,
            shellScript.toString()
        );
        fs.writeFileSync(projectPath, result);
    } else {
        //Add Run Stript with the path
        proj.addBuildPhase(
            [],
            "PBXShellScriptBuildPhase",
            "FollowAnalyticsScript",
            proj.getFirstTarget().uuid,
            options
        );
        fs.writeFileSync(projectPath, proj.writeSync());
    }
};