import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IVersionCible, VersionCible } from '../version-cible.model';
import { VersionCibleService } from '../service/version-cible.service';

import { VersionCibleRoutingResolveService } from './version-cible-routing-resolve.service';

describe('VersionCible routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: VersionCibleRoutingResolveService;
  let service: VersionCibleService;
  let resultVersionCible: IVersionCible | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(VersionCibleRoutingResolveService);
    service = TestBed.inject(VersionCibleService);
    resultVersionCible = undefined;
  });

  describe('resolve', () => {
    it('should return IVersionCible returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVersionCible = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultVersionCible).toEqual({ id: 123 });
    });

    it('should return new IVersionCible if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVersionCible = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultVersionCible).toEqual(new VersionCible());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as VersionCible })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVersionCible = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultVersionCible).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
