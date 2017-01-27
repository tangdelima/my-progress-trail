import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { Trail } from '../objects/trail';
import { Goal } from '../objects/goal';

@Injectable()
export class TrailService {

  constructor() { }

  /**
   * Get All Trails.
   * 
   * @returns An array containing all trails.
   */
  getTrails() : Trail[] {
    let trails : Trail[] = [];

    return trails;
  }  

  /**
   * Finds an Trail by id.
   * 
   * @param id The trail id.
   * 
   * @returns The trail specified or null if no trail is found. 
   */
  getTrail(id : number) : Trail {
    let trail : Trail = null;

    return trail;
  }

  /**
   * Creates a new Trail.
   * 
   * @param name The name of the trail is a required parameter for creating a trail.
   * 
   * @return A fresh and new Trail.
   */
  createTrail(name : string) : Trail {
    let trail : Trail = new Trail();
    trail.name = name;
    return trail;
  }

  /**
   * Persists a given Trail. If the trail already exists it will be updated.
   * 
   * @param The trail to be persisted. 
   */
  saveTrail(trail : Trail) : Observable<string> { return null;}

  /**
   * Removes a given trail permanently.
   * 
   * @param The trail to be removed.
   */
  deleteTrail(trail : Trail) : Observable<string> { return null;}


  /*
   *** service methods to Goal handling.  **********************
   */

  /**
   * Creates a new Goal.
   * 
   * @param name The name of the goal.
   * @param imgUrl The url for the image used to display the goal. (optional)
   * 
   * @return A new and fresh Goal.
   */
  createGoal(name: string, imgUrl?: string) : Goal { return null;}

  /**
   * Gets All goals from a given trail.
   * 
   * @trailId The id of the trail to fetch goals from.
   * 
   * @return An array containing all goals of the given trail. Ordered by the order of execution.
   */
  getGoals(trailId : number) : Goal[]{ return null; }

  /**
   * Finds all Goals.
   * 
   * @return An array with all goals in no specified order.
   */
  getAllGoals() : Goal[]{ return null; }

  /**
   * Persistis a given Goal, if the goal already exists it will be updated.
   * 
   * @param The goal to be persisted.
   */
  saveGoal(goal : Goal) : Observable<string> { return null; }

  /**
   * Removes a given goal permanently.
   * 
   * @param the goal to be removed.
   */
  deleteGoal(goal : Goal) : Observable<string>{ return null; }
}
