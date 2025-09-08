package com.sammeydan.resumeanalyzer.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResult {
    private String resumeId;
    private List<ParsedSection> sections;
    private int overallScore;
    private int atsCompatibility;
    private List<String> keywordMatches;
    private List<String> missingKeywords;
    private List<String> recommendations;
    private LocalDateTime createdAt;
}
