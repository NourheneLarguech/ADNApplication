package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Update;
import com.mycompany.myapp.repository.UpdateRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Update}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UpdateResource {

    private final Logger log = LoggerFactory.getLogger(UpdateResource.class);

    private static final String ENTITY_NAME = "update";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UpdateRepository updateRepository;

    public UpdateResource(UpdateRepository updateRepository) {
        this.updateRepository = updateRepository;
    }

    /**
     * {@code POST  /updates} : Create a new update.
     *
     * @param update the update to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new update, or with status {@code 400 (Bad Request)} if the update has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/updates")
    public ResponseEntity<Update> createUpdate(@Valid @RequestBody Update update) throws URISyntaxException {
        log.debug("REST request to save Update : {}", update);
        if (update.getId() != null) {
            throw new BadRequestAlertException("A new update cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Update result = updateRepository.save(update);
        return ResponseEntity
            .created(new URI("/api/updates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /updates/:id} : Updates an existing update.
     *
     * @param id the id of the update to save.
     * @param update the update to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated update,
     * or with status {@code 400 (Bad Request)} if the update is not valid,
     * or with status {@code 500 (Internal Server Error)} if the update couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/updates/{id}")
    public ResponseEntity<Update> updateUpdate(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Update update
    ) throws URISyntaxException {
        log.debug("REST request to update Update : {}, {}", id, update);
        if (update.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, update.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!updateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Update result = updateRepository.save(update);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, update.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /updates/:id} : Partial updates given fields of an existing update, field will ignore if it is null
     *
     * @param id the id of the update to save.
     * @param update the update to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated update,
     * or with status {@code 400 (Bad Request)} if the update is not valid,
     * or with status {@code 404 (Not Found)} if the update is not found,
     * or with status {@code 500 (Internal Server Error)} if the update couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/updates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Update> partialUpdateUpdate(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Update update
    ) throws URISyntaxException {
        log.debug("REST request to partial update Update partially : {}, {}", id, update);
        if (update.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, update.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!updateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Update> result = updateRepository
            .findById(update.getId())
            .map(existingUpdate -> {
                if (update.getUidUpdate() != null) {
                    existingUpdate.setUidUpdate(update.getUidUpdate());
                }
                if (update.getVersionName() != null) {
                    existingUpdate.setVersionName(update.getVersionName());
                }
                if (update.getStatut() != null) {
                    existingUpdate.setStatut(update.getStatut());
                }
                if (update.getDescription() != null) {
                    existingUpdate.setDescription(update.getDescription());
                }
                if (update.getComment() != null) {
                    existingUpdate.setComment(update.getComment());
                }

                return existingUpdate;
            })
            .map(updateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, update.getId().toString())
        );
    }

    /**
     * {@code GET  /updates} : get all the updates.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of updates in body.
     */
    @GetMapping("/updates")
    public List<Update> getAllUpdates() {
        log.debug("REST request to get all Updates");
        return updateRepository.findAll();
    }

    /**
     * {@code GET  /updates/:id} : get the "id" update.
     *
     * @param id the id of the update to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the update, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/updates/{id}")
    public ResponseEntity<Update> getUpdate(@PathVariable Long id) {
        log.debug("REST request to get Update : {}", id);
        Optional<Update> update = updateRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(update);
    }

    /**
     * {@code DELETE  /updates/:id} : delete the "id" update.
     *
     * @param id the id of the update to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/updates/{id}")
    public ResponseEntity<Void> deleteUpdate(@PathVariable Long id) {
        log.debug("REST request to delete Update : {}", id);
        updateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
