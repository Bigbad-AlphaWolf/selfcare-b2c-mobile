import { AwesomeCordovaNativePlugin } from '@awesome-cordova-plugins/core';
/**
 * @name Dimelo Cordova Plugin
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { DimeloCordovaPlugin } from '@awesome-cordova-plugins/dimelo-cordova-plugin';
 *
 *
 * constructor(private dimeloCordovaPlugin: DimeloCordovaPlugin) { }
 *
 * ...
 *
 *
 * this.dimeloCordovaPlugin.openChat('username', '771234567')
 *   .then((res: any) => console.log(res))
 *   .catch((error: any) => console.error(error));
 *
 * ```
 */
export declare class DimeloCordovaPluginOriginal extends AwesomeCordovaNativePlugin {
    /**
     * This function open native Chat View
     *
     * @param username {string} Some param to configure something
     * @param msisdn {string} Another param to configure something
     * @return {Promise<any>} Returns a promise that resolves when something happens
     */
    openChat(username: string, msisdn: string): Promise<any>;
}

export declare const DimeloCordovaPlugin: DimeloCordovaPluginOriginal;