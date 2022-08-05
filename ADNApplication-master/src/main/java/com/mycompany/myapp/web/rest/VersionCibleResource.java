package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.VersionCible;
import com.mycompany.myapp.repository.VersionCibleRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.VersionCible}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VersionCibleResource {

    private final Logger log = LoggerFactory.getLogger(VersionCibleResource.class);

    private static final String ENTITY_NAME = "versionCible";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VersionCibleRepository versionCibleRepository;

    public VersionCibleResource(VersionCibleRepository versionCibleRepository) {
        this.versionCibleRepository = versionCibleRepository;
    }

    /**
     * {@code POST  /version-cibles} : Create a new versionCible.
     *
     * @param versionCible the versionCible to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new versionCible, or with status {@code 400 (Bad Request)} if the versionCible has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/version-cibles")
    public ResponseEntity<VersionCible> createVersionCible(@Valid @RequestBody VersionCible versionCible) throws URISyntaxException {
        log.debug("REST request to save VersionCible : {}", versionCible);
        if (versionCible.getId() != null) {
            throw new BadRequestAlertException("A new versionCible cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VersionCible result = versionCibleRepository.save(versionCible);
        return ResponseEntity
            .created(new URI("/api/version-cibles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /version-cibles/:id} : Updates an existing versionCible.
     *
     * @param id the id of the versionCible to save.
     * @param versionCible the versionCible to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated versionCible,
     * or with status {@code 400 (Bad Request)} if the versionCible is not valid,
     * or with status {@code 500 (Internal Server Error)} if the versionCible couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/version-cibles/{id}")
    public ResponseEntity<VersionCible> updateVersionCible(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VersionCible versionCible
    ) throws URISyntaxException {
        log.debug("REST request to update VersionCible : {}, {}", id, versionCible);
        if (versionCible.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, versionCible.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!versionCibleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VersionCible result = versionCibleRepository.save(versionCible);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, versionCible.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /version-cibles/:id} : Partial updates given fields of an existing versionCible, field will ignore if it is null
     *
     * @param id the id of the versionCible to save.
     * @param versionCible the versionCible to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated versionCible,
     * or with status {@code 400 (Bad Request)} if the versionCible is not valid,
     * or with status {@code 404 (Not Found)} if the versionCible is not found,
     * or with status {@code 500 (Internal Server Error)} if the versionCible couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/version-cibles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VersionCible> partialUpdateVersionCible(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VersionCible versionCible
    ) throws URISyntaxException {
        log.debug("REST request to partial update VersionCible partially : {}, {}", id, versionCible);
        if (versionCible.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, versionCible.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!versionCibleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VersionCible> result = versionCibleRepository
            .findById(versionCible.getId())
            .map(existingVersionCible -> {
                if (versionCible.getUidVersionCible() != null) {
                    existingVersionCible.setUidVersionCible(versionCible.getUidVersionCible());
                }
                if (versionCible.getNameVersionCible() != null) {
                    existingVersionCible.setNameVersionCible(versionCible.getNameVersionCible());
                }
                if (versionCible.getComment() != null) {
                    existingVersionCible.setComment(versionCible.getComment());
                }
                if (versionCible.getDescription() != null) {
                    existingVersionCible.setDescription(versionCible.getDescription());
                }
                if (versionCible.getCreateDate() != null) {
                    existingVersionCible.setCreateDate(versionCible.getCreateDate());
                }
                if (versionCible.getModifyBy() != null) {
                    existingVersionCible.setModifyBy(versionCible.getModifyBy());
                }
                if (versionCible.getModifidDate() != null) {
                    existingVersionCible.setModifidDate(versionCible.getModifidDate());
                }

                return existingVersionCible;
            })
            .map(versionCibleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, versionCible.getId().toString())
        );
    }

    /**
     * {@code GET  /version-cibles} : get all the versionCibles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of versionCibles in body.
     */
    @GetMapping("/version-cibles")
    public List<VersionCible> getAllVersionCibles() {
        log.debug("REST request to get all VersionCibles");
        return versionCibleRepository.findAll();
    }

    /**
     * {@code GET  /version-cibles/:id} : get the "id" versionCible.
     *
     * @param id the id of the versionCible to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the versionCible, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/version-cibles/{id}")
    public ResponseEntity<VersionCible> getVersionCible(@PathVariable Long id) {
        log.debug("REST request to get VersionCible : {}", id);
        Optional<VersionCible> versionCible = versionCibleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(versionCible);
    }

    /**
     * {@code DELETE  /version-cibles/:id} : delete the "id" versionCible.
     *
     * @param id the id of the versionCible to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/version-cibles/{id}")
    public ResponseEntity<Void> deleteVersionCible(@PathVariable Long id) {
        log.debug("REST request to delete VersionCible : {}", id);
        versionCibleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
