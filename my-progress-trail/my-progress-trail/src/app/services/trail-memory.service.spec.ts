/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { TrailMemoryService } from './trail-memory.service';
import { Trail } from './../objects';

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

  /**
   * Count how many trails are in the repository.
   * Must be called from an async zone.
   */
  var countTrails = function(){
    let count : number;
    service.getTrails().subscribe(res => {
      count = res._values.length;
    }, error => {}, () => {});
    return count;    
  }

  /**
   * Count how many goals are in the repository.
   * Must be called from an async zone.
   */
  var countGoals = function(){
    let count : number;
    service.getGoals().subscribe(res => {
      count = res._values.length;
    }, error => {}, () => {});
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
    let nTrails = countTrails();
    service.saveTrail(service.createTrail('test.1')).subscribe(res => console.log(res._msg));
    let nTrailsResult = countTrails();
    
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
    let countBefore = countTrails();
    let removedTrail;

    service.deleteTrail(trail).subscribe( res => {
      if (res._success) {
        removedTrail = res._values[0];
      } else {
        console.error(res._msg);
      }
    });
    let countAfter = countTrails();
    expect(countAfter).toBe(countBefore-1);
    expect(removedTrail).toEqual(trail);
  }));

  it('should create a goal', async(() => {
    let nGoals = countGoals();
    service.saveGoal(service.createGoal('Goal Test 1')).subscribe(res => {
      console.log(res._msg);
    });
    let nGoalsResult = countGoals();
    expect(nGoalsResult).toBe(nGoals+1);
  }));

  it('should attach a goal to a trail', () => {
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
