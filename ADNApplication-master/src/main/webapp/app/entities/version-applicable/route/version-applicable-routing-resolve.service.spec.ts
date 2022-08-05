import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IVersionApplicable, VersionApplicable } from '../version-applicable.model';
import { VersionApplicableService } from '../service/version-applicable.service';

import { VersionApplicableRoutingResolveService } from './version-applicable-routing-resolve.service';

describe('VersionApplicable routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: VersionApplicableRoutingResolveService;
  let service: VersionApplicableService;
  let resultVersionApplicable: IVersionApplicable | undefined;

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
    routingResolveService = TestBed.inject(VersionApplicableRoutingResolveService);
    service = TestBed.inject(VersionApplicableService);
    resultVersionApplicable = undefined;
  });

  describe('resolve', () => {
    it('should return IVersionApplicable returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVersionApplicable = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultVersionApplicable).toEqual({ id: 123 });
    });

    it('should return new IVersionApplicable if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVersionApplicable = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultVersionApplicable).toEqual(new VersionApplicable());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as VersionApplicable })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultVersionApplicable = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultVersionApplicable).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
