import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionScrollComponent } from './section-scroll.component';

describe('SectionScrollComponent', () => {
  let component: SectionScrollComponent;
  let fixture: ComponentFixture<SectionScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
