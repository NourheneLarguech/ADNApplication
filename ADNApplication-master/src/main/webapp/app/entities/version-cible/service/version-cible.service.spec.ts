import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVersionCible, VersionCible } from '../version-cible.model';

import { VersionCibleService } from './version-cible.service';

describe('VersionCible Service', () => {
  let service: VersionCibleService;
  let httpMock: HttpTestingController;
  let elemDefault: IVersionCible;
  let expectedResult: IVersionCible | IVersionCible[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VersionCibleService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      uidVersionCible: 'AAAAAAA',
      nameVersionCible: 'AAAAAAA',
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

    it('should create a VersionCible', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new VersionCible()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VersionCible', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          uidVersionCible: 'BBBBBB',
          nameVersionCible: 'BBBBBB',
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

    it('should partial update a VersionCible', () => {
      const patchObject = Object.assign(
        {
          uidVersionCible: 'BBBBBB',
          nameVersionCible: 'BBBBBB',
          comment: 'BBBBBB',
        },
        new VersionCible()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VersionCible', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          uidVersionCible: 'BBBBBB',
          nameVersionCible: 'BBBBBB',
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

    it('should delete a VersionCible', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVersionCibleToCollectionIfMissing', () => {
      it('should add a VersionCible to an empty array', () => {
        const versionCible: IVersionCible = { id: 123 };
        expectedResult = service.addVersionCibleToCollectionIfMissing([], versionCible);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(versionCible);
      });

      it('should not add a VersionCible to an array that contains it', () => {
        const versionCible: IVersionCible = { id: 123 };
        const versionCibleCollection: IVersionCible[] = [
          {
            ...versionCible,
          },
          { id: 456 },
        ];
        expectedResult = service.addVersionCibleToCollectionIfMissing(versionCibleCollection, versionCible);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VersionCible to an array that doesn't contain it", () => {
        const versionCible: IVersionCible = { id: 123 };
        const versionCibleCollection: IVersionCible[] = [{ id: 456 }];
        expectedResult = service.addVersionCibleToCollectionIfMissing(versionCibleCollection, versionCible);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(versionCible);
      });

      it('should add only unique VersionCible to an array', () => {
        const versionCibleArray: IVersionCible[] = [{ id: 123 }, { id: 456 }, { id: 93252 }];
        const versionCibleCollection: IVersionCible[] = [{ id: 123 }];
        expectedResult = service.addVersionCibleToCollectionIfMissing(versionCibleCollection, ...versionCibleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const versionCible: IVersionCible = { id: 123 };
        const versionCible2: IVersionCible = { id: 456 };
        expectedResult = service.addVersionCibleToCollectionIfMissing([], versionCible, versionCible2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(versionCible);
        expect(expectedResult).toContain(versionCible2);
      });

      it('should accept null and undefined values', () => {
        const versionCible: IVersionCible = { id: 123 };
        expectedResult = service.addVersionCibleToCollectionIfMissing([], null, versionCible, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(versionCible);
      });

      it('should return initial array if no VersionCible is added', () => {
        const versionCibleCollection: IVersionCible[] = [{ id: 123 }];
        expectedResult = service.addVersionCibleToCollectionIfMissing(versionCibleCollection, undefined, null);
        expect(expectedResult).toEqual(versionCibleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
