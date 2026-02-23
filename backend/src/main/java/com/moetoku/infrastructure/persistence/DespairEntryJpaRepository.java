package com.moetoku.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DespairEntryJpaRepository extends JpaRepository<DespairEntryJpaEntity, UUID> {

    List<DespairEntryJpaEntity> findByMemberName(String memberName);

    @Query("SELECT DISTINCT e.memberName FROM DespairEntryJpaEntity e ORDER BY e.memberName")
    List<String> findDistinctMemberNames();
}
