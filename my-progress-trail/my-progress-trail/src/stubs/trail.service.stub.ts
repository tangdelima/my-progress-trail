import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class TrailServiceStub {
    constructor(){}

    getAllGoals(){
        return Observable.of([]);
    }
}