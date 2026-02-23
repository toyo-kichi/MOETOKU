package com.moetoku.domain.model.entry;

import java.util.UUID;

public record EntryId(UUID value) {

    public EntryId {
        if (value == null) {
            throw new IllegalArgumentException("EntryId value must not be null");
        }
    }

    public static EntryId generate() {
        return new EntryId(UUID.randomUUID());
    }

    public static EntryId of(UUID uuid) {
        return new EntryId(uuid);
    }
}
