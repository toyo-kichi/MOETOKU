package com.moetoku.interfaces.rest;

import com.moetoku.application.dto.CreateEntryCommand;
import com.moetoku.application.dto.EntryDto;
import com.moetoku.application.service.EntryApplicationService;
import com.moetoku.interfaces.rest.response.Result;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "http://localhost:4200")
public class EntryController {

    private final EntryApplicationService service;

    public EntryController(EntryApplicationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Result<EntryDto> create(@Valid @RequestBody CreateEntryCommand command) {
        return Result.ok(service.create(command));
    }

    @GetMapping
    public Result<List<EntryDto>> findEntries(
        @RequestParam(required = false) String memberName
    ) {
        if (memberName != null && !memberName.isBlank()) {
            return Result.ok(service.findByMemberName(memberName));
        }
        return Result.ok(service.findAll());
    }
}
