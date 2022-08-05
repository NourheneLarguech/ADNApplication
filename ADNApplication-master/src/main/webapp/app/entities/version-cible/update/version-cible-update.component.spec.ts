import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VersionCibleService } from '../service/version-cible.service';
import { IVersionCible, VersionCible } from '../version-cible.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { VersionCibleUpdateComponent } from './version-cible-update.component';

describe('VersionCible Management Update Component', () => {
  let comp: VersionCibleUpdateComponent;
  let fixture: ComponentFixture<VersionCibleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let versionCibleService: VersionCibleService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VersionCibleUpdateComponent],
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
      .overrideTemplate(VersionCibleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VersionCibleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    versionCibleService = TestBed.inject(VersionCibleService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const versionCible: IVersionCible = { id: 456 };
      const product: IProduct = { id: 25812 };
      versionCible.product = product;

      const productCollection: IProduct[] = [{ id: 93787 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ versionCible });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const versionCible: IVersionCible = { id: 456 };
      const product: IProduct = { id: 13591 };
      versionCible.product = product;

      activatedRoute.data = of({ versionCible });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(versionCible));
      expect(comp.productsSharedCollection).toContain(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VersionCible>>();
      const versionCible = { id: 123 };
      jest.spyOn(versionCibleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ versionCible });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: versionCible }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(versionCibleService.update).toHaveBeenCalledWith(versionCible);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VersionCible>>();
      const versionCible = new VersionCible();
      jest.spyOn(versionCibleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ versionCible });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: versionCible }));
      saveSubject.complete();

      // THEN
      expect(versionCibleService.create).toHaveBeenCalledWith(versionCible);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<VersionCible>>();
      const versionCible = { id: 123 };
      jest.spyOn(versionCibleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ versionCible });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(versionCibleService.update).toHaveBeenCalledWith(versionCible);
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
