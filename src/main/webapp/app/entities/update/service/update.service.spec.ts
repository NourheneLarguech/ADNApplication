import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StatutList } from 'app/entities/enumerations/statut-list.model';
import { IUpdate, Update } from '../update.model';

import { UpdateService } from './update.service';

describe('Update Service', () => {
  let service: UpdateService;
  let httpMock: HttpTestingController;
  let elemDefault: IUpdate;
  let expectedResult: IUpdate | IUpdate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UpdateService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      uidUpdate: 'AAAAAAA',
      versionName: 'AAAAAAA',
      statut: StatutList.SUSPENDED,
      description: 'AAAAAAA',
      comment: 'AAAAAAA',
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

    it('should create a Update', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Update()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Update', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          uidUpdate: 'BBBBBB',
          versionName: 'BBBBBB',
          statut: 'BBBBBB',
          description: 'BBBBBB',
          comment: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Update', () => {
      const patchObject = Object.assign(
        {
          versionName: 'BBBBBB',
        },
        new Update()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Update', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          uidUpdate: 'BBBBBB',
          versionName: 'BBBBBB',
          statut: 'BBBBBB',
          description: 'BBBBBB',
          comment: 'BBBBBB',
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

    it('should delete a Update', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUpdateToCollectionIfMissing', () => {
      it('should add a Update to an empty array', () => {
        const update: IUpdate = { id: 123 };
        expectedResult = service.addUpdateToCollectionIfMissing([], update);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(update);
      });

      it('should not add a Update to an array that contains it', () => {
        const update: IUpdate = { id: 123 };
        const updateCollection: IUpdate[] = [
          {
            ...update,
          },
          { id: 456 },
        ];
        expectedResult = service.addUpdateToCollectionIfMissing(updateCollection, update);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Update to an array that doesn't contain it", () => {
        const update: IUpdate = { id: 123 };
        const updateCollection: IUpdate[] = [{ id: 456 }];
        expectedResult = service.addUpdateToCollectionIfMissing(updateCollection, update);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(update);
      });

      it('should add only unique Update to an array', () => {
        const updateArray: IUpdate[] = [{ id: 123 }, { id: 456 }, { id: 79347 }];
        const updateCollection: IUpdate[] = [{ id: 123 }];
        expectedResult = service.addUpdateToCollectionIfMissing(updateCollection, ...updateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const update: IUpdate = { id: 123 };
        const update2: IUpdate = { id: 456 };
        expectedResult = service.addUpdateToCollectionIfMissing([], update, update2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(update);
        expect(expectedResult).toContain(update2);
      });

      it('should accept null and undefined values', () => {
        const update: IUpdate = { id: 123 };
        expectedResult = service.addUpdateToCollectionIfMissing([], null, update, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(update);
      });

      it('should return initial array if no Update is added', () => {
        const updateCollection: IUpdate[] = [{ id: 123 }];
        expectedResult = service.addUpdateToCollectionIfMissing(updateCollection, undefined, null);
        expect(expectedResult).toEqual(updateCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
