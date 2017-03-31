import { Observable } from 'rxjs/Rx';

export let TrailServiceStub = {
    getAllGoals(){
        return Observable.of([]);
    }
}