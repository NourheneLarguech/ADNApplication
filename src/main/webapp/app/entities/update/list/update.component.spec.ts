import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UpdateService } from '../service/update.service';

import { UpdateComponent } from './update.component';

describe('Update Management Component', () => {
  let comp: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>;
  let service: UpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UpdateComponent],
    })
      .overrideTemplate(UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UpdateComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UpdateService);

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
    expect(comp.updates?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
