package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ClientUpdate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ClientUpdate entity.
 */
@Repository
public interface ClientUpdateRepository extends JpaRepository<ClientUpdate, Long> {
    default Optional<ClientUpdate> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ClientUpdate> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ClientUpdate> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct clientUpdate from ClientUpdate clientUpdate left join fetch clientUpdate.client left join fetch clientUpdate.update",
        countQuery = "select count(distinct clientUpdate) from ClientUpdate clientUpdate"
    )
    Page<ClientUpdate> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct clientUpdate from ClientUpdate clientUpdate left join fetch clientUpdate.client left join fetch clientUpdate.update"
    )
    List<ClientUpdate> findAllWithToOneRelationships();

    @Query(
        "select clientUpdate from ClientUpdate clientUpdate left join fetch clientUpdate.client left join fetch clientUpdate.update where clientUpdate.id =:id"
    )
    Optional<ClientUpdate> findOneWithToOneRelationships(@Param("id") Long id);
}
