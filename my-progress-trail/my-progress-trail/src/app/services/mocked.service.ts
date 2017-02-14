import { Injectable } from '@angular/core';

import { TrailService } from './trail.service';
import { Trail, Goal } from '../objects';

@Injectable()
export class MockedService implements TrailService{

  repository : MockedTrailsRepository;
  constructor() {
    this.repository = new MockedTrailsRepository();
  }



}

class MockedTrailsRepository{
  constructor(){}
}
