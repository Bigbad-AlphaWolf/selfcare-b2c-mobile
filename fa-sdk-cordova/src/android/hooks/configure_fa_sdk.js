const fs = require("fs");
const path = require("path");
const clientConfiguration = require(path.join(".", "..", "..", "hooks", "configuration")).functions;

module.exports = function () {
    const androidProjectOSPath = find_android_project();
    configure_sdk_initialization(androidProjectOSPath);
    install_firebase_cloud_messaging(androidProjectOSPath);
};

const FOLLOW_ANALYTICS_APPLICATION_JAVA_PATH = "cordova.plugin.followanalytics.FollowAnalyticsApplication";
const regexJavaClassDefinition = /class([^{]*)/;
const regexAndroidManifestJavaClass = /android:name="([^"]*)/;
const regexAndroidManifestApplicationTag = /(<application([^>]*))/;

const regexJavaFollowAnalyticsConfiguration = /FollowAnalytics.Configuration\(\)([^}]+)/;
const regexJavaIsVerbose = /isVerbose = ([^;]+)/;
const regexJavaApiKey = /apiKey = ([^;]+)/;
const regexJavaMaxBackgroundTimeWithinSession = /maxBackgroundTimeWithinSession[^=]*=[^\d]*(\d+)[^;]*/;

/*
* This function will search for the android project.
*/
function find_android_project() {
    let androidProjectOSPath;
    try {
        androidProjectOSPath = path.join("platforms", "android");
        let exists = fs.existsSync(androidProjectOSPath);
        if (!exists) {
            console.log("[FA] Android Project not found at : " + androidProjectOSPath);
            console.log("[FA] Please contact us, reporting this problem.");
            androidProjectOSPath = null;
        } else {
            console.log("[FA] Android Project : " + androidProjectOSPath);
        }
    } catch (error) {
        console.error("[FA] Error while looking for Android project : " + error);
    }
    return androidProjectOSPath;
}

/*
* This function will search for the AndroidManifest.xml file in the app directory.
*/
function find_android_manifest(androidProjectOSPath) {
    let androidManifestOSPath;
    try {
        androidManifestOSPath = path.join(androidProjectOSPath, 'app', 'src', 'main', 'AndroidManifest.xml');
        let exists = fs.existsSync(androidManifestOSPath);
        if (!exists) {
            console.log("[FA] AndroidManifest file not found at : " + androidManifestOSPath);
            console.log("[FA] Please contact us, reporting this problem.");
            androidManifestOSPath = null;
        } else {
            console.log("[FA] AndroidManifest file : " + androidManifestOSPath);
        }
    } catch (error) {
        console.error("[FA] Error while looking for AndroidManifest : " + error);
    }
    return androidManifestOSPath;
}

