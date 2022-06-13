import { AwesomeCordovaNativePlugin } from '@awesome-cordova-plugins/core';
/**
 * @name Eyes On
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { EyesOn } from '@awesome-cordova-plugins/eyes-on';
 *
 *
 * constructor(private eyesOn: EyesOn) { }
 *
 * ...
 *
 *
 * this.eyesOn.functionName('Hello', 123)
 *   .then((res: any) => console.log(res))
 *   .catch((error: any) => console.error(error));
 *
 * ```
 */
export declare class EyesOnOriginal extends AwesomeCordovaNativePlugin {
    /**
     * This function does something
     * @param arg1 {string} Some param to configure something
     * @param arg2 {number} Another param to configure something
     * @return {Promise<any>} Returns a promise that resolves when something happens
     */
    initAgent(): Promise<any>;
    startAgent(): Promise<any>;
    getDqaId(): Promise<any>;
}

export declare const EyesOn: EyesOnOriginal;