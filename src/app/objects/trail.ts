import { Goal } from './goal';

export class Trail {

    private _completed : boolean = false;
    private _goals : Goal[] = [];

    constructor(
        private _name: string,
        private _id?: number,
        private _status?: string,
        _goals?: Goal[]
    ){
        if (_goals) {
            this._goals = _goals;
            this.evaluatesCompletion();
        }
    }

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
        this._goals.push(goal);
    }

    get completed() : boolean {
        return this._completed;
    }
    
    /**
     * Removes a given Goal and returns the removed object.
     * 
     * @param goal : Goal
     * The goal to be removed.
     *  */ 
    removeGoal(goal : Goal) : Goal{
        return this._goals.splice(this._goals.indexOf(goal),1)[0];
    }

    /**
     * This method evaluates if the Trail instance can be considered completed by evaluating all it's goals
     * finishedOn property. Also this method will set the completed attribute to the correct state.
     * 
     * @return true if all goals are finished, or false otherwise. 
     */
    evaluatesCompletion() : boolean {
        this._completed = !this.goals.some((val:Goal)=>{ return val.finishedOn == undefined });
        return this._completed;
    }    

}
