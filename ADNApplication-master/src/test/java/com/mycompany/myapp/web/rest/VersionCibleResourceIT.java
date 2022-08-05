package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.VersionCible;
import com.mycompany.myapp.repository.VersionCibleRepository;
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
 * Integration tests for the {@link VersionCibleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VersionCibleResourceIT {

    private static final String DEFAULT_UID_VERSION_CIBLE = "AAAAAAAAAA";
    private static final String UPDATED_UID_VERSION_CIBLE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME_VERSION_CIBLE = "AAAAAAAAAA";
    private static final String UPDATED_NAME_VERSION_CIBLE = "BBBBBBBBBB";

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

    private static final String ENTITY_API_URL = "/api/version-cibles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VersionCibleRepository versionCibleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVersionCibleMockMvc;

    private VersionCible versionCible;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VersionCible createEntity(EntityManager em) {
        VersionCible versionCible = new VersionCible()
            .uidVersionCible(DEFAULT_UID_VERSION_CIBLE)
            .nameVersionCible(DEFAULT_NAME_VERSION_CIBLE)
            .comment(DEFAULT_COMMENT)
            .description(DEFAULT_DESCRIPTION)
            .createDate(DEFAULT_CREATE_DATE)
            .modifyBy(DEFAULT_MODIFY_BY)
            .modifidDate(DEFAULT_MODIFID_DATE);
        return versionCible;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VersionCible createUpdatedEntity(EntityManager em) {
        VersionCible versionCible = new VersionCible()
            .uidVersionCible(UPDATED_UID_VERSION_CIBLE)
            .nameVersionCible(UPDATED_NAME_VERSION_CIBLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .createDate(UPDATED_CREATE_DATE)
            .modifyBy(UPDATED_MODIFY_BY)
            .modifidDate(UPDATED_MODIFID_DATE);
        return versionCible;
    }

    @BeforeEach
    public void initTest() {
        versionCible = createEntity(em);
    }

    @Test
    @Transactional
    void createVersionCible() throws Exception {
        int databaseSizeBeforeCreate = versionCibleRepository.findAll().size();
        // Create the VersionCible
        restVersionCibleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionCible)))
            .andExpect(status().isCreated());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeCreate + 1);
        VersionCible testVersionCible = versionCibleList.get(versionCibleList.size() - 1);
        assertThat(testVersionCible.getUidVersionCible()).isEqualTo(DEFAULT_UID_VERSION_CIBLE);
        assertThat(testVersionCible.getNameVersionCible()).isEqualTo(DEFAULT_NAME_VERSION_CIBLE);
        assertThat(testVersionCible.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testVersionCible.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVersionCible.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testVersionCible.getModifyBy()).isEqualTo(DEFAULT_MODIFY_BY);
        assertThat(testVersionCible.getModifidDate()).isEqualTo(DEFAULT_MODIFID_DATE);
    }

    @Test
    @Transactional
    void createVersionCibleWithExistingId() throws Exception {
        // Create the VersionCible with an existing ID
        versionCible.setId(1L);

        int databaseSizeBeforeCreate = versionCibleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVersionCibleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionCible)))
            .andExpect(status().isBadRequest());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUidVersionCibleIsRequired() throws Exception {
        int databaseSizeBeforeTest = versionCibleRepository.findAll().size();
        // set the field null
        versionCible.setUidVersionCible(null);

        // Create the VersionCible, which fails.

        restVersionCibleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionCible)))
            .andExpect(status().isBadRequest());

        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameVersionCibleIsRequired() throws Exception {
        int databaseSizeBeforeTest = versionCibleRepository.findAll().size();
        // set the field null
        versionCible.setNameVersionCible(null);

        // Create the VersionCible, which fails.

        restVersionCibleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionCible)))
            .andExpect(status().isBadRequest());

        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVersionCibles() throws Exception {
        // Initialize the database
        versionCibleRepository.saveAndFlush(versionCible);

        // Get all the versionCibleList
        restVersionCibleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(versionCible.getId().intValue())))
            .andExpect(jsonPath("$.[*].uidVersionCible").value(hasItem(DEFAULT_UID_VERSION_CIBLE)))
            .andExpect(jsonPath("$.[*].nameVersionCible").value(hasItem(DEFAULT_NAME_VERSION_CIBLE)))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(DEFAULT_CREATE_DATE)))
            .andExpect(jsonPath("$.[*].modifyBy").value(hasItem(DEFAULT_MODIFY_BY)))
            .andExpect(jsonPath("$.[*].modifidDate").value(hasItem(DEFAULT_MODIFID_DATE)));
    }

    @Test
    @Transactional
    void getVersionCible() throws Exception {
        // Initialize the database
        versionCibleRepository.saveAndFlush(versionCible);

        // Get the versionCible
        restVersionCibleMockMvc
            .perform(get(ENTITY_API_URL_ID, versionCible.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(versionCible.getId().intValue()))
            .andExpect(jsonPath("$.uidVersionCible").value(DEFAULT_UID_VERSION_CIBLE))
            .andExpect(jsonPath("$.nameVersionCible").value(DEFAULT_NAME_VERSION_CIBLE))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createDate").value(DEFAULT_CREATE_DATE))
            .andExpect(jsonPath("$.modifyBy").value(DEFAULT_MODIFY_BY))
            .andExpect(jsonPath("$.modifidDate").value(DEFAULT_MODIFID_DATE));
    }

    @Test
    @Transactional
    void getNonExistingVersionCible() throws Exception {
        // Get the versionCible
        restVersionCibleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVersionCible() throws Exception {
        // Initialize the database
        versionCibleRepository.saveAndFlush(versionCible);

        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();

        // Update the versionCible
        VersionCible updatedVersionCible = versionCibleRepository.findById(versionCible.getId()).get();
        // Disconnect from session so that the updates on updatedVersionCible are not directly saved in db
        em.detach(updatedVersionCible);
        updatedVersionCible
            .uidVersionCible(UPDATED_UID_VERSION_CIBLE)
            .nameVersionCible(UPDATED_NAME_VERSION_CIBLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .createDate(UPDATED_CREATE_DATE)
            .modifyBy(UPDATED_MODIFY_BY)
            .modifidDate(UPDATED_MODIFID_DATE);

        restVersionCibleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVersionCible.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVersionCible))
            )
            .andExpect(status().isOk());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
        VersionCible testVersionCible = versionCibleList.get(versionCibleList.size() - 1);
        assertThat(testVersionCible.getUidVersionCible()).isEqualTo(UPDATED_UID_VERSION_CIBLE);
        assertThat(testVersionCible.getNameVersionCible()).isEqualTo(UPDATED_NAME_VERSION_CIBLE);
        assertThat(testVersionCible.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testVersionCible.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVersionCible.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testVersionCible.getModifyBy()).isEqualTo(UPDATED_MODIFY_BY);
        assertThat(testVersionCible.getModifidDate()).isEqualTo(UPDATED_MODIFID_DATE);
    }

    @Test
    @Transactional
    void putNonExistingVersionCible() throws Exception {
        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();
        versionCible.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVersionCibleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, versionCible.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(versionCible))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVersionCible() throws Exception {
        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();
        versionCible.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionCibleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(versionCible))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVersionCible() throws Exception {
        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();
        versionCible.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionCibleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(versionCible)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVersionCibleWithPatch() throws Exception {
        // Initialize the database
        versionCibleRepository.saveAndFlush(versionCible);

        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();

        // Update the versionCible using partial update
        VersionCible partialUpdatedVersionCible = new VersionCible();
        partialUpdatedVersionCible.setId(versionCible.getId());

        partialUpdatedVersionCible.uidVersionCible(UPDATED_UID_VERSION_CIBLE).modifidDate(UPDATED_MODIFID_DATE);

        restVersionCibleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVersionCible.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVersionCible))
            )
            .andExpect(status().isOk());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
        VersionCible testVersionCible = versionCibleList.get(versionCibleList.size() - 1);
        assertThat(testVersionCible.getUidVersionCible()).isEqualTo(UPDATED_UID_VERSION_CIBLE);
        assertThat(testVersionCible.getNameVersionCible()).isEqualTo(DEFAULT_NAME_VERSION_CIBLE);
        assertThat(testVersionCible.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testVersionCible.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testVersionCible.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testVersionCible.getModifyBy()).isEqualTo(DEFAULT_MODIFY_BY);
        assertThat(testVersionCible.getModifidDate()).isEqualTo(UPDATED_MODIFID_DATE);
    }

    @Test
    @Transactional
    void fullUpdateVersionCibleWithPatch() throws Exception {
        // Initialize the database
        versionCibleRepository.saveAndFlush(versionCible);

        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();

        // Update the versionCible using partial update
        VersionCible partialUpdatedVersionCible = new VersionCible();
        partialUpdatedVersionCible.setId(versionCible.getId());

        partialUpdatedVersionCible
            .uidVersionCible(UPDATED_UID_VERSION_CIBLE)
            .nameVersionCible(UPDATED_NAME_VERSION_CIBLE)
            .comment(UPDATED_COMMENT)
            .description(UPDATED_DESCRIPTION)
            .createDate(UPDATED_CREATE_DATE)
            .modifyBy(UPDATED_MODIFY_BY)
            .modifidDate(UPDATED_MODIFID_DATE);

        restVersionCibleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVersionCible.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVersionCible))
            )
            .andExpect(status().isOk());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
        VersionCible testVersionCible = versionCibleList.get(versionCibleList.size() - 1);
        assertThat(testVersionCible.getUidVersionCible()).isEqualTo(UPDATED_UID_VERSION_CIBLE);
        assertThat(testVersionCible.getNameVersionCible()).isEqualTo(UPDATED_NAME_VERSION_CIBLE);
        assertThat(testVersionCible.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testVersionCible.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testVersionCible.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testVersionCible.getModifyBy()).isEqualTo(UPDATED_MODIFY_BY);
        assertThat(testVersionCible.getModifidDate()).isEqualTo(UPDATED_MODIFID_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingVersionCible() throws Exception {
        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();
        versionCible.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVersionCibleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, versionCible.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(versionCible))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVersionCible() throws Exception {
        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();
        versionCible.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionCibleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(versionCible))
            )
            .andExpect(status().isBadRequest());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVersionCible() throws Exception {
        int databaseSizeBeforeUpdate = versionCibleRepository.findAll().size();
        versionCible.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVersionCibleMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(versionCible))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VersionCible in the database
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVersionCible() throws Exception {
        // Initialize the database
        versionCibleRepository.saveAndFlush(versionCible);

        int databaseSizeBeforeDelete = versionCibleRepository.findAll().size();

        // Delete the versionCible
        restVersionCibleMockMvc
            .perform(delete(ENTITY_API_URL_ID, versionCible.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VersionCible> versionCibleList = versionCibleRepository.findAll();
        assertThat(versionCibleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
