package com.moetoku.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateEntryCommand(
    @NotBlank(message = "memberName is required")
    @Size(max = 100, message = "memberName must not exceed 100 characters")
    String memberName,

    @NotNull(message = "level is required")
    @Min(value = 1, message = "level must be at least 1")
    @Max(value = 10, message = "level must be at most 10")
    Integer level,

    String comment
) {}
