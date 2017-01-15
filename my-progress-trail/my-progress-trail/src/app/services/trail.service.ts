import { Injectable } from '@angular/core';

import { Trail } from '../objects/trail';

@Injectable()
export class TrailService {

  constructor() { }

  getTrails() : Trail[] {
    let trails : Trail[] = [];

    return trails;
  }

  // create a service to manage Goals?
  // Or use this service to goals management
  
}
