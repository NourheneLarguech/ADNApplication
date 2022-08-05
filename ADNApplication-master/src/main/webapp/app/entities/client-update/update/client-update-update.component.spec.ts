import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClientUpdateService } from '../service/client-update.service';
import { IClientUpdate, ClientUpdate } from '../client-update.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IUpdate } from 'app/entities/update/update.model';
import { UpdateService } from 'app/entities/update/service/update.service';

import { ClientUpdateUpdateComponent } from './client-update-update.component';

describe('ClientUpdate Management Update Component', () => {
  let comp: ClientUpdateUpdateComponent;
  let fixture: ComponentFixture<ClientUpdateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientUpdateService: ClientUpdateService;
  let clientService: ClientService;
  let updateService: UpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClientUpdateUpdateComponent],
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
      .overrideTemplate(ClientUpdateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientUpdateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientUpdateService = TestBed.inject(ClientUpdateService);
    clientService = TestBed.inject(ClientService);
    updateService = TestBed.inject(UpdateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const clientUpdate: IClientUpdate = { id: 456 };
      const client: IClient = { id: 45175 };
      clientUpdate.client = client;

      const clientCollection: IClient[] = [{ id: 85448 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clientUpdate });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Update query and add missing value', () => {
      const clientUpdate: IClientUpdate = { id: 456 };
      const update: IUpdate = { id: 82846 };
      clientUpdate.update = update;

      const updateCollection: IUpdate[] = [{ id: 90677 }];
      jest.spyOn(updateService, 'query').mockReturnValue(of(new HttpResponse({ body: updateCollection })));
      const additionalUpdates = [update];
      const expectedCollection: IUpdate[] = [...additionalUpdates, ...updateCollection];
      jest.spyOn(updateService, 'addUpdateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ clientUpdate });
      comp.ngOnInit();

      expect(updateService.query).toHaveBeenCalled();
      expect(updateService.addUpdateToCollectionIfMissing).toHaveBeenCalledWith(updateCollection, ...additionalUpdates);
      expect(comp.updatesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const clientUpdate: IClientUpdate = { id: 456 };
      const client: IClient = { id: 39412 };
      clientUpdate.client = client;
      const update: IUpdate = { id: 30626 };
      clientUpdate.update = update;

      activatedRoute.data = of({ clientUpdate });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(clientUpdate));
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.updatesSharedCollection).toContain(update);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClientUpdate>>();
      const clientUpdate = { id: 123 };
      jest.spyOn(clientUpdateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientUpdate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientUpdate }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientUpdateService.update).toHaveBeenCalledWith(clientUpdate);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClientUpdate>>();
      const clientUpdate = new ClientUpdate();
      jest.spyOn(clientUpdateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientUpdate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientUpdate }));
      saveSubject.complete();

      // THEN
      expect(clientUpdateService.create).toHaveBeenCalledWith(clientUpdate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ClientUpdate>>();
      const clientUpdate = { id: 123 };
      jest.spyOn(clientUpdateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientUpdate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientUpdateService.update).toHaveBeenCalledWith(clientUpdate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackClientById', () => {
      it('Should return tracked Client primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUpdateById', () => {
      it('Should return tracked Update primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUpdateById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