/*
* Function for checking if a custom application is set in AndroidManifest.xml or not.
* If it is set, then it will perform some overwriting on extending the Custom Application.java class in FollowAnalyticsApplication.java class.
* This way, we will be able to add FollowAnalyticsApplication.java class in AndroidManifest.xml.
* If it is not set, then we will only add FollowAnalyticsApplication.java class in AndroidManifest.xml file.
*
* Also, if it is found a FollowAnalyticsApplication.java class in AndroidManifest.xml, it will skip the configuration.
*/
function configure_sdk_initialization(androidProjectOSPath) {
    const androidManifestOSPath = find_android_manifest(androidProjectOSPath);
    if (androidManifestOSPath) {
        fs.readFile(androidManifestOSPath, 'utf8', function (err, androidManifestData) {
                if (err) {
                    console.log("[FA] configure_sdk_initialization method : " + err);
                    return;
                }
                const matchAndroidManifestApplicationTag = regexAndroidManifestApplicationTag.exec(androidManifestData);
                const androidManifestApplicationTagString = matchAndroidManifestApplicationTag[1];
                const androidManifestExtrasApplicationTagString = matchAndroidManifestApplicationTag[2];
                let applicationClassJavaPath = regexAndroidManifestJavaClass.exec(androidManifestApplicationTagString);
                if (androidManifestApplicationTagString) {
                    if (applicationClassJavaPath) {
                        applicationClassJavaPath = applicationClassJavaPath[1];
                        console.log("[FA] Found Application class in AndroidManifest.xml with the following value : " + applicationClassJavaPath);
                        if (applicationClassJavaPath === FOLLOW_ANALYTICS_APPLICATION_JAVA_PATH) {
                            console.log("[FA] Follow Analytics Application class already set in AndroidManifest.xml : " + FOLLOW_ANALYTICS_APPLICATION_JAVA_PATH + ".");
                            const javaDirectoryOsPath = path.join(androidProjectOSPath, 'app', 'src', 'main', 'java');
                            const myFollowAnalyticsApplicationOsPath = path.join(javaDirectoryOsPath, format_java_path_to_os_path(applicationClassJavaPath) + ".java");
                            fs.readFile(myFollowAnalyticsApplicationOsPath, 'utf8', function (error, myFollowAnalyticsApplicationData) {
                                if (error) {
                                    console.error("[FA] Unable to read file " + myFollowAnalyticsApplicationOsPath + " : " + error);
                                }
                                replace_client_configuration_in_application(myFollowAnalyticsApplicationOsPath, myFollowAnalyticsApplicationData);
                            });
                        } else {
                            if (applicationClassJavaPath.startsWith(".")) { // check that class is a relative path
                                const regexAndroidManifestPackage = /package="([^"]*)/;
                                const packageInAndroidManifest = regexAndroidManifestPackage.exec(androidManifestData)[1];
                                if (packageInAndroidManifest) {
                                    const customApplicationJavaPath = packageInAndroidManifest + applicationClassJavaPath;
                                    replace_custom_application(androidProjectOSPath, customApplicationJavaPath, androidManifestExtrasApplicationTagString, androidManifestData, androidManifestOSPath);
                                } else {
                                    console.log("[FA] Could not find package attribute in AndroidManifest.xml file.");
                                }
                            } else {
                                replace_custom_application(androidProjectOSPath, applicationClassJavaPath, androidManifestExtrasApplicationTagString, androidManifestData, androidManifestOSPath);
                            }
                        }
                    } else {
                        console.log("[FA] No application class set in AndroidManifest.xml file.");
                        replace_custom_application(androidProjectOSPath, applicationClassJavaPath, androidManifestExtrasApplicationTagString, androidManifestData, androidManifestOSPath);
                        console.log("[FA] Adding FollowAnalytics Application class in AndroidManifest.xml file.");
                    }
                } else {
                    console.log("[FA] Could not find Application tag in AndroidManifest.xml file.")
                }
            }
        );
    }
}

/*
* Function for formatting a java path (com.hello.world) to an OS path (com/hello/world)
*/
function format_java_path_to_os_path(javaPath) {
    let osPath = "";
    const javaPathSplittedAsArray = javaPath.split(".");
    javaPathSplittedAsArray.forEach(function (element) {
        osPath = path.join(osPath, element);
    });
    return osPath;
}

