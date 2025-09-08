package com.sammeydan.resumeanalyzer.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParsedSection {
    private String type; // 'education', 'experience', 'skills', 'summary'
    private String content;
    private List<String> suggestions;
    private List<String> atsIssues;
}
