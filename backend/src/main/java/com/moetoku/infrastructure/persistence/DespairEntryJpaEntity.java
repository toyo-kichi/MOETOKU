package com.moetoku.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "despair_entries")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DespairEntryJpaEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "member_name", nullable = false, length = 100)
    private String memberName;

    @Column(name = "level", nullable = false)
    private short level;

    @Column(name = "comment")
    private String comment;

    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt;
}
