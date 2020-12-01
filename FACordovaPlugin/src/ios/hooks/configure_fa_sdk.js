const fs = require("fs");
const path = require("path");
const clientConfiguration = require(path.join(".", "..", "..", "hooks", "configuration")).functions;


const regexProjectName = /<name>(.*?)<\/name>/;
const deviceReadyFunction = /onDeviceReady:[ ]*function[(][ ]*[)]*([ ]*[\n]*[ ]*)*{/;
const deviceReadyLineComment = /\/\/.*onDeviceReady:[ ]*function[(][ ]*[)]*([ ]*[\n]*[ ]*)*{/;
const deviceReadyComment = /(\/\*)([\S\s](?!\*\/))*onDeviceReady:[ ]*function[(][ ]*[)]*([ ]*[\n]*[ ]*)*{/;
const appDelegateMethod = /-[ ]*[(]BOOL[)]application:[\s\S]*didFinishLaunchingWithOptions:[\s\S]*{/;
const importOnAppDelegate = /#import[ ]*"AppDelegate\.h"/;

/*
* This object contains all the parameters from the Native SDKs.
* All this parameters can be used on the followanalytics_configuration.json
*/
const allParameters = 
{
    "apiKey": "string",
    "environmentProtocol": "string",
    "environment": "string",
    "environmentDomain": "string",
    "isVerbose": "boolean",
    "maxBackgroundTimeWithinSession": "integer",
    "optInAnalyticsDefault": "boolean",
    "archivePushMessages": "boolean",
    "archiveInAppMessages": "boolean",
    "isDataWalletEnabled": "boolean",
    "dataWalletDefaultPolicyPath": "string",
    "apiMode": "ApiMode",
    "appGroup": "string"
};

const allParametersKeys = Object.keys(allParameters);

const regexFAConfigurations = /FollowAnalyticsConfiguration\* _Nonnull c\) {([^}]+)/;

const iosProjectOSPath = find_ios_project();
const getIOSPluginPath = find_ios_plugin(iosProjectOSPath);
const AppDelegatePath = find_app_delegate(iosProjectOSPath);
const clientConfigurationData = clientConfiguration.get_configuration_content();

const configurationJSON = JSON.parse(clientConfigurationData);
const configurationPlatform = "ios";

get_file_content(getIOSPluginPath);
get_appdelegate_content(AppDelegatePath);

/*
* This function will ge the project name from config.xml.
*/
function get_project_name() {
    let configPath;
    configPath = path.join("config.xml");
    let exists = fs.existsSync(configPath);
    if(!exists) console.log("[FA] The file config.xml could not be found at" + configPath);
    let data = fs.readFileSync(configPath).toString();
    let result = regexProjectName.exec(data);
    if(result.length > 1){
        console.log("[FA] Project Name: " + result[1]);
        return result[1];
    }else{
        console.log("[FA] Could not find the Aplication Name on config.xml");
    }
}

/*
* This function will search for the ios project.
*/
function find_ios_project() {
    let iosProjectOSPath;
    try {
        iosProjectOSPath = path.join("platforms", "ios");
        let exists = fs.existsSync(iosProjectOSPath);
        if (!exists) {
            console.log("[FA] IOS Project not found at: " + iosProjectOSPath);
            console.log("[FA] Please contact us, reporting this problem.");
            iosProjectOSPath = null;
        } else {
            console.log("[FA] IOS Project: " + iosProjectOSPath);
        }
    } catch (error) {
        console.error("[FA] Error while looking for Android project : " + error);
    }
    return iosProjectOSPath;
}

/*
* This function will search for the FollowAnalyticsCordovaPlugin.m file in the app directory.
*/
function find_ios_plugin(iosProjectOSPath) {
    let iosPluginPath;
    let projectname = get_project_name();
    try {
        iosPluginPath = path.join(iosProjectOSPath, projectname, 'Plugins', 'cordova.plugin.followanalytics', 'FollowAnalyticsCordovaPlugin.m');
        let exists = fs.existsSync(iosPluginPath);
        if (!exists) {
            console.log("[FA] FollowAnalyticsCordovaPlugin file not found at: " + iosPluginPath);
            console.log("[FA] Please contact us, reporting this problem.");
            iosPluginPath = null;
        } else {
            console.log("[FA] FollowAnalyticsCordovaPlugin file: " + iosPluginPath);
        }
    } catch (error) {
        console.error("[FA] Error while looking for FollowAnalyticsCordovaPlugin : " + error);
    }
    return iosPluginPath;
}

/*
* This function will search for the AppDelegate.m file.
*/
function find_app_delegate(iosProjectOSPath) {
    let iosPluginPath;
    let projectname = get_project_name();
    try {
        iosPluginPath = path.join(iosProjectOSPath, projectname, 'Classes', 'AppDelegate.m');
        let exists = fs.existsSync(iosPluginPath);
        if (!exists) {
            console.log("[FA] AppDelegate file not found at: " + iosPluginPath);
            console.log("[FA] Please contact us, reporting this problem.");
            iosPluginPath = null;
        } else {
            console.log("[FA] AppDelegate.m file: " + iosPluginPath);
        }
    } catch (error) {
        console.error("[FA] Error while looking for AppDelegate.m : " + error);
    }
    return iosPluginPath;
}

/*
* This function will read the AppDelegate.m file and send the data to `write_appdelegate` method.
*/
function get_appdelegate_content(path) {
    let dataFile;
    file_content = fs.readFile(path, function(err,data) {    
        if(err) console.log("[FA] "+ path +" could not be found: " + err);
        dataFile = data.toString();
        write_appdelegate(dataFile);  
    });
}

/*
* This function will receive data from the app delegate and add the import for followanalytics and call the FollowAnalytics initialize.
*/
function write_appdelegate(data) {
    let applicationMethod = data.match(appDelegateMethod);
    let callMethod = /\[FollowAnalyticsCordovaPlugin initialize\];/;
    let importPlugin =/\#import \"FollowAnalyticsCordovaPlugin\.h\"/;
    let appDelegateImport = data.match(importOnAppDelegate);
    let modifiedData = data;
    if(applicationMethod) {
        let callMethodString = "[FollowAnalyticsCordovaPlugin initialize];";
        let importPluginString = "\#import \"FollowAnalyticsCordovaPlugin\.h\"";
        if(!data.match(importPlugin)) {
            let splitImport = data.split(appDelegateImport);
            modifiedData = splitImport[0] + appDelegateImport + "\n" + importPluginString + splitImport[1];
            fs.writeFileSync(AppDelegatePath, modifiedData);
            console.log("[FA] The import for FollowAnalytics on AppDelegate has been added.");
        } else {
            console.log("[FA] The import for FollowAnalytics on AppDelegate already exists.");
        }
        if(!data.match(callMethod)) {
            let splitdata = modifiedData.split(appDelegateMethod);
            let addMethod = splitdata[0] + applicationMethod + "\n    " + callMethodString + splitdata[1];
            fs.writeFileSync(AppDelegatePath, addMethod);
            console.log("[FA] The initialization of FollowAnalytics on AppDelegate has been added.");
        } else {
            console.log("[FA] The initialization of FollowAnalytics on AppDelegate already exists.");
        }
    }else {
        console.log("[FA] Could not found 'application:didFinishLaunchingWithOptions:' method on 'AppDelegate.m'");
    }
}

/*
* This function will get the FollowAnalyticsCordovaPlugin.m content and return an String to the "replace_content_plugin" function.
*/
function get_file_content(pathToFollowAnalyticsCordovaPlugin)
{
    let dataFile;
    file_content = fs.readFile(pathToFollowAnalyticsCordovaPlugin, function(err,data){    
        if(err) console.log("[FA] "+ pathToFollowAnalyticsCordovaPlugin +" could not be found: " + err);
        dataFile = data.toString();
        replace_content_plugin(dataFile);  
    });
}

/*
* This function will receive datafile parameter from get_file_content to get the info from followanalytics_configuration.json and send
 the new file modifications to the write_content and it will replace it
*/
function replace_content_plugin(filedata){
    let buildType = get_ios_build();
    let replacedFile = filedata;
    let parameterJSON = configurationJSON[configurationPlatform][buildType];
    let StringParameters = ""; 
    
    if(buildType){
        for (let i = 0; i < Object.keys(parameterJSON).length; i++) {
            let parameterKey = Object.keys(parameterJSON)[i];
            let parameterValue = parameterJSON[parameterKey];
            let isValidParameter = allParametersKeys.includes(parameterKey);

            if(isValidParameter){
                let parameterType = allParameters[parameterKey]
                if(parameterType == "string"){
                    if (!parameterValue || typeof parameterValue != "string"){ 
                        console.log("[FA] " + parameterKey + " parameter with value of "+ parameterValue +" have an invalid value in followanalytics_configuration.json");
                    } else {
                        console.log("[FA] " + parameterKey + ": " + parameterValue);
                        StringParameters += '\n c.'+parameterKey+' = @"'+parameterValue+'";'
                    }
                }else if(parameterType == "integer"){
                    if (!parameterValue || typeof parameterValue != "number"){ 
                        console.log("[FA] " + parameterKey + " parameter with value of "+ parameterValue +" have an invalid value in followanalytics_configuration.json");
                    } else {
                        console.log("[FA] " + parameterKey + ": " + parameterValue);
                        StringParameters += "\n c."+parameterKey+" = "+parameterValue+";"
                    }
                }else if(parameterType == "boolean"){
                    if (typeof parameterValue != "boolean"){ 
                        console.log("[FA] " + parameterKey + " parameter with value of "+ parameterValue +" have an invalid value in followanalytics_configuration.json");
                    } else {
                        console.log("[FA] " + parameterKey + ": " + parameterValue);
                        StringParameters += "\n c."+parameterKey+" = "+parameterValue+";"
                    }
                }else if(parameterType == "ApiMode"){
                    if (!parameterValue || typeof parameterValue != "string"){ 
                        console.log("[FA] " + parameterKey + " parameter with value of "+ parameterValue +" have an invalid value in followanalytics_configuration.json");
                    } else {
                        if(parameterValue.toLowerCase() == "dev"){
                            console.log("[FA] " + parameterKey + ": " + parameterValue);
                            parameterValue = "FollowAnalyticsAPIModeDev";
                            StringParameters += "\n c."+parameterKey+" = "+parameterValue+";"
                        } else if(parameterValue.toLowerCase() == "prod"){
                            console.log("[FA] " + parameterKey + ": " + parameterValue);
                            parameterValue = "FollowAnalyticsAPIModeProd";
                            StringParameters += "\n c."+parameterKey+" = "+parameterValue+";"
                        }else{
                            console.log("[FA] " + parameterKey + " parameter with value of "+ parameterValue +" have an invalid value in followanalytics_configuration.json");
                        }    
                    }
                }else{
                    console.log("[FA]Invalid Type on Plugin. Contact us reporting this problem");
                }
            }else{
                console.log("[FA] The parameter " + parameterKey + " is not valid." )
            }
        }
        replacedFile = replacedFile.replace(regexFAConfigurations, 'FollowAnalyticsConfiguration* _Nonnull c) {' + StringParameters + "\n");
        write_content(replacedFile);
    }  
}

/*
* This function will replace the FollowAnalyticsCordovaPlugin.m with the new configurations
*/
function write_content(replacedFile){
    fs.writeFile(getIOSPluginPath, replacedFile, function(err){
        if(err) throw err;
        
        console.log("[FA] -------- Configurations Updated! -------- ");
    });
}

/*
* This function will get the build variant from the environment variable FA_CONFIGURATION
*/
function get_ios_build(){
        let platformJSON = configurationJSON[configurationPlatform];
        let buildVariants = [];
        if(platformJSON){
            for (let i = 0; i < Object.keys(platformJSON).length; i++) {
                buildVariants.push(Object.keys(platformJSON)[i]);
            }
            let envVar = process.env.FA_CONFIGURATION;
    
            if(!envVar) console.log("[FA] Could not found FA_CONFIGURATION on environment variables"); 
            let build = buildVariants.includes(envVar);
            if(build){
                return envVar;
            }else{
                console.log("[FA] Could not found build '" + envVar + "' on followanalytics_configuration.json");
                if(buildVariants <= 0) return null;
                if(!buildVariants.includes("release")){
                    console.log("[FA] The build will be set to " + buildVariants[0]);
                    return buildVariants[0];
                } else {
                    console.log("[FA] The build will be set to release");
                    return "release";
                } 
            }
        }else{
            console.log("[FA] Could not found platform ios on followanalytics_configuration.json");
        }
    return null;
}