/*
* Function that will replace the custom application with FollowAnalyticsApplication.java class.
* It will change the content in <application... android:name="..." > of AndroidManifest.xml file;
* It will change the content of FollowAnalyticsApplication.java class in order to extends to the custom Application found previously in AndroidManifest.xml file
*
* param androidProjectOSPath : OS path for android project, i.e, platforms/android/
* param customApplicationJavaPath : Java path of custom application, i.e, cordova.plugin.followanalytics.FollowAnalyticsApplication or `undefined`
* param extrasApplicationContentAndroidManifest : attributes associated to application tag in AndroidManfiest.xml file, i.e,
*        android:hardwareAccelerated="true" android:icon="@mipmap/ic_launcher" android:label="@string/app_name"
*        android:name="cordova.plugin.followanalytics.FollowAnalyticsApplication" android:supportsRtl="true"
* param androidManifestData :  Content of AndroidManifest.xml file.
* param androidManifestOsPath : OS path of AndroidManifest.xml file, i.e, platforms/android/app/src/main/AndroidManifest.xml
*/
function replace_custom_application(androidProjectOSPath, customApplicationJavaPath, extrasApplicationContentAndroidManifest, androidManifestData, androidManifestOsPath) {
    const javaDirectoryOsPath = path.join(androidProjectOSPath, 'app', 'src', 'main', 'java');
    const myFollowAnalyticsApplicationOsPath = path.join(javaDirectoryOsPath, format_java_path_to_os_path(FOLLOW_ANALYTICS_APPLICATION_JAVA_PATH) + ".java");

    if (customApplicationJavaPath) {
        const customApplicationOsPath = path.join(javaDirectoryOsPath, format_java_path_to_os_path(customApplicationJavaPath) + ".java");
        const isCustomApplicationFinal = is_application_class_final(customApplicationOsPath);
        if (isCustomApplicationFinal === true) {
            throw new Error(
                "[FA] Problem to configure SDK initialization in Android Project :\n" +
                "[FA] - Application path : " + customApplicationOsPath + "\n" +
                "[FA] Please, contact the support team and report this error.\n"
            );
        }
    }

    try {
        fs.readFile(myFollowAnalyticsApplicationOsPath, 'utf8', function (error, myFollowAnalyticsApplicationData) {
            if (error) {
                console.log("[FA] configure_sdk_initialization method : " + error);
                return;
            }
            let result;
            if (customApplicationJavaPath) {
                const newClassDefinition = "class FollowAnalyticsApplication extends " + customApplicationJavaPath;
                result = myFollowAnalyticsApplicationData.replace(regexJavaClassDefinition, newClassDefinition);
            } else {
                result = myFollowAnalyticsApplicationData;
            }
            replace_client_configuration_in_application(myFollowAnalyticsApplicationOsPath, result);

            let newExtrasApplicationContent;
            if (customApplicationJavaPath) {
                newExtrasApplicationContent = extrasApplicationContentAndroidManifest.replace(regexAndroidManifestJavaClass, " android:name=\"" + FOLLOW_ANALYTICS_APPLICATION_JAVA_PATH);
            } else {
                newExtrasApplicationContent = extrasApplicationContentAndroidManifest + " android:name=\"" + FOLLOW_ANALYTICS_APPLICATION_JAVA_PATH + "\"";
            }
            const newApplicationTag = "<application" + newExtrasApplicationContent;
            if (customApplicationJavaPath) {
                console.log("[FA] Replacing FollowAnalytics Application class in AndroidManifest.xml file : " + newApplicationTag + ">");
            }

            result = androidManifestData.replace(regexAndroidManifestApplicationTag, newApplicationTag);
            fs.writeFile(androidManifestOsPath, result, 'utf8', function (err) {
                if (err) throw new Error('[FA] Unable to write in AndroidManifest.xml: ' + err);
            });
        });
    } catch (error) {
        console.error("[FA] replace_custom_application method : " + error);
    }
}

/*
* Function for replacing the client configuration to follow analytics configuration
*/
function replace_client_configuration_in_application(followAnalyticsApplicationOsPath, followAnalyticsApplicationData) {
    followAnalyticsApplicationData = update_followanalytics_configuration_content_in_application(followAnalyticsApplicationOsPath, followAnalyticsApplicationData);
    if (followAnalyticsApplicationData) {
        fs.writeFile(followAnalyticsApplicationOsPath, followAnalyticsApplicationData, 'utf8', function (err) {
            if (err) throw new Error("[FA] Unable to write in " + followAnalyticsApplicationOsPath + " : " + err);
        });
    }
}

/*
* Function that will update FollowAnalytics.Configuration content by getting the client configuration of followanalytics_configuration.json file in the project.
* @exception : Error, if FollowAnalytics.Configuration instance class is not found
* @return undefined | string
*/
function update_followanalytics_configuration_content_in_application(applicationOSPath, applicationData) {
    let res = undefined;

    let followAnalyticsConfigurationData = regexJavaFollowAnalyticsConfiguration.exec(applicationData);
    if (followAnalyticsConfigurationData) {
        followAnalyticsConfigurationData = followAnalyticsConfigurationData[1];
        let newFollowAnalyticsConfiguration = retrieve_follow_analytics_configuration_content_of_application_class(followAnalyticsConfigurationData);
        res = replace_client_configuration_properties_in_follow_analytics_configuration(applicationData, newFollowAnalyticsConfiguration);
    } else {
        throw new Error("[FA] FollowAnalytics.Configuration missing in \"" + applicationOSPath + "\". Cannot set configuration properties.");
    }
    return res;
}

