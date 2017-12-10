import { Exception } from './exception';

/**
 * Error thrown when there's an attempt to persist a goal with the same name.
 */
export class DuplicatedGoalInsertedError extends Exception{
    constructor(){
        super("The goal to be inserted was duplicated.");
    }
}