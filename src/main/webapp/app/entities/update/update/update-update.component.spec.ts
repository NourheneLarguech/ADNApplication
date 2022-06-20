import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UpdateService } from '../service/update.service';
import { IUpdate, Update } from '../update.model';
import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { VersionApplicableService } from 'app/entities/version-applicable/service/version-applicable.service';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { VersionCibleService } from 'app/entities/version-cible/service/version-cible.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { UpdateUpdateComponent } from './update-update.component';

describe('Update Management Update Component', () => {
  let comp: UpdateUpdateComponent;
  let fixture: ComponentFixture<UpdateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let updateService: UpdateService;
  let versionApplicableService: VersionApplicableService;
  let versionCibleService: VersionCibleService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UpdateUpdateComponent],
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
      .overrideTemplate(UpdateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UpdateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    updateService = TestBed.inject(UpdateService);
    versionApplicableService = TestBed.inject(VersionApplicableService);
    versionCibleService = TestBed.inject(VersionCibleService);
    productService = TestBed.inject(ProductService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call VersionApplicable query and add missing value', () => {
      const update: IUpdate = { id: 456 };
      const versionApplicable: IVersionApplicable = { id: 19107 };
      update.versionApplicable = versionApplicable;

      const versionApplicableCollection: IVersionApplicable[] = [{ id: 25783 }];
      jest.spyOn(versionApplicableService, 'query').mockReturnValue(of(new HttpResponse({ body: versionApplicableCollection })));
      const additionalVersionApplicables = [versionApplicable];
      const expectedCollection: IVersionApplicable[] = [...additionalVersionApplicables, ...versionApplicableCollection];
      jest.spyOn(versionApplicableService, 'addVersionApplicableToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ update });
      comp.ngOnInit();

      expect(versionApplicableService.query).toHaveBeenCalled();
      expect(versionApplicableService.addVersionApplicableToCollectionIfMissing).toHaveBeenCalledWith(
        versionApplicableCollection,
        ...additionalVersionApplicables
      );
      expect(comp.versionApplicablesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VersionCible query and add missing value', () => {
      const update: IUpdate = { id: 456 };
      const versionCible: IVersionCible = { id: 5613 };
      update.versionCible = versionCible;

      const versionCibleCollection: IVersionCible[] = [{ id: 75610 }];
      jest.spyOn(versionCibleService, 'query').mockReturnValue(of(new HttpResponse({ body: versionCibleCollection })));
      const additionalVersionCibles = [versionCible];
      const expectedCollection: IVersionCible[] = [...additionalVersionCibles, ...versionCibleCollection];
      jest.spyOn(versionCibleService, 'addVersionCibleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ update });
      comp.ngOnInit();

      expect(versionCibleService.query).toHaveBeenCalled();
      expect(versionCibleService.addVersionCibleToCollectionIfMissing).toHaveBeenCalledWith(
        versionCibleCollection,
        ...additionalVersionCibles
      );
      expect(comp.versionCiblesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Product query and add missing value', () => {
      const update: IUpdate = { id: 456 };
      const product: IProduct = { id: 54970 };
      update.product = product;

      const productCollection: IProduct[] = [{ id: 58793 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ update });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const update: IUpdate = { id: 456 };
      const versionApplicable: IVersionApplicable = { id: 29432 };
      update.versionApplicable = versionApplicable;
      const versionCible: IVersionCible = { id: 53165 };
      update.versionCible = versionCible;
      const product: IProduct = { id: 70192 };
      update.product = product;

      activatedRoute.data = of({ update });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(update));
      expect(comp.versionApplicablesSharedCollection).toContain(versionApplicable);
      expect(comp.versionCiblesSharedCollection).toContain(versionCible);
      expect(comp.productsSharedCollection).toContain(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Update>>();
      const update = { id: 123 };
      jest.spyOn(updateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ update });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: update }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(updateService.update).toHaveBeenCalledWith(update);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Update>>();
      const update = new Update();
      jest.spyOn(updateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ update });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: update }));
      saveSubject.complete();

      // THEN
      expect(updateService.create).toHaveBeenCalledWith(update);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Update>>();
      const update = { id: 123 };
      jest.spyOn(updateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ update });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(updateService.update).toHaveBeenCalledWith(update);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackVersionApplicableById', () => {
      it('Should return tracked VersionApplicable primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVersionApplicableById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackVersionCibleById', () => {
      it('Should return tracked VersionCible primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVersionCibleById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
