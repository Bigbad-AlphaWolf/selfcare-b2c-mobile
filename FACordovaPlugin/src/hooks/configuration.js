var fs = require("fs");
var path = require("path");

module.exports = function () {
    install_configuration();
};

/*
* External functions
*/
module.exports.functions = {
    get_configuration_property: function (configurationJsonString, platformOS, buildType, property) {
        return get_configuration_property(configurationJsonString, platformOS, buildType, property);
    },
    get_configuration_content: function () {
        return get_configuration_content();
    },
    get_configuration_os_path: function () {
        return get_configuration_os_path();
    }
};

const FOLLOW_ANALYTICS_CONFIGURATION_NAME = "followanalytics_configuration.json";

/*
* Function for adding FOLLOW_ANALYTICS_CONFIGURATION_NAME in the project.
* FOLLOW_ANALYTICS_CONFIGURATION_NAME will serve to add information for initializing the SDK.
*/
function install_configuration() {
    const configurationOSPath = get_configuration_os_path();
    const configurationExists = fs.existsSync(configurationOSPath);
    if (!configurationExists) {
        const pluginConfigurationOSPath = path.join("plugins", "cordova.plugin.followanalytics", configurationOSPath);
        if (fs.existsSync(pluginConfigurationOSPath)) {
            fs.writeFileSync(configurationOSPath, fs.readFileSync(pluginConfigurationOSPath));
            if (fs.existsSync(configurationOSPath)) {
                console.log("[FA] \"" + FOLLOW_ANALYTICS_CONFIGURATION_NAME + "\" file added to project. Consider to change/add parameters for initializing FollowAnalytics SDK.");
            } else {
                console.error("[FA] Problem occurred while adding \"" + FOLLOW_ANALYTICS_CONFIGURATION_NAME + "\" file in project. Contact support team by reporting the problem.");
            }
        } else {
            throw new Error("[FA] \"" + FOLLOW_ANALYTICS_CONFIGURATION_NAME + "\" file missing in plugin. Contact support team by reporting the problem.");
        }
    } else {
        console.log("[FA] \"" + FOLLOW_ANALYTICS_CONFIGURATION_NAME + "\" file found in project.");
    }
}

/*
* Function for retrieving any property of FOLLOW_ANALYTICS_CONFIGURATION_NAME.
* @param configurationJsonString, i.e, json string of configuration
* @param platformOS, i.e., "android"
* @param property, i.e., "apiKey"
*/
function get_configuration_property(configurationJsonString, platformOS, buildType, property) {
    if (configurationJsonString) {
        const configurationJSON = JSON.parse(configurationJsonString);
        buildType = buildType;
        let platformJSON = configurationJSON[platformOS];
        platformJSON = platformJSON[buildType];

        if (platformJSON) {
            const configurationProperty = platformJSON[property];
            if (configurationProperty !== undefined) {
                return configurationProperty;
            } else {
                console.error("[FA] Could not found configuration parameter : \"" + property + "\" in " + get_configuration_os_path() + " file.");
            }
        } else {
            console.error("[FA] Could not find configuration platform : \"" + platformOS + "\" in " + get_configuration_os_path() + " file.");
        }
    }
    return null;
}

/*
* Function for retrieving the content of FOLLOW_ANALYTICS_CONFIGURATION_NAME file.
*/
function get_configuration_content() {
    const configurationOSPath = get_configuration_os_path();
    const configurationExists = fs.existsSync(configurationOSPath);
    if (configurationExists) {
        return fs.readFileSync(configurationOSPath, 'utf8');
    } else {
        console.error("[FA] Could not retrieve content of " + FOLLOW_ANALYTICS_CONFIGURATION_NAME + " file. Reason : Missing " + FOLLOW_ANALYTICS_CONFIGURATION_NAME + " file in project.");
    }
}

/*
* Function that returns the relative path of configuration file.
*/
function get_configuration_os_path() {
    return path.join(FOLLOW_ANALYTICS_CONFIGURATION_NAME);
}
