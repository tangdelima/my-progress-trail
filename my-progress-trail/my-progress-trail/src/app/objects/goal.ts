import { CannotUpdateFinishedError } from './exceptions';

export class Goal {

    constructor(
        private _name: string,
        private _id?: number,
        private _status?: string,
        private _imageUrl?: string,
        private _finishedOn?: Date){}

    get id() :  number{
        return this._id;
    }

    /**
     * Sets the id of goal instance when persisted.
     * This method can be edited after the goal is set as finished.
     */
    set id(id : number){
        this._id = id;
    }
    get name() : string {
        return this._name;
    }
    set name(name : string){
        if (!this.canUpdate()) {
            throw new CannotUpdateFinishedError();
        }
        this._name = name;
    }
    get status() : string {
        return this._status;
    }
    set status(status : string){
        if (!this.canUpdate()) {
            throw new CannotUpdateFinishedError();
        }
        this._status = status;
    }
    get imageUrl() : string {
        return this._imageUrl;
    }
    set imageUrl(imageUrl : string) {
        if (!this.canUpdate()) {
            throw new CannotUpdateFinishedError();
        }
        this._imageUrl = imageUrl;
    }
    get finishedOn() : Date {
        return this._finishedOn;
    }
    set finishedOn(finishedOn : Date) {
        this._finishedOn = finishedOn;
    }

    private canUpdate() : boolean {
        return !this._finishedOn;
    }

}
