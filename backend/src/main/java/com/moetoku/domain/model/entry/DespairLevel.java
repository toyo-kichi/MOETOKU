package com.moetoku.domain.model.entry;

public record DespairLevel(int value) {

    public static final int MIN = 1;
    public static final int MAX = 10;

    public DespairLevel {
        if (value < MIN || value > MAX) {
            throw new IllegalArgumentException(
                "DespairLevel must be between " + MIN + " and " + MAX + ", but was: " + value
            );
        }
    }

    public static DespairLevel of(int value) {
        return new DespairLevel(value);
    }
}
