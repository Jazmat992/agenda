import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketListCreateComponent } from './bucket-list-create.component';

describe('BucketListCreateComponent', () => {
  let component: BucketListCreateComponent;
  let fixture: ComponentFixture<BucketListCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BucketListCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BucketListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
