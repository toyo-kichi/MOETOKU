package com.moetoku.application.dto;

import com.moetoku.domain.model.entry.DespairEntry;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EntryDto(
    UUID id,
    String memberName,
    int level,
    String comment,
    OffsetDateTime recordedAt
) {
    public static EntryDto from(DespairEntry entry) {
        return new EntryDto(
            entry.getId().value(),
            entry.getMemberName().value(),
            entry.getLevel().value(),
            entry.getComment(),
            entry.getRecordedAt()
        );
    }
}
