package com.moetoku.domain.model.entry;

public record MemberName(String value) {

    public MemberName {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("MemberName must not be blank");
        }
        if (value.length() > 100) {
            throw new IllegalArgumentException("MemberName must not exceed 100 characters");
        }
    }

    public static MemberName of(String value) {
        return new MemberName(value);
    }
}
