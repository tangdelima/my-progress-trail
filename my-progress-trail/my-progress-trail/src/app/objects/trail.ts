import { Goal } from './goal';

export class Trail {

    private _id: number;
    private _name: string;
    private _status: string;
    private _goals: Goal[];
    private _completed : boolean;

    get id () : number {
        return this._id;
    }

    set id (id : number){
        this._id = id;
    }

    get name () : string {
        return this._name;
    }

    set name (name : string) {
        this._name = name;
    }

    get status() : string{
        return this._status;
    }

    set status(status : string){
        this._status = status;
    }

    get goals() : Goal[]{
        return this._goals;
    }

    addGoal(goal : Goal) : void{
        this._goals.push();
    }
    
    /**
     * Removes a given Goal and returns the removed object.
     * 
     * @param goal : Goal
     * The goal to be removed.
     *  */ 
    removeGoal(goal : Goal) : Goal{
        return this._goals.splice(this._goals.indexOf(goal))[0];
    }

    evaluatesCompletion() : boolean {
        return !this.goals.some((val:Goal)=>{ return val.finishedOn == undefined });
    }
    // TODO: define how trail completion shal be treated.    

}