/*
* Function that will replace the client configuration with FollowAnalytics.Configuration string retrieved in Application class.
* @return string | undefined, new follow analytics configuration string
*/
function replace_client_configuration_properties_in_follow_analytics_configuration(applicationData, followAnalyticsConfiguration) {
    const configurationPlatform = "android";
    let res = undefined;
    const clientConfigurationData = clientConfiguration.get_configuration_content();
    if (clientConfiguration) {
        console.log("[FA] -------- FollowAnalytics Configuration -------- ");
        const clientConfigurationApiKey = clientConfiguration.get_configuration_property(clientConfigurationData, configurationPlatform, "apiKey");
        if (!clientConfigurationApiKey) {
            throw new Error("[FA] apiKey property is missing in " + clientConfiguration.get_configuration_os_path() + " file. Contact support team by reporting this problem.");
        } else {
            console.log("[FA] ApiKey : " + clientConfigurationApiKey);
        }
        followAnalyticsConfiguration = followAnalyticsConfiguration.replace(regexJavaApiKey, "apiKey = \"" + clientConfigurationApiKey + "\"");

        const clientConfigurationIsVerbose = clientConfiguration.get_configuration_property(clientConfigurationData, configurationPlatform, "isVerbose");
        if (clientConfigurationIsVerbose) {
            followAnalyticsConfiguration = followAnalyticsConfiguration.replace(regexJavaIsVerbose, "isVerbose = " + clientConfigurationIsVerbose);
            console.log("[FA] isVerbose : " + clientConfigurationIsVerbose);
        } else {
            // if isVerbose isn't set (because it is optional), then we set it to false
            followAnalyticsConfiguration = followAnalyticsConfiguration.replace(regexJavaIsVerbose, "isVerbose = " + false);
        }

        const clientConfigurationMaxBackgroundTimeWithinSession = clientConfiguration.get_configuration_property(clientConfigurationData, configurationPlatform, "maxBackgroundTimeWithinSession");
        if (clientConfigurationMaxBackgroundTimeWithinSession !== undefined) {
            if (typeof clientConfigurationMaxBackgroundTimeWithinSession === "number") {
                followAnalyticsConfiguration = followAnalyticsConfiguration.replace(regexJavaMaxBackgroundTimeWithinSession, "maxBackgroundTimeWithinSession = " + clientConfigurationMaxBackgroundTimeWithinSession);
                console.log("[FA] regexJavaMaxBackgroundTimeWithinSession : " + clientConfigurationMaxBackgroundTimeWithinSession);
            } else {
                throw new Error("[FA] maxBackgroundTimeWithinSession property is not a number.");
            }
        } else {
            // if maxBackgroundTimeWithinSession isn't set (because it is optional), then we set it to 120
            followAnalyticsConfiguration = followAnalyticsConfiguration.replace(regexJavaMaxBackgroundTimeWithinSession, "maxBackgroundTimeWithinSession = 120");
        }

        applicationData = applicationData.replace(regexJavaFollowAnalyticsConfiguration, "FollowAnalytics.Configuration()" + followAnalyticsConfiguration);
        res = applicationData;
    } else {
        console.error("[FA] " + clientConfiguration.get_configuration_os_path() + " file missing in project. " +
            "FollowAnalitycs SDK cannot retrieve configuration information.");
    }

    return res;
}

