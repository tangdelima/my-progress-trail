/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { TrailMemoryService } from './trail-memory.service';
import { Trail, Goal } from './../objects';

describe('TrailMemoryService', () => {

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
      (<Trail[]>
        [
          new Trail("Trail Test 1"),
          new Trail("Trail Test 2"),
          new Trail("Trail Test 3")
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
    expect(trails.length).toBe(3);
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
    let nGoals = countAsynchronousList(service.getGoals, service);
    service.saveGoal(service.createGoal('Goal Test 1')).subscribe(res => {
      console.log(res._msg);
    });
    let nGoalsResult = countAsynchronousList(service.getGoals, service);
    expect(nGoalsResult).toBe(nGoals+1);
  }));

  it('should attach a goal to a trail', async(() => {
    setup();
    let trail = findAnyTrail();
    let trailId = trail.id;
  
    let nGoalsBefore = (<Goal[]>trail.goals).length;

    trail.addGoal(service.createGoal('Test Goal 1'));
    service.saveTrail(trail);

    service.getTrail(trailId).subscribe( res => {
      trail = res._values[0];
    } );
    let nGoalsAfter = (<Goal[]>trail.goals).length;
    expect(nGoalsAfter).toBe(nGoalsBefore+1);
  }));

  it('should return an error if the user tries to atach a goal previously added.', ()=>{
    pending();
  });

  it('should remove a goal froma a trail', () => {
    pending();
  });

  it('should finish a goal', () => {
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
