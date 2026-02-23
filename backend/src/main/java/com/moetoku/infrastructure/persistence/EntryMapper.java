package com.moetoku.infrastructure.persistence;

import com.moetoku.domain.model.entry.DespairEntry;
import com.moetoku.domain.model.entry.DespairLevel;
import com.moetoku.domain.model.entry.EntryId;
import com.moetoku.domain.model.entry.MemberName;
import org.springframework.stereotype.Component;

@Component
public class EntryMapper {

    public DespairEntryJpaEntity toJpaEntity(DespairEntry entry) {
        return new DespairEntryJpaEntity(
            entry.getId().value(),
            entry.getMemberName().value(),
            (short) entry.getLevel().value(),
            entry.getComment(),
            entry.getRecordedAt()
        );
    }

    public DespairEntry toDomain(DespairEntryJpaEntity entity) {
        return DespairEntry.reconstruct(
            EntryId.of(entity.getId()),
            MemberName.of(entity.getMemberName()),
            DespairLevel.of(entity.getLevel()),
            entity.getComment(),
            entity.getRecordedAt()
        );
    }
}
