/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { TrailMemoryService } from './trail-memory.service';
import { Trail, Goal } from './../objects';

describe('TrailMemoryService', () => {

  const DUPLICATED_GOAL_ERROR_MSG = "The goal to be inserted was duplicated.";
  const CANNOT_EDIT_FINISHED_GOAL = "Cannot update finished goals.";

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

  /**
   * Find a goal by its name
   * Must be called from an async zone.
   * @param name the name of the goal to be found.
   */
  var findGoalByName = function(name : string){
    let goal;
    service.getAllGoals().subscribe(res => {
      let goals = res._values;
      goal = goals.find(value => name == (<Goal>value).name);
    });
    return goal;
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

  it('should edit a goal', async(() => {
    let goal = service.createGoal('Goal');
    service.saveGoal(goal).subscribe();
    
    let editedName = goal.name + ' edited'; 
    goal.name = editedName;
    service.saveGoal(goal).subscribe();

    let goalFromService : Goal;
    service.getGoal(goal.id).subscribe( res => {
      goalFromService = res._values[0];
    } );

    expect(goalFromService.name).toEqual(editedName);
  }));

  it('should update shared goals from other trails when a single goal has been updated.', async(() => {
    cleanUpRepository();
    let goal = service.createGoal('Goal');
    let trail1 = service.createTrail('Trail 1');
    let trail2 = service.createTrail('Trail 2');    
    
    service.addGoal(trail1, goal).subscribe();
    service.addGoal(trail2, goal).subscribe();

    let persistedTrail1 : Trail;
    let persistedTrail2 : Trail;

    service.getTrail(trail1.id).subscribe( res => {
      persistedTrail1 = res._values[0]; 
    });
    
    let editedName = goal.name + ' edited';
    persistedTrail1.goals[0].name = editedName; 
    service.saveTrail(persistedTrail1).subscribe();
    service.getTrail(trail2.id).subscribe( res => {
      persistedTrail2 = res._values[0];
    });

    expect(persistedTrail1).not.toBe(persistedTrail2);
    expect(persistedTrail2.goals[0].name).toEqual(persistedTrail1.goals[0].name);
    expect(persistedTrail1.goals[0].name).toEqual(editedName);    
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

  it('should finish a goal', async(() => {
    let goal = service.createGoal('Finished Goal');
    service.saveGoal(goal).subscribe();
    
    service.finishGoal(goal).subscribe(
      res => {
        console.log(res._msg);
      }
    );

    let finishedGoal : Goal;
    service.getGoal(goal.id).subscribe(
      res => {
        finishedGoal = res._values[0];
      }
    );

    expect(goal.finishedOn).not.toBeUndefined();
    expect(finishedGoal.finishedOn).not.toBeUndefined();
  }));

  it('should not be possible to edit finished Goals', async(() => {
    cleanUpRepository();
    let nameBeforeFinish = 'Goal';
    let goal = service.createGoal(nameBeforeFinish);
    service.saveGoal(goal).subscribe();
    
    service.finishGoal(goal).subscribe(
      res => {
        console.log(res._msg);
      }
    );

    let errorMsg : string;
    try {
      goal.name = "try to edit Goal"
    } catch(error){
      errorMsg = error.message;
    }

    expect(errorMsg).not.toBeUndefined();
    expect(errorMsg).toEqual(CANNOT_EDIT_FINISHED_GOAL);
    expect(goal.name).toEqual(nameBeforeFinish);
  }));

  it('should complete a trail when all goals finished', async(() => {
    cleanUpRepository();
    let trail : Trail = service.createTrail('Trail');
    let goal1 = service.createGoal('Goal 1');
    let goal2 = service.createGoal('Goal 2');

    service.addGoal(trail, goal1).subscribe();
    service.addGoal(trail, goal2).subscribe();

    expect(trail.completed).toBeFalsy();

    service.finishGoal(goal1).subscribe();
    expect(trail.completed).toBeFalsy();

    service.finishGoal(goal2).subscribe();
    expect(trail.completed).toBeTruthy();
  }));

  it('should only take off trail completed status when one of its goals is marked unfinished', async(() => {
    cleanUpRepository();
    let trail : Trail = service.createTrail('Trail');
    let goal1 = service.createGoal('Goal 1');
    let goal2 = service.createGoal('Goal 2');

    service.addGoal(trail, goal1).subscribe();
    service.addGoal(trail, goal2).subscribe();
    service.finishGoal(goal1).subscribe();
    service.finishGoal(goal2).subscribe();

    service.finishGoal(goal2).subscribe();
    expect(trail.completed).toBeTruthy();
    service.finishGoal(goal2, false).subscribe();
    expect(trail.completed).toBeFalsy();
  }));

  it('trail should lose completed status when an unfinised goal is added', async(() => {
    cleanUpRepository();
    let trail : Trail = service.createTrail('Trail');
    let goal1 = service.createGoal('Goal 1');
    service.addGoal(trail, goal1).subscribe();

    expect(trail.completed).toBeFalsy();

    service.finishGoal(goal1).subscribe();
    expect(trail.completed).toBeTruthy();

    let goal2 = service.createGoal('Goal 2');    
    service.addGoal(trail, goal2).subscribe();
    expect(trail.completed).toBeFalsy();
  }));

  it('goals should be fetched from a trail in a defined order (insertion order)', async(() => {
    cleanUpRepository();
    let trail = service.createTrail('Trail');
    let goal1 = service.createGoal('Goal 1');
    let goal2 = service.createGoal('Goal 2');
    let goal3 = service.createGoal('Goal 3');

    service.addGoal(trail, goal1).subscribe();
    service.addGoal(trail, goal2).subscribe();
    service.addGoal(trail, goal3).subscribe();

    let trailTest1 = findTrailByName('Trail');
    expect(trailTest1.goals[0]).toBe(goal1);
    expect(trailTest1.goals[1]).toBe(goal2);
    expect(trailTest1.goals[2]).toBe(goal3);

    let trailTest2 = findTrailByName('Trail');
    expect(trailTest2.goals[0]).toBe(goal1);
    expect(trailTest2.goals[1]).toBe(goal2);
    expect(trailTest2.goals[2]).toBe(goal3);
  }));

  it('goals should be fetched from different trails in an order defined by each trail', async(() => {
    cleanUpRepository();
    let trail1 = service.createTrail('Trail 1');
    let trail2 = service.createTrail('Trail 2');
    let goal1 = service.createGoal('Goal 1');
    let goal2 = service.createGoal('Goal 2');
    let goal3 = service.createGoal('Goal 3');

    service.addGoal(trail1, goal1).subscribe();
    service.addGoal(trail1, goal2).subscribe();
    service.addGoal(trail1, goal3).subscribe();

    service.addGoal(trail2, goal3).subscribe();
    service.addGoal(trail2, goal2).subscribe();
    service.addGoal(trail2, goal1).subscribe();

    let trailTest1 = findTrailByName('Trail 1');
    expect(trailTest1.goals[0]).toBe(goal1);
    expect(trailTest1.goals[1]).toBe(goal2);
    expect(trailTest1.goals[2]).toBe(goal3);

    let trailTest2 = findTrailByName('Trail 2');
    expect(trailTest2.goals[0]).toBe(goal3);
    expect(trailTest2.goals[1]).toBe(goal2);
    expect(trailTest2.goals[2]).toBe(goal1);
  }));

  it('the goals defined order should be changeable', async(() => {
    cleanUpRepository();
    let trail = service.createTrail('Trail');
    let goal1 = service.createGoal('Goal 1');
    let goal2 = service.createGoal('Goal 2');
    let goal3 = service.createGoal('Goal 3');

    service.addGoal(trail, goal1).subscribe();
    service.addGoal(trail, goal2).subscribe();
    service.addGoal(trail, goal3).subscribe();

    let trailTest1 = findTrailByName('Trail');
    expect(trailTest1.goals[0]).toBe(goal1);
    expect(trailTest1.goals[1]).toBe(goal2);
    expect(trailTest1.goals[2]).toBe(goal3);

    service.switchGoalOrder(trail, 0, 1);
    service.saveTrail(trail).subscribe();

    let trailTest2 = findTrailByName('Trail');
    expect(trailTest2.goals[0]).toBe(goal2);
    expect(trailTest2.goals[1]).toBe(goal1);
    expect(trailTest2.goals[2]).toBe(goal3);
  }));

});
