package com.moetoku.application.service;

import com.moetoku.application.dto.CreateEntryCommand;
import com.moetoku.application.dto.EntryDto;
import com.moetoku.domain.model.entry.DespairEntry;
import com.moetoku.domain.model.entry.DespairLevel;
import com.moetoku.domain.model.entry.MemberName;
import com.moetoku.domain.repository.EntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class EntryApplicationService {

    private final EntryRepository entryRepository;

    public EntryApplicationService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    @Transactional
    public EntryDto create(CreateEntryCommand command) {
        DespairEntry entry = DespairEntry.create(
            MemberName.of(command.memberName()),
            DespairLevel.of(command.level()),
            command.comment()
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
}
