import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { Trail } from '../objects/trail';
import { Goal } from '../objects/goal';

/**
 * Service to manage Trails and Goals.
 */
export interface TrailService {

  /**
   * Get All Trails.
   * 
   * @returns An array containing all trails.
   */
  getTrails() : Observable<any>;

  /**
   * Finds an Trail by id.
   * 
   * @param id The trail id.
   * 
   * @returns The trail specified or null if no trail is found. 
   */
  getTrail(id : number) : Observable<any>;

  /**
   * Creates a new Trail.
   * 
   * @param name The name of the trail is a required parameter for creating a trail.
   * 
   * @return A fresh and new Trail.
   */
  createTrail(name : string) : Trail;

  /**
   * Persists a given Trail. If the trail already exists it will be updated.
   * 
   * @param The trail to be persisted. 
   */
  saveTrail(trail : Trail) : Observable<any>;

  /**
   * Removes a given trail permanently.
   * 
   * @param The trail to be removed.
   */
  deleteTrail(trail : Trail) : Observable<any>;


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
  createGoal(name: string, imgUrl?: string) : Goal;

  /**
   * Gets All goals from a given trail.
   * 
   * @trailId The id of the trail to fetch goals from.
   * 
   * @return An array containing all goals of the given trail. Ordered by the order of execution.
   */
  getGoals(trailId : number) : Observable<any>;

  /**
   * Get a goal by given id.
   * @param id the goal id
   */
  getGoal(id : number) : Observable<any>;

  /**
   * Finds all Goals.
   * 
   * @return An array with all goals in no specified order.
   */
  getAllGoals() : Observable<any>;

  /**
   * Persistis a given Goal, if the goal already exists it will be updated.
   * 
   * @param The goal to be persisted.
   */
  saveGoal(goal : Goal) : Observable<any>;

  /**
   * Inserts a persisted goal to a trail.
   * 
   * @param trail the trail in which the goal shall be inserted.
   * @param goal  the goal to be inserted.
   */
  addGoal(trail : Trail, goal : Goal) : void;

  /**
   * Removes a persisted goal to a trail.
   * 
   * @param trail the trail in which the goal shall be removed.
   * @param goal  the goal to be removed.
   */
  removeGoal(trail : Trail, goal : Goal): void

  /**
   * Removes a given goal permanently. If any trail has this goal attached 
   * it will be automatically removed. Any checks avoiding this behavior should be made
   * by client.
   * 
   * @param the goal to be removed.
   */
  deleteGoal(goal : Goal) : Observable<any>;

  /**
   * This method finishes a goal. When a goal is finished every trail that own this goal
  //  * should be evaluated to be completed or not.
   */
  finishGoal(goal) : void;
}
