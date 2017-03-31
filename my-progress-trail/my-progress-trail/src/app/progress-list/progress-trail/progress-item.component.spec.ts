/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProgressItemComponent } from './progress-item.component';
import { TrailService } from '../../services/trail.service';
import { TrailMemoryService } from '../../services/trail-memory.service';
import { TrailServiceStub } from '../../../stubs/trail.service.stub';

describe('ProgressItemComponent', () => {
  let component: ProgressItemComponent;
  let fixture: ComponentFixture<ProgressItemComponent>;
  let debug : DebugElement;
  let service : TrailService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressItemComponent ],
      providers: [ { provide: 'trail.service', useValue: TrailServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressItemComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;
    service = TestBed.get('trail.service');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('service available', async(() => {
    expect(service).toBeTruthy();
    let goals;
    service.getAllGoals().subscribe( res => {
      goals = res;
    });
    expect(goals.length).toBe(0);
  }));

  it('should have a defined image loaded.', () => {    
    let element : HTMLElement = debug.query(By.css(".item-image")).nativeElement;
    component.image = "/tests/image.jpg";

    fixture.detectChanges();

    expect(element).toBeTruthy();
  })
  
  it('should have a default image loaded.', () => { pending(); })

  it('should display the item\'s name under it.', () => { pending(); })

  it('should show a tooltip with a done button on mouse over.', () => { pending(); })

  it('should show a dialog to confirm item completion.', () => { pending(); })

  it('should update item when completion is confirmed.', () => { pending(); })

  it('should show a tooltip with the date the item was completed.', () => { pending(); })

  it('should have a proper style class on itens not marked as done', () => { pending(); })

  it('should have a proper style class on itens marked as done', () => { pending(); })
});
