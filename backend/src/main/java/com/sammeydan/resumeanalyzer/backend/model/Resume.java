package com.sammeydan.resumeanalyzer.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resume {
    private String id;
    private String name;
    private LocalDateTime uploadDate;
    private String status; // 'processing', 'completed', 'error'
    private Integer atsScore;
    private Integer suggestions;
    private Long fileSize;
    private String fileType;
}
