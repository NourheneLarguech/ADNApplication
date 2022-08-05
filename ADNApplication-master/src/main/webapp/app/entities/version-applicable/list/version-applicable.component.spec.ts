import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VersionApplicableService } from '../service/version-applicable.service';

import { VersionApplicableComponent } from './version-applicable.component';

describe('VersionApplicable Management Component', () => {
  let comp: VersionApplicableComponent;
  let fixture: ComponentFixture<VersionApplicableComponent>;
  let service: VersionApplicableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VersionApplicableComponent],
    })
      .overrideTemplate(VersionApplicableComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VersionApplicableComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VersionApplicableService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.versionApplicables?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
