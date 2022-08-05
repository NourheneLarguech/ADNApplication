package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.VersionCible;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the VersionCible entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VersionCibleRepository extends JpaRepository<VersionCible, Long> {}
