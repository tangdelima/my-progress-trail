import { EventEmitter, Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs/Rx';

import { TrailService } from './trail.service';
import { Trail, Goal } from '../objects';

@Injectable()
export class MockedService implements TrailService{

  repository : MockedTrailsRepository;
  constructor() {
    this.repository = new MockedTrailsRepository();
  }

  getTrails() : Observable<Trail[]> {
    return Observable.create((observer) => {
      let trails = this.repository.trailsList;
      observer.next(trails);
      observer.complete();
    });
  }  

  getTrail(id : number) : Observable<Trail> {
    let trail : Trail = null;

    return null;
  }

  createTrail(name : string) : Trail {
    let trail : Trail = new Trail(name);
    return trail;
  }

  saveTrail(trail : Trail) : Observable<any> {
    return Observable.create((observer : Observer<any>) => {
      try{
        this.repository.addTrail(trail);
        observer.next(this.responseMessage("Trail Added.", true));
      } catch(e) {
        observer.next(this.responseMessage("Trail Cannot be Added.", false));
      }
      observer.complete();
    }); 
  }

  deleteTrail(trail : Trail) : Observable<string> { return null;}


  /*
   *** service methods to Goal handling.  **********************
   */

  createGoal(name: string, imgUrl?: string) : Goal { return null;}

  getGoals(trailId : number) : Observable<Goal[]>{ return null; }

  getAllGoals() : Observable<Goal[]>{ return null; }

  saveGoal(goal : Goal) : Observable<string> { return null; }

  deleteGoal(goal : Goal) : Observable<string>{ return null; }

  responseMessage(msg: string, success?: boolean){
    let response : any = {};
    response.msg = msg;
    if(success)response.success;
    return JSON.parse(JSON.stringify(response)); 
  }

}

class MockedTrailsRepository{
  constructor(
    private _key : number = 1,
    private _trailsList : Trail[] = []
  ){}

  public get trailsList() : Trail[] {
    return this._trailsList;
  }

  public addTrail(trail : Trail){
    trail.id = this._key++;
    this._trailsList.push(trail);
  }
}
