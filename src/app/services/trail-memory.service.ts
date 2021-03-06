import { Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs/Rx';

import { TrailService } from './trail.service';
import { Trail, Goal } from '../objects';
import { DuplicatedGoalInsertedError } from '../objects/exceptions';

@Injectable()
export class TrailMemoryService implements TrailService{

  repository : MemoryTrailsRepository;
  constructor() {
    this.repository = new MemoryTrailsRepository();
  }

  getTrails() : Observable<any> {
    return Observable.create((observer) => {
      let trails = this.repository.trailsList;
      let response = new TrailRepositoryResponse()
                      .success(true)
                      .values(trails);
      observer.next(response);
      observer.complete();
    });
  }  

  getTrail(id : number) : Observable<any> {    
    return Observable.create( observer => {
      let trail = this.repository.findTrail(id);
      let response = new TrailRepositoryResponse()
                        .success(true)
                        .values([trail]);
      observer.next(response);
      observer.complete();
    } );
  }

  createTrail(name : string) : Trail {
    let trail : Trail = new Trail(name);
    return trail;
  }

  saveTrail(trail : Trail) : Observable<any> {
    return Observable.create((observer : Observer<any>) => {
      try{
        if (trail.id) {
          this.repository.updateTrail(trail);
        } else {
          this.repository.insertTrail(trail);
        }
        let response = new TrailRepositoryResponse()
                        .values([trail])
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
        let removed = this.repository.deleteTrail(trail);
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

  createGoal(name: string, imgUrl?: string) : Goal { 
    let goal = new Goal(name);
    if(imgUrl) goal.imageUrl = imgUrl;
    return goal;
  }

  getGoals(trailId : number) : Observable<any>{ 
    return Observable.create(observer => {
      let trail = this.repository.findTrail(trailId);      
      let response = new TrailRepositoryResponse()
                      .success(true)
                      .values(trail.goals);
      observer.next(response);
      observer.complete();
    }); 
  }

  getGoal(id: number) : Observable<any> {
    return Observable.create( observer => {
      let goal = this.repository.findGoal(id);

      let response = new TrailRepositoryResponse()
                      .success(true)
                      .values([goal]);
      observer.next(response);
      observer.complete(); 
    });
  }

  getAllGoals() : Observable<any>{ 
    return Observable.create( observer => {
          let response = new TrailRepositoryResponse()
                    .success(true)
                    .values(this.repository.goalsList);
          observer.next(response);
          observer.complete();
    } ); 
  }

  saveGoal(goal : Goal) : Observable<any> { 
    return Observable.create(observer => {
      if ( goal.id ) {
        this.repository.updateGoal(goal);
      } else {
        this.repository.insertGoal(goal);
      }
      let response = new TrailRepositoryResponse()
                      .msg('Goal created with success')
                      .success(true);
      observer.next(response);
      observer.complete();
    });
   }

   addGoal(trail : Trail, goal : Goal){
     return Observable.create( observer => {
      let all_goals = this.repository.goalsList;
      if (!goal.id) {
        try{
          this.repository.insertGoal(goal);
        } catch(e){
          let response = new TrailRepositoryResponse()
                          .success(false)
                          .msg(e.message);
          observer.error(response);
          observer.complete();
          return;
        }
      }
      trail.addGoal(goal);
      trail.evaluatesCompletion();

      if(!trail.id){
        this.repository.insertTrail(trail);
      } else {
        this.repository.updateTrail(trail);
      }

      let response = new TrailRepositoryResponse()
                      .success(true)
                      .msg('Goal added to trail and persisted.');
      observer.next(response);
      observer.complete();
     } );
   };

   removeGoal(trail : Trail, goal : Goal) {
     return Observable.create(observer => {
      trail.removeGoal(goal);
      this.repository.updateTrail(trail);

      let response = new TrailRepositoryResponse()
                          .success(true)
                          .msg("Goal sucessfully removed!");
      observer.next(response);
      observer.complete();
     });     
   }

  deleteGoal(goal : Goal) : Observable<any>{ 
    return Observable.create( observer => {
      // Find all trails to remove the goal to be deleted from it.
      this.getTrails().subscribe( 
        res => {
          <TrailRepositoryResponse>res._values.forEach(trail => {
            let rmGoal = (<Trail>trail).goals.find(fngoal => {
              return fngoal.id == goal.id;
            });
            if (rmGoal){
              trail.removeGoal(rmGoal);
            }
          });

          let removed = this.repository.deleteGoal(goal);
          let response = new TrailRepositoryResponse()
                          .success(true)
                          .values([removed]);
          observer.next(response);
          observer.complete();
        },
        error => {
          let response = this.errorMessage('Error trying to remove goal.');
          observer.error(response);
          observer.complete();
        }
       );
    } ); 
  }

  finishGoal(goal: Goal, shouldFinish? : boolean) {
    return Observable.create(observer => {
      if (shouldFinish == undefined || shouldFinish == true) {
        goal.finishedOn = new Date();
      } else {
        goal.finishedOn = undefined;
      }
      this.repository.updateGoal(goal);
      let affectedTrails = this.affectedTrails(goal);
      if (affectedTrails && affectedTrails.length > 0) {
        affectedTrails.forEach(trail => {
          trail.evaluatesCompletion();
        });
      }

      let response = new TrailRepositoryResponse()
                      .success(true)
                      .msg('Goal finished successfully on ' + goal.finishedOn);
      observer.next(response);
      observer.complete();
    });
  }

  switchGoalOrder(trail : Trail, a : number, b: number) {
    let aux = trail.goals[a];
    trail.goals[a] = trail.goals[b];
    trail.goals[b] = aux;
  }

  private errorMessage( _msg? : string ){
    return new TrailRepositoryResponse()
            .msg(_msg ? _msg : "Internal Error: Could not execute action.")
            .success(false)
            .toJSON();  
  }

  private affectedTrails( goal : Goal ): Trail[]{
    return this.repository.trailsList.filter(trail => {
      return ( 
        trail.goals.filter( curGoal => {
          return curGoal.id == goal.id;
        }).length > 0
      );
    });
  }
}

class MemoryTrailsRepository{
  constructor(
    private _trailKey : number = 1,
    private _goalKey  : number = 1,
    private _trailsList : Trail[] = [],
    private _goalsList  :  Goal[] = []
  ){}

  public get trailsList() : Trail[] {
    return this._trailsList;
  }

  public insertTrail(trail : Trail){
    trail.id = this._trailKey++;
    this._trailsList.push(trail);
  }

  public deleteTrail(trail : Trail) : Trail {
    return this._trailsList.splice(this._trailsList.indexOf(trail),1)[0];    
  }

  public findTrail(id : number){
    return this._trailsList.find(trail=>{
      return trail.id == id;
    });
  }

  public updateTrail(trail : Trail) : boolean {
    let trail_index = this._trailsList.indexOf(trail);    
    if (trail_index < 0) return false;

    this._trailsList[this._trailsList.indexOf(trail)] = trail;
    return true;
  }

  public get goalsList(){
    return this._goalsList;
  }

  public findGoal(id : number) {
    return this._goalsList.find( goal => {
      return goal.id == id; 
    });
  }

  public insertGoal(goal : Goal){
    if ( this.isGoalDuplicated(goal) ) {
      throw new DuplicatedGoalInsertedError();
    }
    goal.id = this._goalKey++;
    this._goalsList.push(goal);
  }

  public updateGoal(goal : Goal) : boolean {
    let goal_index = this._goalsList.indexOf(goal);    
    if (goal_index < 0) return false;

    this._goalsList[this._goalsList.indexOf(goal)] = goal;
    return true;
  }

  public deleteGoal(goal : Goal) : Goal{
    return this._goalsList.splice(this._goalsList.indexOf(goal),1)[0];
  }

  private isGoalDuplicated(goal : Goal) : boolean {
    return this._goalsList.some( _goal => {
      return goal.name == _goal.name
    } );
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
