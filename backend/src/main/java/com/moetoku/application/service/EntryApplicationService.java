package com.moetoku.application.service;

import com.moetoku.application.dto.CreateEntryCommand;
import com.moetoku.application.dto.EntryDto;
import com.moetoku.domain.model.entry.DespairEntry;
import com.moetoku.domain.model.entry.DespairLevel;
import com.moetoku.domain.model.entry.MemberName;
import com.moetoku.domain.repository.EntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class EntryApplicationService {

    private static final ZoneOffset JST_OFFSET = ZoneOffset.ofHours(9);

    private final EntryRepository entryRepository;

    public EntryApplicationService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    @Transactional
    public EntryDto create(CreateEntryCommand command) {
        OffsetDateTime recordedAt = command.recordedDate() != null
            ? command.recordedDate().atTime(LocalTime.MIDNIGHT).atOffset(JST_OFFSET)
            : null;
        DespairEntry entry = DespairEntry.create(
            MemberName.of(command.memberName()),
            DespairLevel.of(command.level()),
            command.comment(),
            recordedAt
        );
        return EntryDto.from(entryRepository.save(entry));
    }

    public List<EntryDto> findAll() {
        return entryRepository.findAll().stream()
            .map(EntryDto::from)
            .toList();
    }

    public List<EntryDto> findByMemberName(String memberName) {
        return entryRepository.findByMemberName(MemberName.of(memberName)).stream()
            .map(EntryDto::from)
            .toList();
    }

    public List<String> findAllMemberNames() {
        return entryRepository.findAllMemberNames().stream()
            .map(name -> name.value())
            .toList();
    }
}
