package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.VersionApplicable;
import com.mycompany.myapp.repository.VersionApplicableRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.VersionApplicable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VersionApplicableResource {

    private final Logger log = LoggerFactory.getLogger(VersionApplicableResource.class);

    private static final String ENTITY_NAME = "versionApplicable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VersionApplicableRepository versionApplicableRepository;

    public VersionApplicableResource(VersionApplicableRepository versionApplicableRepository) {
        this.versionApplicableRepository = versionApplicableRepository;
    }

    /**
     * {@code POST  /version-applicables} : Create a new versionApplicable.
     *
     * @param versionApplicable the versionApplicable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new versionApplicable, or with status {@code 400 (Bad Request)} if the versionApplicable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/version-applicables")
    public ResponseEntity<VersionApplicable> createVersionApplicable(@Valid @RequestBody VersionApplicable versionApplicable)
        throws URISyntaxException {
        log.debug("REST request to save VersionApplicable : {}", versionApplicable);
        if (versionApplicable.getId() != null) {
            throw new BadRequestAlertException("A new versionApplicable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VersionApplicable result = versionApplicableRepository.save(versionApplicable);
        return ResponseEntity
            .created(new URI("/api/version-applicables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /version-applicables/:id} : Updates an existing versionApplicable.
     *
     * @param id the id of the versionApplicable to save.
     * @param versionApplicable the versionApplicable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated versionApplicable,
     * or with status {@code 400 (Bad Request)} if the versionApplicable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the versionApplicable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/version-applicables/{id}")
    public ResponseEntity<VersionApplicable> updateVersionApplicable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VersionApplicable versionApplicable
    ) throws URISyntaxException {
        log.debug("REST request to update VersionApplicable : {}, {}", id, versionApplicable);
        if (versionApplicable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, versionApplicable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!versionApplicableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VersionApplicable result = versionApplicableRepository.save(versionApplicable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, versionApplicable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /version-applicables/:id} : Partial updates given fields of an existing versionApplicable, field will ignore if it is null
     *
     * @param id the id of the versionApplicable to save.
     * @param versionApplicable the versionApplicable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated versionApplicable,
     * or with status {@code 400 (Bad Request)} if the versionApplicable is not valid,
     * or with status {@code 404 (Not Found)} if the versionApplicable is not found,
     * or with status {@code 500 (Internal Server Error)} if the versionApplicable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/version-applicables/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VersionApplicable> partialUpdateVersionApplicable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VersionApplicable versionApplicable
    ) throws URISyntaxException {
        log.debug("REST request to partial update VersionApplicable partially : {}, {}", id, versionApplicable);
        if (versionApplicable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, versionApplicable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!versionApplicableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VersionApplicable> result = versionApplicableRepository
            .findById(versionApplicable.getId())
            .map(existingVersionApplicable -> {
                if (versionApplicable.getUidVersionApplicable() != null) {
                    existingVersionApplicable.setUidVersionApplicable(versionApplicable.getUidVersionApplicable());
                }
                if (versionApplicable.getNameVersionApplicable() != null) {
                    existingVersionApplicable.setNameVersionApplicable(versionApplicable.getNameVersionApplicable());
                }
                if (versionApplicable.getComment() != null) {
                    existingVersionApplicable.setComment(versionApplicable.getComment());
                }
                if (versionApplicable.getDescription() != null) {
                    existingVersionApplicable.setDescription(versionApplicable.getDescription());
                }
                if (versionApplicable.getCreateDate() != null) {
                    existingVersionApplicable.setCreateDate(versionApplicable.getCreateDate());
                }
                if (versionApplicable.getModifyBy() != null) {
                    existingVersionApplicable.setModifyBy(versionApplicable.getModifyBy());
                }
                if (versionApplicable.getModifidDate() != null) {
                    existingVersionApplicable.setModifidDate(versionApplicable.getModifidDate());
                }

                return existingVersionApplicable;
            })
            .map(versionApplicableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, versionApplicable.getId().toString())
        );
    }

    /**
     * {@code GET  /version-applicables} : get all the versionApplicables.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of versionApplicables in body.
     */
    @GetMapping("/version-applicables")
    public List<VersionApplicable> getAllVersionApplicables() {
        log.debug("REST request to get all VersionApplicables");
        return versionApplicableRepository.findAll();
    }

    /**
     * {@code GET  /version-applicables/:id} : get the "id" versionApplicable.
     *
     * @param id the id of the versionApplicable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the versionApplicable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/version-applicables/{id}")
    public ResponseEntity<VersionApplicable> getVersionApplicable(@PathVariable Long id) {
        log.debug("REST request to get VersionApplicable : {}", id);
        Optional<VersionApplicable> versionApplicable = versionApplicableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(versionApplicable);
    }

    /**
     * {@code DELETE  /version-applicables/:id} : delete the "id" versionApplicable.
     *
     * @param id the id of the versionApplicable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/version-applicables/{id}")
    public ResponseEntity<Void> deleteVersionApplicable(@PathVariable Long id) {
        log.debug("REST request to delete VersionApplicable : {}", id);
        versionApplicableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
