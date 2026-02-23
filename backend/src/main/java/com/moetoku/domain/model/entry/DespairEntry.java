package com.moetoku.domain.model.entry;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class DespairEntry {

    private static final ZoneOffset JST_OFFSET = ZoneOffset.ofHours(9);

    private final EntryId id;
    private final MemberName memberName;
    private final DespairLevel level;
    private final String comment;
    private final OffsetDateTime recordedAt;

    private DespairEntry(
        EntryId id,
        MemberName memberName,
        DespairLevel level,
        String comment,
        OffsetDateTime recordedAt
    ) {
        this.id = id;
        this.memberName = memberName;
        this.level = level;
        this.comment = comment;
        this.recordedAt = recordedAt;
    }

    public static DespairEntry create(MemberName memberName, DespairLevel level, String comment) {
        return create(memberName, level, comment, null);
    }

    public static DespairEntry create(
        MemberName memberName,
        DespairLevel level,
        String comment,
        OffsetDateTime recordedAt
    ) {
        return new DespairEntry(
            EntryId.generate(),
            memberName,
            level,
            comment,
            recordedAt != null ? recordedAt : OffsetDateTime.now(JST_OFFSET)
        );
    }

    public static DespairEntry reconstruct(
        EntryId id,
        MemberName memberName,
        DespairLevel level,
        String comment,
        OffsetDateTime recordedAt
    ) {
        return new DespairEntry(id, memberName, level, comment, recordedAt);
    }

    public EntryId getId() { return id; }
    public MemberName getMemberName() { return memberName; }
    public DespairLevel getLevel() { return level; }
    public String getComment() { return comment; }
    public OffsetDateTime getRecordedAt() { return recordedAt; }
}
