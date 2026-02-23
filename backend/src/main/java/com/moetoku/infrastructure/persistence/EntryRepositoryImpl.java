package com.moetoku.infrastructure.persistence;

import com.moetoku.domain.model.entry.DespairEntry;
import com.moetoku.domain.model.entry.MemberName;
import com.moetoku.domain.repository.EntryRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EntryRepositoryImpl implements EntryRepository {

    private final DespairEntryJpaRepository jpaRepository;
    private final EntryMapper mapper;

    public EntryRepositoryImpl(DespairEntryJpaRepository jpaRepository, EntryMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public DespairEntry save(DespairEntry entry) {
        DespairEntryJpaEntity saved = jpaRepository.save(mapper.toJpaEntity(entry));
        return mapper.toDomain(saved);
    }

    @Override
    public List<DespairEntry> findAll() {
        return jpaRepository.findAll().stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public List<DespairEntry> findByMemberName(MemberName memberName) {
        return jpaRepository.findByMemberName(memberName.value()).stream()
            .map(mapper::toDomain)
            .toList();
    }

    @Override
    public List<MemberName> findAllMemberNames() {
        return jpaRepository.findDistinctMemberNames().stream()
            .map(MemberName::of)
            .toList();
    }
}
