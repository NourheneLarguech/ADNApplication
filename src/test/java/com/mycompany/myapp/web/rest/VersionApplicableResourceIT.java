package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.VersionApplicable;
import com.mycompany.myapp.repository.VersionApplicableRepository;
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
 * Integration tests for the {@link VersionApplicableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VersionApplicableResourceIT {

    private static final String DEFAULT_UID_VERSION_APPLICABLE = "AAAAAAAAAA";
    private static final String UPDATED_UID_VERSION_APPLICABLE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_VERSION_APPLICABLE = "AAAAAAAAAA";
    private static final String UPDATED_NAME_VERSION_APPLICABLE = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_DATE = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_DATE = "BBBBBBBBBB";

    private static final String DEFAULT_MODIFY_BY = "AAAAAAAAAA";
    private static final String UPDATED_MODIFY_BY = "BBBBBBBBBB";

    private static final String DEFAULT_MODIFID_DATE = "AAAAAAAAAA";
    private static final String UPDATED_MODIFID_DATE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/version-applicables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VersionApplicableRepository versionApplicableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVersionApplicableMockMvc;

    private VersionApplicable versionApplicable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VersionApplicable createEntity(EntityManager em) {
        VersionApplicable versionApplicable = new VersionApplicable()
            .uidVersionApplicable(DEFAULT_UID_VERSION_APPLICABLE)
            .nameVersionApplicable(DEFAULT_NAME_VERSION_APPLICABLE)
            .comment(DEFAULT_COMMENT)
            .description(DEFAULT_DESCRIPTION)
            .createDate(DEFAULT_CREATE_DATE)
            .modifyBy(DEFAULT_MODIFY_BY)
            .modifidDate(DEFAULT_MODIFID_DATE);
        return versionApplicable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VersionApplicable createUpdatedEntity(EntityManager em) {
        VersionApplicable versionApplicable = new VersionApplicable()
            .uidVersionApplicable(UPDATED_UID_VERSION_APPLICABLE)
            .nameVersionApplicable(UPDATED_NAME_VERSION_APPLICABLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .createDate(UPDATED_CREATE_DATE)
            .modifyBy(UPDATED_MODIFY_BY)
            .modifidDate(UPDATED_MODIFID_DATE);
        return versionApplicable;
    }

    @BeforeEach
    public void initTest() {
        versionApplicable = createEntity(em);
    }

    @Test
    @Transactional
    void createVersionApplicable() throws Exception {
        int databaseSizeBeforeCreate = versionApplicableRepository.findAll().size();
        // Create the VersionApplicable
        restVersionApplicableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isCreated());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeCreate + 1);
        VersionApplicable testVersionApplicable = versionApplicableList.get(versionApplicableList.size() - 1);
        assertThat(testVersionApplicable.getUidVersionApplicable()).isEqualTo(DEFAULT_UID_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getNameVersionApplicable()).isEqualTo(DEFAULT_NAME_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testVersionApplicable.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVersionApplicable.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testVersionApplicable.getModifyBy()).isEqualTo(DEFAULT_MODIFY_BY);
        assertThat(testVersionApplicable.getModifidDate()).isEqualTo(DEFAULT_MODIFID_DATE);
    }

    @Test
    @Transactional
    void createVersionApplicableWithExistingId() throws Exception {
        // Create the VersionApplicable with an existing ID
        versionApplicable.setId(1L);

        int databaseSizeBeforeCreate = versionApplicableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVersionApplicableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUidVersionApplicableIsRequired() throws Exception {
        int databaseSizeBeforeTest = versionApplicableRepository.findAll().size();
        // set the field null
        versionApplicable.setUidVersionApplicable(null);

        // Create the VersionApplicable, which fails.

        restVersionApplicableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameVersionApplicableIsRequired() throws Exception {
        int databaseSizeBeforeTest = versionApplicableRepository.findAll().size();
        // set the field null
        versionApplicable.setNameVersionApplicable(null);

        // Create the VersionApplicable, which fails.

        restVersionApplicableMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVersionApplicables() throws Exception {
        // Initialize the database
        versionApplicableRepository.saveAndFlush(versionApplicable);

        // Get all the versionApplicableList
        restVersionApplicableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(versionApplicable.getId().intValue())))
            .andExpect(jsonPath("$.[*].uidVersionApplicable").value(hasItem(DEFAULT_UID_VERSION_APPLICABLE)))
            .andExpect(jsonPath("$.[*].nameVersionApplicable").value(hasItem(DEFAULT_NAME_VERSION_APPLICABLE)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(DEFAULT_CREATE_DATE)))
            .andExpect(jsonPath("$.[*].modifyBy").value(hasItem(DEFAULT_MODIFY_BY)))
            .andExpect(jsonPath("$.[*].modifidDate").value(hasItem(DEFAULT_MODIFID_DATE)));
    }

    @Test
    @Transactional
    void getVersionApplicable() throws Exception {
        // Initialize the database
        versionApplicableRepository.saveAndFlush(versionApplicable);

        // Get the versionApplicable
        restVersionApplicableMockMvc
            .perform(get(ENTITY_API_URL_ID, versionApplicable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(versionApplicable.getId().intValue()))
            .andExpect(jsonPath("$.uidVersionApplicable").value(DEFAULT_UID_VERSION_APPLICABLE))
            .andExpect(jsonPath("$.nameVersionApplicable").value(DEFAULT_NAME_VERSION_APPLICABLE))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createDate").value(DEFAULT_CREATE_DATE))
            .andExpect(jsonPath("$.modifyBy").value(DEFAULT_MODIFY_BY))
            .andExpect(jsonPath("$.modifidDate").value(DEFAULT_MODIFID_DATE));
    }

    @Test
    @Transactional
    void getNonExistingVersionApplicable() throws Exception {
        // Get the versionApplicable
        restVersionApplicableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVersionApplicable() throws Exception {
        // Initialize the database
        versionApplicableRepository.saveAndFlush(versionApplicable);

        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();

        // Update the versionApplicable
        VersionApplicable updatedVersionApplicable = versionApplicableRepository.findById(versionApplicable.getId()).get();
        // Disconnect from session so that the updates on updatedVersionApplicable are not directly saved in db
        em.detach(updatedVersionApplicable);
        updatedVersionApplicable
            .uidVersionApplicable(UPDATED_UID_VERSION_APPLICABLE)
            .nameVersionApplicable(UPDATED_NAME_VERSION_APPLICABLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .createDate(UPDATED_CREATE_DATE)
            .modifyBy(UPDATED_MODIFY_BY)
            .modifidDate(UPDATED_MODIFID_DATE);

        restVersionApplicableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVersionApplicable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVersionApplicable))
            )
            .andExpect(status().isOk());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
        VersionApplicable testVersionApplicable = versionApplicableList.get(versionApplicableList.size() - 1);
        assertThat(testVersionApplicable.getUidVersionApplicable()).isEqualTo(UPDATED_UID_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getNameVersionApplicable()).isEqualTo(UPDATED_NAME_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testVersionApplicable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVersionApplicable.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testVersionApplicable.getModifyBy()).isEqualTo(UPDATED_MODIFY_BY);
        assertThat(testVersionApplicable.getModifidDate()).isEqualTo(UPDATED_MODIFID_DATE);
    }

    @Test
    @Transactional
    void putNonExistingVersionApplicable() throws Exception {
        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();
        versionApplicable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVersionApplicableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, versionApplicable.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVersionApplicable() throws Exception {
        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();
        versionApplicable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionApplicableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVersionApplicable() throws Exception {
        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();
        versionApplicable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionApplicableMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVersionApplicableWithPatch() throws Exception {
        // Initialize the database
        versionApplicableRepository.saveAndFlush(versionApplicable);

        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();

        // Update the versionApplicable using partial update
        VersionApplicable partialUpdatedVersionApplicable = new VersionApplicable();
        partialUpdatedVersionApplicable.setId(versionApplicable.getId());

        partialUpdatedVersionApplicable
            .nameVersionApplicable(UPDATED_NAME_VERSION_APPLICABLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .modifyBy(UPDATED_MODIFY_BY);

        restVersionApplicableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVersionApplicable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVersionApplicable))
            )
            .andExpect(status().isOk());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
        VersionApplicable testVersionApplicable = versionApplicableList.get(versionApplicableList.size() - 1);
        assertThat(testVersionApplicable.getUidVersionApplicable()).isEqualTo(DEFAULT_UID_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getNameVersionApplicable()).isEqualTo(UPDATED_NAME_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testVersionApplicable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVersionApplicable.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testVersionApplicable.getModifyBy()).isEqualTo(UPDATED_MODIFY_BY);
        assertThat(testVersionApplicable.getModifidDate()).isEqualTo(DEFAULT_MODIFID_DATE);
    }

    @Test
    @Transactional
    void fullUpdateVersionApplicableWithPatch() throws Exception {
        // Initialize the database
        versionApplicableRepository.saveAndFlush(versionApplicable);

        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();

        // Update the versionApplicable using partial update
        VersionApplicable partialUpdatedVersionApplicable = new VersionApplicable();
        partialUpdatedVersionApplicable.setId(versionApplicable.getId());

        partialUpdatedVersionApplicable
            .uidVersionApplicable(UPDATED_UID_VERSION_APPLICABLE)
            .nameVersionApplicable(UPDATED_NAME_VERSION_APPLICABLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .createDate(UPDATED_CREATE_DATE)
            .modifyBy(UPDATED_MODIFY_BY)
            .modifidDate(UPDATED_MODIFID_DATE);

        restVersionApplicableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVersionApplicable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVersionApplicable))
            )
            .andExpect(status().isOk());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
        VersionApplicable testVersionApplicable = versionApplicableList.get(versionApplicableList.size() - 1);
        assertThat(testVersionApplicable.getUidVersionApplicable()).isEqualTo(UPDATED_UID_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getNameVersionApplicable()).isEqualTo(UPDATED_NAME_VERSION_APPLICABLE);
        assertThat(testVersionApplicable.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testVersionApplicable.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVersionApplicable.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testVersionApplicable.getModifyBy()).isEqualTo(UPDATED_MODIFY_BY);
        assertThat(testVersionApplicable.getModifidDate()).isEqualTo(UPDATED_MODIFID_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingVersionApplicable() throws Exception {
        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();
        versionApplicable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVersionApplicableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, versionApplicable.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVersionApplicable() throws Exception {
        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();
        versionApplicable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionApplicableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVersionApplicable() throws Exception {
        int databaseSizeBeforeUpdate = versionApplicableRepository.findAll().size();
        versionApplicable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionApplicableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(versionApplicable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VersionApplicable in the database
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVersionApplicable() throws Exception {
        // Initialize the database
        versionApplicableRepository.saveAndFlush(versionApplicable);

        int databaseSizeBeforeDelete = versionApplicableRepository.findAll().size();

        // Delete the versionApplicable
        restVersionApplicableMockMvc
            .perform(delete(ENTITY_API_URL_ID, versionApplicable.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VersionApplicable> versionApplicableList = versionApplicableRepository.findAll();
        assertThat(versionApplicableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
