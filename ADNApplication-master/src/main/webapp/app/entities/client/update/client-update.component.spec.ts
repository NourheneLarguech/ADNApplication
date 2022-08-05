import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClientService } from '../service/client.service';
import { IClient, Client } from '../client.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IVersionApplicable } from 'app/entities/version-applicable/version-applicable.model';
import { VersionApplicableService } from 'app/entities/version-applicable/service/version-applicable.service';
import { IVersionCible } from 'app/entities/version-cible/version-cible.model';
import { VersionCibleService } from 'app/entities/version-cible/service/version-cible.service';

import { ClientUpdateComponent } from './client-update.component';

describe('Client Management Update Component', () => {
  let comp: ClientUpdateComponent;
  let fixture: ComponentFixture<ClientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientService: ClientService;
  let productService: ProductService;
  let versionApplicableService: VersionApplicableService;
  let versionCibleService: VersionCibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClientUpdateComponent],
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
      .overrideTemplate(ClientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientService = TestBed.inject(ClientService);
    productService = TestBed.inject(ProductService);
    versionApplicableService = TestBed.inject(VersionApplicableService);
    versionCibleService = TestBed.inject(VersionCibleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const client: IClient = { id: 456 };
      const client_product: IProduct = { id: 20029 };
      client.client_product = client_product;

      const productCollection: IProduct[] = [{ id: 16712 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [client_product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ client });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VersionApplicable query and add missing value', () => {
      const client: IClient = { id: 456 };
      const versionApplicable: IVersionApplicable = { id: 1728 };
      client.versionApplicable = versionApplicable;

      const versionApplicableCollection: IVersionApplicable[] = [{ id: 15466 }];
      jest.spyOn(versionApplicableService, 'query').mockReturnValue(of(new HttpResponse({ body: versionApplicableCollection })));
      const additionalVersionApplicables = [versionApplicable];
      const expectedCollection: IVersionApplicable[] = [...additionalVersionApplicables, ...versionApplicableCollection];
      jest.spyOn(versionApplicableService, 'addVersionApplicableToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ client });
      comp.ngOnInit();

      expect(versionApplicableService.query).toHaveBeenCalled();
      expect(versionApplicableService.addVersionApplicableToCollectionIfMissing).toHaveBeenCalledWith(
        versionApplicableCollection,
        ...additionalVersionApplicables
      );
      expect(comp.versionApplicablesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call VersionCible query and add missing value', () => {
      const client: IClient = { id: 456 };
      const versionCible: IVersionCible = { id: 46843 };
      client.versionCible = versionCible;

      const versionCibleCollection: IVersionCible[] = [{ id: 79044 }];
      jest.spyOn(versionCibleService, 'query').mockReturnValue(of(new HttpResponse({ body: versionCibleCollection })));
      const additionalVersionCibles = [versionCible];
      const expectedCollection: IVersionCible[] = [...additionalVersionCibles, ...versionCibleCollection];
      jest.spyOn(versionCibleService, 'addVersionCibleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ client });
      comp.ngOnInit();

      expect(versionCibleService.query).toHaveBeenCalled();
      expect(versionCibleService.addVersionCibleToCollectionIfMissing).toHaveBeenCalledWith(
        versionCibleCollection,
        ...additionalVersionCibles
      );
      expect(comp.versionCiblesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const client: IClient = { id: 456 };
      const client_product: IProduct = { id: 55691 };
      client.client_product = client_product;
      const versionApplicable: IVersionApplicable = { id: 51604 };
      client.versionApplicable = versionApplicable;
      const versionCible: IVersionCible = { id: 39461 };
      client.versionCible = versionCible;

      activatedRoute.data = of({ client });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(client));
      expect(comp.productsSharedCollection).toContain(client_product);
      expect(comp.versionApplicablesSharedCollection).toContain(versionApplicable);
      expect(comp.versionCiblesSharedCollection).toContain(versionCible);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Client>>();
      const client = { id: 123 };
      jest.spyOn(clientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ client });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: client }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientService.update).toHaveBeenCalledWith(client);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Client>>();
      const client = new Client();
      jest.spyOn(clientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ client });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: client }));
      saveSubject.complete();

      // THEN
      expect(clientService.create).toHaveBeenCalledWith(client);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Client>>();
      const client = { id: 123 };
      jest.spyOn(clientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ client });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientService.update).toHaveBeenCalledWith(client);
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
  });
});
