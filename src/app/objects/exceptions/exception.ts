/**
 * The Javascript Error cannot be directly extended.
 * So we need to implement it in a wrapper Typescript class.
 * And it's a good opportunity to call it Exception again.
 */
export class Exception implements Error{
    public name    : string;    
    constructor(public message : string){};
}