import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsidebarComponent } from './newsidebar.component';

describe('NewsidebarComponent', () => {
  let component: NewsidebarComponent;
  let fixture: ComponentFixture<NewsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
