import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VersionApplicableService } from '../service/version-applicable.service';
import { IVersionApplicable, VersionApplicable } from '../version-applicable.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { VersionApplicableUpdateComponent } from './version-applicable-update.component';

describe('VersionApplicable Management Update Component', () => {
  let comp: VersionApplicableUpdateComponent;
  let fixture: ComponentFixture<VersionApplicableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let versionApplicableService: VersionApplicableService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VersionApplicableUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VersionApplicableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VersionApplicableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    versionApplicableService = TestBed.inject(VersionApplicableService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const versionApplicable: IVersionApplicable = { id: 456 };
      const product: IProduct = { id: 29052 };
      versionApplicable.product = product;

      const productCollection: IProduct[] = [{ id: 812 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ versionApplicable });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const versionApplicable: IVersionApplicable = { id: 456 };
      const product: IProduct = { id: 35916 };
      versionApplicable.product = product;

      activatedRoute.data = of({ versionApplicable });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(versionApplicable));
      expect(comp.productsSharedCollection).toContain(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VersionApplicable>>();
      const versionApplicable = { id: 123 };
      jest.spyOn(versionApplicableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ versionApplicable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: versionApplicable }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(versionApplicableService.update).toHaveBeenCalledWith(versionApplicable);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VersionApplicable>>();
      const versionApplicable = new VersionApplicable();
      jest.spyOn(versionApplicableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ versionApplicable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: versionApplicable }));
      saveSubject.complete();

      // THEN
      expect(versionApplicableService.create).toHaveBeenCalledWith(versionApplicable);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VersionApplicable>>();
      const versionApplicable = { id: 123 };
      jest.spyOn(versionApplicableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ versionApplicable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(versionApplicableService.update).toHaveBeenCalledWith(versionApplicable);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
