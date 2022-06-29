import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IClientUpdate, ClientUpdate } from '../client-update.model';
import { ClientUpdateService } from '../service/client-update.service';

import { ClientUpdateRoutingResolveService } from './client-update-routing-resolve.service';

describe('ClientUpdate routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ClientUpdateRoutingResolveService;
  let service: ClientUpdateService;
  let resultClientUpdate: IClientUpdate | undefined;

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
    routingResolveService = TestBed.inject(ClientUpdateRoutingResolveService);
    service = TestBed.inject(ClientUpdateService);
    resultClientUpdate = undefined;
  });

  describe('resolve', () => {
    it('should return IClientUpdate returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClientUpdate = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClientUpdate).toEqual({ id: 123 });
    });

    it('should return new IClientUpdate if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClientUpdate = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultClientUpdate).toEqual(new ClientUpdate());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ClientUpdate })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClientUpdate = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClientUpdate).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
