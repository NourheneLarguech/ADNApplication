package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Update;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Update entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UpdateRepository extends JpaRepository<Update, Long> {}
