export class Goal {

    constructor(
        private _name: string,
        private _id?: number,
        private _status?: string,
        private _imageUrl?: string,
        private _finishedOn?: Date,
        private _order?: number){}

    get id() :  number{
        return this._id;
    }
    set id(id : number){
        this._id = id;
    }
    get name() : string {
        return this._name;
    }
    set name(name : string){
        this._name = name;
    }
    get status() : string {
        return this._status;
    }
    set status(status : string){
        this._status = status;
    }
    get imageUrl() : string {
        return this._imageUrl;
    }
    set imageUrl(imageUrl : string) {
        this._imageUrl = imageUrl;
    }
    get finishedOn() : Date {
        return this._finishedOn;
    }
    set finishedOn(finishedOn : Date) {
        this._finishedOn = finishedOn;
    }
    get order() : number {
        return this._order;
    }
    set order(order : number) {
        this._order = order;
    }
}
