import { Exception } from './exception';

/**
 * Error thrown when there's an attempt to update a goal with finished property no empty.
 */
export class CannotUpdateFinishedError extends Exception{
    constructor(){
        super("Cannot update finished goals.");
    }
}