import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClientUpdate, ClientUpdate } from '../client-update.model';

import { ClientUpdateService } from './client-update.service';

describe('ClientUpdate Service', () => {
  let service: ClientUpdateService;
  let httpMock: HttpTestingController;
  let elemDefault: IClientUpdate;
  let expectedResult: IClientUpdate | IClientUpdate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClientUpdateService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ClientUpdate', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ClientUpdate()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClientUpdate', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClientUpdate', () => {
      const patchObject = Object.assign({}, new ClientUpdate());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClientUpdate', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ClientUpdate', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addClientUpdateToCollectionIfMissing', () => {
      it('should add a ClientUpdate to an empty array', () => {
        const clientUpdate: IClientUpdate = { id: 123 };
        expectedResult = service.addClientUpdateToCollectionIfMissing([], clientUpdate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientUpdate);
      });

      it('should not add a ClientUpdate to an array that contains it', () => {
        const clientUpdate: IClientUpdate = { id: 123 };
        const clientUpdateCollection: IClientUpdate[] = [
          {
            ...clientUpdate,
          },
          { id: 456 },
        ];
        expectedResult = service.addClientUpdateToCollectionIfMissing(clientUpdateCollection, clientUpdate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClientUpdate to an array that doesn't contain it", () => {
        const clientUpdate: IClientUpdate = { id: 123 };
        const clientUpdateCollection: IClientUpdate[] = [{ id: 456 }];
        expectedResult = service.addClientUpdateToCollectionIfMissing(clientUpdateCollection, clientUpdate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientUpdate);
      });

      it('should add only unique ClientUpdate to an array', () => {
        const clientUpdateArray: IClientUpdate[] = [{ id: 123 }, { id: 456 }, { id: 89852 }];
        const clientUpdateCollection: IClientUpdate[] = [{ id: 123 }];
        expectedResult = service.addClientUpdateToCollectionIfMissing(clientUpdateCollection, ...clientUpdateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clientUpdate: IClientUpdate = { id: 123 };
        const clientUpdate2: IClientUpdate = { id: 456 };
        expectedResult = service.addClientUpdateToCollectionIfMissing([], clientUpdate, clientUpdate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientUpdate);
        expect(expectedResult).toContain(clientUpdate2);
      });

      it('should accept null and undefined values', () => {
        const clientUpdate: IClientUpdate = { id: 123 };
        expectedResult = service.addClientUpdateToCollectionIfMissing([], null, clientUpdate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientUpdate);
      });

      it('should return initial array if no ClientUpdate is added', () => {
        const clientUpdateCollection: IClientUpdate[] = [{ id: 123 }];
        expectedResult = service.addClientUpdateToCollectionIfMissing(clientUpdateCollection, undefined, null);
        expect(expectedResult).toEqual(clientUpdateCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
