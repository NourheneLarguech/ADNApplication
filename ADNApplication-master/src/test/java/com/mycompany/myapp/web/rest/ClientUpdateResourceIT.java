package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ClientUpdate;
import com.mycompany.myapp.repository.ClientUpdateRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ClientUpdateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClientUpdateResourceIT {

    private static final String ENTITY_API_URL = "/api/client-updates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClientUpdateRepository clientUpdateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClientUpdateMockMvc;

    private ClientUpdate clientUpdate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientUpdate createEntity(EntityManager em) {
        ClientUpdate clientUpdate = new ClientUpdate();
        return clientUpdate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientUpdate createUpdatedEntity(EntityManager em) {
        ClientUpdate clientUpdate = new ClientUpdate();
        return clientUpdate;
    }

    @BeforeEach
    public void initTest() {
        clientUpdate = createEntity(em);
    }

    @Test
    @Transactional
    void createClientUpdate() throws Exception {
        int databaseSizeBeforeCreate = clientUpdateRepository.findAll().size();
        // Create the ClientUpdate
        restClientUpdateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientUpdate)))
            .andExpect(status().isCreated());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeCreate + 1);
        ClientUpdate testClientUpdate = clientUpdateList.get(clientUpdateList.size() - 1);
    }

    @Test
    @Transactional
    void createClientUpdateWithExistingId() throws Exception {
        // Create the ClientUpdate with an existing ID
        clientUpdate.setId(1L);

        int databaseSizeBeforeCreate = clientUpdateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientUpdateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientUpdate)))
            .andExpect(status().isBadRequest());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClientUpdates() throws Exception {
        // Initialize the database
        clientUpdateRepository.saveAndFlush(clientUpdate);

        // Get all the clientUpdateList
        restClientUpdateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientUpdate.getId().intValue())));
    }

    @Test
    @Transactional
    void getClientUpdate() throws Exception {
        // Initialize the database
        clientUpdateRepository.saveAndFlush(clientUpdate);

        // Get the clientUpdate
        restClientUpdateMockMvc
            .perform(get(ENTITY_API_URL_ID, clientUpdate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clientUpdate.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingClientUpdate() throws Exception {
        // Get the clientUpdate
        restClientUpdateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClientUpdate() throws Exception {
        // Initialize the database
        clientUpdateRepository.saveAndFlush(clientUpdate);

        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();

        // Update the clientUpdate
        ClientUpdate updatedClientUpdate = clientUpdateRepository.findById(clientUpdate.getId()).get();
        // Disconnect from session so that the updates on updatedClientUpdate are not directly saved in db
        em.detach(updatedClientUpdate);

        restClientUpdateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClientUpdate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClientUpdate))
            )
            .andExpect(status().isOk());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
        ClientUpdate testClientUpdate = clientUpdateList.get(clientUpdateList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingClientUpdate() throws Exception {
        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();
        clientUpdate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientUpdateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clientUpdate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientUpdate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClientUpdate() throws Exception {
        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();
        clientUpdate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientUpdateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientUpdate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClientUpdate() throws Exception {
        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();
        clientUpdate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientUpdateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientUpdate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClientUpdateWithPatch() throws Exception {
        // Initialize the database
        clientUpdateRepository.saveAndFlush(clientUpdate);

        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();

        // Update the clientUpdate using partial update
        ClientUpdate partialUpdatedClientUpdate = new ClientUpdate();
        partialUpdatedClientUpdate.setId(clientUpdate.getId());

        restClientUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientUpdate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientUpdate))
            )
            .andExpect(status().isOk());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
        ClientUpdate testClientUpdate = clientUpdateList.get(clientUpdateList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateClientUpdateWithPatch() throws Exception {
        // Initialize the database
        clientUpdateRepository.saveAndFlush(clientUpdate);

        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();

        // Update the clientUpdate using partial update
        ClientUpdate partialUpdatedClientUpdate = new ClientUpdate();
        partialUpdatedClientUpdate.setId(clientUpdate.getId());

        restClientUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientUpdate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientUpdate))
            )
            .andExpect(status().isOk());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
        ClientUpdate testClientUpdate = clientUpdateList.get(clientUpdateList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingClientUpdate() throws Exception {
        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();
        clientUpdate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clientUpdate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientUpdate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClientUpdate() throws Exception {
        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();
        clientUpdate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientUpdate))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClientUpdate() throws Exception {
        int databaseSizeBeforeUpdate = clientUpdateRepository.findAll().size();
        clientUpdate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(clientUpdate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientUpdate in the database
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClientUpdate() throws Exception {
        // Initialize the database
        clientUpdateRepository.saveAndFlush(clientUpdate);

        int databaseSizeBeforeDelete = clientUpdateRepository.findAll().size();

        // Delete the clientUpdate
        restClientUpdateMockMvc
            .perform(delete(ENTITY_API_URL_ID, clientUpdate.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClientUpdate> clientUpdateList = clientUpdateRepository.findAll();
        assertThat(clientUpdateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
