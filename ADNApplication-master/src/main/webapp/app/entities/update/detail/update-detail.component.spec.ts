import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UpdateDetailComponent } from './update-detail.component';

describe('Update Management Detail Component', () => {
  let comp: UpdateDetailComponent;
  let fixture: ComponentFixture<UpdateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ update: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UpdateDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UpdateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load update on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.update).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