/*
* Function that will retrieve information of Application class.
* Notice that if it doesn't find some configuration properties, it will add them with default values, because it is
* necessary for replacing properties with client configuration
* @param followAnalyticsConfigurationData, FollowAnalytics.Configuration content;
* @return FollowAnalytics.Configuration content;
*/
function retrieve_follow_analytics_configuration_content_of_application_class(followAnalyticsConfigurationData) {
    let followAnalyticsConfigurationApiKey = regexJavaApiKey.exec(followAnalyticsConfigurationData);
    let newFollowAnalyticsConfiguration = "{\n\t\t{\n";
    newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + "\t\t\tthis.apiKey = ";
    if (!followAnalyticsConfigurationApiKey) {
        newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + "null;\n";
    } else {
        newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + followAnalyticsConfigurationApiKey[1] + "\;\n";
    }

    let followAnalyticsConfigurationIsVerbose = regexJavaIsVerbose.exec(followAnalyticsConfigurationData);
    newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + "\t\t\tthis.isVerbose = ";
    if (!followAnalyticsConfigurationIsVerbose) {
        newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + "false;\n";
    } else {
        newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + followAnalyticsConfigurationIsVerbose[1] + "\;\n";
    }

    let followAnalyticsConfigurationMaxBackgroundTimeWithinSession = regexJavaMaxBackgroundTimeWithinSession.exec(followAnalyticsConfigurationData);
    newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + "\t\t\tthis.maxBackgroundTimeWithinSession = ";
    if (!followAnalyticsConfigurationMaxBackgroundTimeWithinSession) {
        newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + "120;\n";
    } else {
        newFollowAnalyticsConfiguration = newFollowAnalyticsConfiguration + followAnalyticsConfigurationMaxBackgroundTimeWithinSession[1] + "\;\n";
    }

    return newFollowAnalyticsConfiguration;
}


/*
* Function that will check if application class has the final keyword in his class definition.
*/
function is_application_class_final(applicationOsPath) {
    let res = true;
    try {
        if (fs.existsSync(applicationOsPath)) {
            const applicationData = fs.readFileSync(applicationOsPath, 'utf8');
            if (applicationData) {
                const regexFinalClassDefinition = /(final)[^class]/;
                const isApplicationClassFinal = regexFinalClassDefinition.exec(applicationData);
                if (isApplicationClassFinal) {
                    console.log("[FA] Found final keyword associated to the class : " + applicationOsPath);
                } else {
                    res = false;
                }
            }
        } else {
            console.error("[FA] Application Java class could not be found at : " + applicationOsPath);
        }
    } catch (error) {
        console.error("[FA] is_application_class_final method : " + error);
    }
    return res;
}

const FIREBASE_CERTIFICATE_FILE = path.join("google-services.json");


function install_firebase_cloud_messaging(androidProjectOSPath) {
    install_firebase_certificate(androidProjectOSPath);
    add_google_services_plugin(androidProjectOSPath);
}

function install_firebase_certificate(androidProjectOSPath) {
    if (fs.existsSync(FIREBASE_CERTIFICATE_FILE)) {
        console.log("[FA] google-services.json file found.");
        const appModuleOSPath = path.join(androidProjectOSPath, 'app', FIREBASE_CERTIFICATE_FILE);
        fs.writeFileSync(appModuleOSPath, fs.readFileSync(FIREBASE_CERTIFICATE_FILE));
        console.log("[FA] Adding google-services.json file to " + appModuleOSPath);
    } else {
        console.warn("[FA] google-services.json file is missing in directory. Push notifications will not work.");
    }
}

function add_google_services_plugin(androidProjectOSPath) {
    if (androidProjectOSPath) {
        const appBuildGradleOsPath = path.join(androidProjectOSPath, "app", "build.gradle");
        if (fs.existsSync(appBuildGradleOsPath)) {
            var appBuildGradleContent = fs.readFileSync(appBuildGradleOsPath,'utf8');
            if(appBuildGradleContent) {
                const regexApplyPluginGoogleServices = /apply plugin: 'com.google.gms.google-services'/;
                var isPluginGoogleServicesApplied = regexApplyPluginGoogleServices.exec(appBuildGradleContent);
                if (!isPluginGoogleServicesApplied) {
                    appBuildGradleContent = appBuildGradleContent + "\napply plugin: 'com.google.gms.google-services'";
                    fs.writeFileSync(appBuildGradleOsPath, appBuildGradleContent);
                }
            }
        } else {
            console.error("[FA] Couldn't read build.gradle file in app module at "+appBuildGradleOsPath);
        }

    }
}
