import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClientUpdateDetailComponent } from './client-update-detail.component';

describe('ClientUpdate Management Detail Component', () => {
  let comp: ClientUpdateDetailComponent;
  let fixture: ComponentFixture<ClientUpdateDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientUpdateDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ clientUpdate: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClientUpdateDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClientUpdateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load clientUpdate on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.clientUpdate).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
