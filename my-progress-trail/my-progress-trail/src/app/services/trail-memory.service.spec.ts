/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { TrailMemoryService } from './trail-memory.service';
import { Trail, Goal } from './../objects';

describe('TrailMemoryService', () => {

  const DUPLICATED_GOAL_ERROR_MSG = "The goal to be inserted was duplicated.";

  var service;  

  var cleanUpRepository = function(){
    if(service){
      service.getTrails().subscribe(res => {
        let trails = res._values;
        trails.forEach( trail => {
          service.deleteTrail(trail).subscribe();
        });
      });
    }
  };
  var loadTrails = function(){    
    if(service){
      let goal1 = service.createGoal('Goal 1');
      let goal2 = service.createGoal('Goal 2');
      service.saveGoal(goal1).subscribe();
      service.saveGoal(goal2).subscribe();
      (<Trail[]>
        [
          new Trail("Trail Test 1"),
          new Trail("Trail Test 2"),
          new Trail("Trail Test 3"),
          new Trail("Trail with Goals",
                    undefined,
                    "",
                    [ 
                      goal1, goal2 
                    ])
        ]
      ).forEach( trail => {
        service.saveTrail(trail).subscribe();
      } );
    }
  };
  var setup = function(){
    cleanUpRepository();
    loadTrails();
  };

  /**
   * Find any trail in the repository
   * Must be called from an async zone.
   */
  var findAnyTrail = function(){
    let trail;
    service.getTrails().subscribe(res => {
      let trails = res._values;
      trail = trails[0];
    });
    return trail;
  };

  /**
   * Find a trail by its name
   * Must be called from an async zone.
   * @param name the name of the trail to be found.
   */
  var findTrailByName = function(name : string){
    let trail;
    service.getTrails().subscribe(res => {
      let trails = res._values;
      trail = trails.find(value => name == (<Trail>value).name);
    });
    return trail;
  }

  var countAsynchronousList = function(asyngResource, callbackObj){
    let count : number;
    asyngResource.apply(callbackObj).subscribe(res => {
      count = res._values.length;
    });
    return count;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrailMemoryService]
    });
    service = TestBed.get(TrailMemoryService);
  });

  it('should exist.', () => {
    expect(service).toBeTruthy();
  });

  it('should save a trail', async(() => {
    let nTrails = countAsynchronousList(service.getTrails, service);
    service.saveTrail(service.createTrail('test.1')).subscribe(res => console.log(res._msg));
    let nTrailsResult = countAsynchronousList(service.getTrails, service);
    
    expect( nTrailsResult ).toBe( nTrails + 1 );
  }));


  it('should return all saved trails', async(() => {
    setup();
    let trails = [];
    service.getTrails().subscribe( res => {
      if(res.success){
        trails = res._values;
      } else {
        console.error(res._msg);
      }
    });
    expect(trails.length).toBe(4);
  }));
  
  it('should return an expected saved trail', async(() => {
    cleanUpRepository();
    let trail = service.createTrail('Trail Returned Test');
    service.saveTrail(trail).subscribe( res => {
      if (res._success) {
        trail = res._values[0];
      } else {
        console.error(res._msg);
      }
    } );
    let newTrail = null;
    service.getTrail(trail.id).subscribe(res=>{
      if (res._success) {
        newTrail = res._values[0];
      } else {
        console.error(res._msg);
      }
    });
    expect(newTrail.id).toBe(trail.id)
  }));

  it('should edit an expected trail', async(() => {
    setup();
    let trail = findAnyTrail();
    let trailId = trail.id;
    let trailName = trail.name;    
    trail.name = trailName + " edited";

    service.saveTrail(trail).subscribe();

    let newTrail = null;
    service.getTrail(trailId).subscribe(res => {
      newTrail = res._values[0];
    });

    expect(newTrail.id).toEqual(trailId);
    expect(newTrail.name).toEqual(trailName + " edited");
  }));

  it('should remove a given trail', async(() => {
    setup();
    let trail = <Trail>findAnyTrail();
    let countBefore = countAsynchronousList(service.getTrails, service);
    let removedTrail;

    service.deleteTrail(trail).subscribe( res => {
      if (res._success) {
        removedTrail = res._values[0];
      } else {
        console.error(res._msg);
      }
    });
    let countAfter = countAsynchronousList(service.getTrails, service);
    expect(countAfter).toBe(countBefore-1);
    expect(removedTrail).toEqual(trail);
  }));

  it('should create a goal', async(() => {
    let nGoals = countAsynchronousList(service.getAllGoals, service);
    service.saveGoal(service.createGoal('Goal Test 1')).subscribe(res => {
      console.log(res._msg);
    });
    let nGoalsResult = countAsynchronousList(service.getAllGoals, service);
    expect(nGoalsResult).toBe(nGoals+1);
  }));

  it('should attach a goal to a trail', async(() => {
    setup();
    let trail = findAnyTrail();
    let trailId = trail.id;
  
    let nGoalsBefore = (<Goal[]>trail.goals).length;

    service.addGoal(trail, service.createGoal('Goal Test 1')).subscribe();

    service.getTrail(trailId).subscribe( res => {
      trail = res._values[0];
    } );
    let nGoalsAfter = (<Goal[]>trail.goals).length;
    expect(nGoalsAfter).toBe(nGoalsBefore+1);
  }));

  it('should return an error if the user tries to atach a goal previously added.', async(()=>{
    setup();
    let trail = findAnyTrail();
    let trailId = trail.id;

    service.addGoal(trail, service.createGoal('Test Goal 1')).subscribe();
    let nGoalsBefore = (<Goal[]>trail.goals).length;

    let operationSuccess : boolean;
    let errorMessage : string;

    service.addGoal(trail, service.createGoal('Test Goal 1')).subscribe(
      res => {
        operationSuccess = res._success;
      },
      error => {
        operationSuccess = error._success;
        errorMessage = error._msg;
      }
    );

    service.getTrail(trailId).subscribe( res => {
      trail = res._values[0];
    } );    
    let nGoalsAfter = (<Goal[]>trail.goals).length;

    expect(nGoalsAfter).toBe(nGoalsBefore);
    expect(operationSuccess).toBe(false);
    expect(errorMessage).toEqual(DUPLICATED_GOAL_ERROR_MSG);
  }));

  it('should remove a goal from a trail', async(() => {
    setup();
    let trail = findTrailByName("Trail with Goals");
    let goal = trail.goals[0];
    let nGoalsBefore = trail.goals.length;

    let removedGoal : Goal;
    service.removeGoal(trail, goal).subscribe();

    trail = findTrailByName("Trail with Goals");
    let nGoalsAfter = trail.goals.length;
    
    expect(nGoalsAfter).toBe(nGoalsBefore-1);
  }));

  it('goal should not be deleted even if there\'s no trail owning it', async(()=>{
    setup();
    let trail = findTrailByName("Trail with Goals");
    let goal = trail.goals[0];
    let nGoalsBefore = countAsynchronousList(service.getAllGoals, service);

    let removedGoal : Goal;
    service.removeGoal(trail, goal).subscribe();

    trail = findTrailByName("Trail with Goals");
    let nGoalsAfter = countAsynchronousList(service.getAllGoals, service);;
    
    expect(nGoalsAfter).toBe(nGoalsBefore);    
  }));

  it('should delete a goal', () => {
    setup();
    let trail = findTrailByName("Trail with Goals");
    let goal = trail.goals[0];
    let nGoals = countAsynchronousList(service.getAllGoals, service);
    
    let removedGoal;
    service.deleteGoal(goal).subscribe( res => { 
      removedGoal = res._values[0];
    });
    expect(removedGoal).toEqual(goal);

    let nGoalsResult = countAsynchronousList(service.getAllGoals, service);
    expect(nGoalsResult).toBe(nGoals-1);
  })

  it('should finish a goal', () => {
    pending();
  });

  it('should not be possible to edit finished Goals', () => {
    pending();
  });

  it('should complete a trail when all goals finished', () => {
    pending();
  });

  it('should only have completed status when all goals are finished', () => {
    pending();
  });

  it('should only take off trail completed status when one of its goals is marked unfinished', () => {
    pending();
  });

});
