package com.moetoku.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DespairEntryJpaRepository extends JpaRepository<DespairEntryJpaEntity, UUID> {

    List<DespairEntryJpaEntity> findByMemberName(String memberName);
}
