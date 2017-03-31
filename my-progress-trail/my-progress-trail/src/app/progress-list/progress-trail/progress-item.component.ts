import { Component, OnInit, Input, Inject } from '@angular/core';

import { TrailService } from '../../services/trail.service';

@Component({
  selector: 'mpt-progress-item',
  templateUrl: './progress-item.component.html'
})
export class ProgressItemComponent implements OnInit {

  @Input() image : string;

  constructor( @Inject('trail.service') private service : TrailService) { }

  ngOnInit() {

  }

}
