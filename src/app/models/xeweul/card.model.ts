export interface IXeweulCard {
    id?: string;
    label?: string;
    type?: string;
}

export class XeweulCard implements IXeweulCard {
    constructor(
        public id?: string,
        public label?: string,
        public type?: string
    ) {}
}
