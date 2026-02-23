package com.moetoku.domain.repository;

import com.moetoku.domain.model.entry.DespairEntry;
import com.moetoku.domain.model.entry.MemberName;

import java.util.List;

public interface EntryRepository {

    DespairEntry save(DespairEntry entry);

    List<DespairEntry> findAll();

    List<DespairEntry> findByMemberName(MemberName memberName);
}
