export interface IXeweulBalance {
    amount?: string;
    lastUpdatedAt?: string;
    unit?: string;
}

export class XeweulBalance implements IXeweulBalance {
    constructor(
        public amount?: string,
        public lastUpdatedAt?: string,
        public unit?: string
    ) {}
}
