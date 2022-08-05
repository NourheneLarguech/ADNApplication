import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVersionApplicable, VersionApplicable } from '../version-applicable.model';

import { VersionApplicableService } from './version-applicable.service';

describe('VersionApplicable Service', () => {
  let service: VersionApplicableService;
  let httpMock: HttpTestingController;
  let elemDefault: IVersionApplicable;
  let expectedResult: IVersionApplicable | IVersionApplicable[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VersionApplicableService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      uidVersionApplicable: 'AAAAAAA',
      nameVersionApplicable: 'AAAAAAA',
      comment: 'AAAAAAA',
      description: 'AAAAAAA',
      createDate: 'AAAAAAA',
      modifyBy: 'AAAAAAA',
      modifidDate: 'AAAAAAA',
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

    it('should create a VersionApplicable', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new VersionApplicable()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VersionApplicable', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          uidVersionApplicable: 'BBBBBB',
          nameVersionApplicable: 'BBBBBB',
          comment: 'BBBBBB',
          description: 'BBBBBB',
          createDate: 'BBBBBB',
          modifyBy: 'BBBBBB',
          modifidDate: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VersionApplicable', () => {
      const patchObject = Object.assign(
        {
          uidVersionApplicable: 'BBBBBB',
          description: 'BBBBBB',
          createDate: 'BBBBBB',
        },
        new VersionApplicable()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VersionApplicable', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          uidVersionApplicable: 'BBBBBB',
          nameVersionApplicable: 'BBBBBB',
          comment: 'BBBBBB',
          description: 'BBBBBB',
          createDate: 'BBBBBB',
          modifyBy: 'BBBBBB',
          modifidDate: 'BBBBBB',
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

    it('should delete a VersionApplicable', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVersionApplicableToCollectionIfMissing', () => {
      it('should add a VersionApplicable to an empty array', () => {
        const versionApplicable: IVersionApplicable = { id: 123 };
        expectedResult = service.addVersionApplicableToCollectionIfMissing([], versionApplicable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(versionApplicable);
      });

      it('should not add a VersionApplicable to an array that contains it', () => {
        const versionApplicable: IVersionApplicable = { id: 123 };
        const versionApplicableCollection: IVersionApplicable[] = [
          {
            ...versionApplicable,
          },
          { id: 456 },
        ];
        expectedResult = service.addVersionApplicableToCollectionIfMissing(versionApplicableCollection, versionApplicable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VersionApplicable to an array that doesn't contain it", () => {
        const versionApplicable: IVersionApplicable = { id: 123 };
        const versionApplicableCollection: IVersionApplicable[] = [{ id: 456 }];
        expectedResult = service.addVersionApplicableToCollectionIfMissing(versionApplicableCollection, versionApplicable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(versionApplicable);
      });

      it('should add only unique VersionApplicable to an array', () => {
        const versionApplicableArray: IVersionApplicable[] = [{ id: 123 }, { id: 456 }, { id: 56770 }];
        const versionApplicableCollection: IVersionApplicable[] = [{ id: 123 }];
        expectedResult = service.addVersionApplicableToCollectionIfMissing(versionApplicableCollection, ...versionApplicableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const versionApplicable: IVersionApplicable = { id: 123 };
        const versionApplicable2: IVersionApplicable = { id: 456 };
        expectedResult = service.addVersionApplicableToCollectionIfMissing([], versionApplicable, versionApplicable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(versionApplicable);
        expect(expectedResult).toContain(versionApplicable2);
      });

      it('should accept null and undefined values', () => {
        const versionApplicable: IVersionApplicable = { id: 123 };
        expectedResult = service.addVersionApplicableToCollectionIfMissing([], null, versionApplicable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(versionApplicable);
      });

      it('should return initial array if no VersionApplicable is added', () => {
        const versionApplicableCollection: IVersionApplicable[] = [{ id: 123 }];
        expectedResult = service.addVersionApplicableToCollectionIfMissing(versionApplicableCollection, undefined, null);
        expect(expectedResult).toEqual(versionApplicableCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
