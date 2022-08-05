package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Update;
import com.mycompany.myapp.domain.enumeration.StatutList;
import com.mycompany.myapp.repository.UpdateRepository;
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
 * Integration tests for the {@link UpdateResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UpdateResourceIT {

    private static final String DEFAULT_UID_UPDATE = "AAAAAAAAAA";
    private static final String UPDATED_UID_UPDATE = "BBBBBBBBBB";

    private static final String DEFAULT_VERSION_NAME = "AAAAAAAAAA";
    private static final String UPDATED_VERSION_NAME = "BBBBBBBBBB";

    private static final StatutList DEFAULT_STATUT = StatutList.SUSPENDED;
    private static final StatutList UPDATED_STATUT = StatutList.IN_TEST;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/updates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UpdateRepository updateRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUpdateMockMvc;

    private Update update;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Update createEntity(EntityManager em) {
        Update update = new Update()
            .uidUpdate(DEFAULT_UID_UPDATE)
            .versionName(DEFAULT_VERSION_NAME)
            .statut(DEFAULT_STATUT)
            .description(DEFAULT_DESCRIPTION)
            .comment(DEFAULT_COMMENT);
        return update;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Update createUpdatedEntity(EntityManager em) {
        Update update = new Update()
            .uidUpdate(UPDATED_UID_UPDATE)
            .versionName(UPDATED_VERSION_NAME)
            .statut(UPDATED_STATUT)
            .description(UPDATED_DESCRIPTION)
            .comment(UPDATED_COMMENT);
        return update;
    }

    @BeforeEach
    public void initTest() {
        update = createEntity(em);
    }

    @Test
    @Transactional
    void createUpdate() throws Exception {
        int databaseSizeBeforeCreate = updateRepository.findAll().size();
        // Create the Update
        restUpdateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(update)))
            .andExpect(status().isCreated());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeCreate + 1);
        Update testUpdate = updateList.get(updateList.size() - 1);
        assertThat(testUpdate.getUidUpdate()).isEqualTo(DEFAULT_UID_UPDATE);
        assertThat(testUpdate.getVersionName()).isEqualTo(DEFAULT_VERSION_NAME);
        assertThat(testUpdate.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testUpdate.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testUpdate.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createUpdateWithExistingId() throws Exception {
        // Create the Update with an existing ID
        update.setId(1L);

        int databaseSizeBeforeCreate = updateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUpdateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(update)))
            .andExpect(status().isBadRequest());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUidUpdateIsRequired() throws Exception {
        int databaseSizeBeforeTest = updateRepository.findAll().size();
        // set the field null
        update.setUidUpdate(null);

        // Create the Update, which fails.

        restUpdateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(update)))
            .andExpect(status().isBadRequest());

        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVersionNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = updateRepository.findAll().size();
        // set the field null
        update.setVersionName(null);

        // Create the Update, which fails.

        restUpdateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(update)))
            .andExpect(status().isBadRequest());

        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUpdates() throws Exception {
        // Initialize the database
        updateRepository.saveAndFlush(update);

        // Get all the updateList
        restUpdateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(update.getId().intValue())))
            .andExpect(jsonPath("$.[*].uidUpdate").value(hasItem(DEFAULT_UID_UPDATE)))
            .andExpect(jsonPath("$.[*].versionName").value(hasItem(DEFAULT_VERSION_NAME)))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getUpdate() throws Exception {
        // Initialize the database
        updateRepository.saveAndFlush(update);

        // Get the update
        restUpdateMockMvc
            .perform(get(ENTITY_API_URL_ID, update.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(update.getId().intValue()))
            .andExpect(jsonPath("$.uidUpdate").value(DEFAULT_UID_UPDATE))
            .andExpect(jsonPath("$.versionName").value(DEFAULT_VERSION_NAME))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingUpdate() throws Exception {
        // Get the update
        restUpdateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUpdate() throws Exception {
        // Initialize the database
        updateRepository.saveAndFlush(update);

        int databaseSizeBeforeUpdate = updateRepository.findAll().size();

        // Update the update
        Update updatedUpdate = updateRepository.findById(update.getId()).get();
        // Disconnect from session so that the updates on updatedUpdate are not directly saved in db
        em.detach(updatedUpdate);
        updatedUpdate
            .uidUpdate(UPDATED_UID_UPDATE)
            .versionName(UPDATED_VERSION_NAME)
            .statut(UPDATED_STATUT)
            .description(UPDATED_DESCRIPTION)
            .comment(UPDATED_COMMENT);

        restUpdateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUpdate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUpdate))
            )
            .andExpect(status().isOk());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
        Update testUpdate = updateList.get(updateList.size() - 1);
        assertThat(testUpdate.getUidUpdate()).isEqualTo(UPDATED_UID_UPDATE);
        assertThat(testUpdate.getVersionName()).isEqualTo(UPDATED_VERSION_NAME);
        assertThat(testUpdate.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testUpdate.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUpdate.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingUpdate() throws Exception {
        int databaseSizeBeforeUpdate = updateRepository.findAll().size();
        update.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUpdateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, update.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(update))
            )
            .andExpect(status().isBadRequest());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUpdate() throws Exception {
        int databaseSizeBeforeUpdate = updateRepository.findAll().size();
        update.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUpdateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(update))
            )
            .andExpect(status().isBadRequest());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUpdate() throws Exception {
        int databaseSizeBeforeUpdate = updateRepository.findAll().size();
        update.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUpdateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(update)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUpdateWithPatch() throws Exception {
        // Initialize the database
        updateRepository.saveAndFlush(update);

        int databaseSizeBeforeUpdate = updateRepository.findAll().size();

        // Update the update using partial update
        Update partialUpdatedUpdate = new Update();
        partialUpdatedUpdate.setId(update.getId());

        partialUpdatedUpdate.versionName(UPDATED_VERSION_NAME).description(UPDATED_DESCRIPTION);

        restUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUpdate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUpdate))
            )
            .andExpect(status().isOk());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
        Update testUpdate = updateList.get(updateList.size() - 1);
        assertThat(testUpdate.getUidUpdate()).isEqualTo(DEFAULT_UID_UPDATE);
        assertThat(testUpdate.getVersionName()).isEqualTo(UPDATED_VERSION_NAME);
        assertThat(testUpdate.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testUpdate.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUpdate.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateUpdateWithPatch() throws Exception {
        // Initialize the database
        updateRepository.saveAndFlush(update);

        int databaseSizeBeforeUpdate = updateRepository.findAll().size();

        // Update the update using partial update
        Update partialUpdatedUpdate = new Update();
        partialUpdatedUpdate.setId(update.getId());

        partialUpdatedUpdate
            .uidUpdate(UPDATED_UID_UPDATE)
            .versionName(UPDATED_VERSION_NAME)
            .statut(UPDATED_STATUT)
            .description(UPDATED_DESCRIPTION)
            .comment(UPDATED_COMMENT);

        restUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUpdate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUpdate))
            )
            .andExpect(status().isOk());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
        Update testUpdate = updateList.get(updateList.size() - 1);
        assertThat(testUpdate.getUidUpdate()).isEqualTo(UPDATED_UID_UPDATE);
        assertThat(testUpdate.getVersionName()).isEqualTo(UPDATED_VERSION_NAME);
        assertThat(testUpdate.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testUpdate.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUpdate.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingUpdate() throws Exception {
        int databaseSizeBeforeUpdate = updateRepository.findAll().size();
        update.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, update.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(update))
            )
            .andExpect(status().isBadRequest());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUpdate() throws Exception {
        int databaseSizeBeforeUpdate = updateRepository.findAll().size();
        update.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUpdateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(update))
            )
            .andExpect(status().isBadRequest());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUpdate() throws Exception {
        int databaseSizeBeforeUpdate = updateRepository.findAll().size();
        update.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUpdateMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(update)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Update in the database
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUpdate() throws Exception {
        // Initialize the database
        updateRepository.saveAndFlush(update);

        int databaseSizeBeforeDelete = updateRepository.findAll().size();

        // Delete the update
        restUpdateMockMvc
            .perform(delete(ENTITY_API_URL_ID, update.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Update> updateList = updateRepository.findAll();
        assertThat(updateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
