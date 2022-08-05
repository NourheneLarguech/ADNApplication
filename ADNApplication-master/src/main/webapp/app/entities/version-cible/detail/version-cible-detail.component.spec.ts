import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VersionCibleDetailComponent } from './version-cible-detail.component';

describe('VersionCible Management Detail Component', () => {
  let comp: VersionCibleDetailComponent;
  let fixture: ComponentFixture<VersionCibleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VersionCibleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ versionCible: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VersionCibleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VersionCibleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load versionCible on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.versionCible).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
