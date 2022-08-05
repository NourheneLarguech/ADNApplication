import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VersionApplicableDetailComponent } from './version-applicable-detail.component';

describe('VersionApplicable Management Detail Component', () => {
  let comp: VersionApplicableDetailComponent;
  let fixture: ComponentFixture<VersionApplicableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VersionApplicableDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ versionApplicable: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VersionApplicableDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VersionApplicableDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load versionApplicable on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.versionApplicable).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
