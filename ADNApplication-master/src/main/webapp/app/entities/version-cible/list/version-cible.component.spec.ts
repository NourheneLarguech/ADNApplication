import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VersionCibleService } from '../service/version-cible.service';

import { VersionCibleComponent } from './version-cible.component';

describe('VersionCible Management Component', () => {
  let comp: VersionCibleComponent;
  let fixture: ComponentFixture<VersionCibleComponent>;
  let service: VersionCibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VersionCibleComponent],
    })
      .overrideTemplate(VersionCibleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VersionCibleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VersionCibleService);

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
    expect(comp.versionCibles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
