import { EventEmitter, Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs/Rx';

import { TrailService } from './trail.service';
import { Trail, Goal } from '../objects';

@Injectable()
export class TrailMemoryService implements TrailService{

  repository : MockedTrailsRepository;
  constructor() {
    this.repository = new MockedTrailsRepository();
  }

  getTrails() : Observable<Trail[]> {
    return Observable.create((observer) => {
      let trails = this.repository.trailsList;
      let response = new TrailRepositoryResponse()
                      .success(true)
                      .values(trails);
      observer.next(response);
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
        let response = new TrailRepositoryResponse()
                        .msg('Trail Added.')
                        .success(true); 
        observer.next(response);
      } catch(e) {
        observer.next(this.errorMessage("Trail Cannot be Added."));
      }
      observer.complete();
    }); 
  }

  deleteTrail(trail : Trail) : Observable<any> {
    return Observable.create((observer:Observer<any>) => {
      try{
        let removed = this.repository.removeTrail(trail);
        let response = new TrailRepositoryResponse()
                        .values([removed])
                        .success(true);
        observer.next(response);
      } catch(e) {
        observer.next(this.errorMessage("Trail Cannot be deleted."));
      }
      observer.complete();
    }); 
  }


  /*
   *** service methods to Goal handling.  **********************
   */

  createGoal(name: string, imgUrl?: string) : Goal { return null;}

  getGoals(trailId : number) : Observable<Goal[]>{ return null; }

  getAllGoals() : Observable<Goal[]>{ return null; }

  saveGoal(goal : Goal) : Observable<string> { return null; }

  deleteGoal(goal : Goal) : Observable<string>{ return null; }

  errorMessage( _msg? : string ){
    return new TrailRepositoryResponse()
            .msg(_msg ? _msg : "Internal Error: Could not execute action.")
            .success(false)
            .toJSON();  
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

  public removeTrail(trail : Trail) : Trail {
    return this._trailsList.splice(this._trailsList.indexOf(trail),1)[0];    
  }
}

class TrailRepositoryResponse{
  constructor(
    public _msg? : string,
    public _values? : any[],
    public _success? : boolean 
  ){}

  public msg(_msg : string){
    this._msg = _msg;
    return this;
  }

  public values(_values : any[]){
    this._values = _values;
    return this;
  }

  public success(_success : boolean){
    this._success = _success;
    return this;
  }

  public toJSON(){
    return JSON.stringify(this);
  }
}
