export function removeObjectField(obj:any, f:string){
    const {[f]:propValue, ...rest} = obj;
    return rest;
}