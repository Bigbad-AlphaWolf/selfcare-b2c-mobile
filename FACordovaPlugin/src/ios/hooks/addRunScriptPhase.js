module.exports = function (ctx) {

    var fs = require("fs");
    var path = require("path");
    var xcode = require("xcode");
    var deferral = require('q').defer();

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

    /**
     * find a PBXFileReference on the provided project by its name
     */
    function findPbxFileReference(project, pbxFileName) {
        for (var uuid in project.hash.project.objects.PBXFileReference) {
            if (uuid.endsWith("_comment")) {
                continue;
            }
            var file = project.hash.project.objects.PBXFileReference[uuid];

            if (file.name !== undefined && file.name.indexOf(pbxFileName) != -1) {
                return file;
            }
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

    //Add Run Stript with the path 
    proj.parse(function(err) {
        proj.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run a script', proj.getFirstTarget().uuid, options);
        fs.writeFileSync(projectPath, proj.writeSync());
    })

    fs.writeFile(proj.filepath, proj.writeSync(), 'utf8', function (err) {
        if (err) {
            deferral.reject(err);
            return;
        }
        console.log("Wrote xcodeproj");
        deferral.resolve();
    });

    return deferral.promise;
};
