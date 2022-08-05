package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.VersionApplicable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the VersionApplicable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VersionApplicableRepository extends JpaRepository<VersionApplicable, Long> {}
