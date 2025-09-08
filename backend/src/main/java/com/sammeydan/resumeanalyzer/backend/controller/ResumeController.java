package com.sammeydan.resumeanalyzer.backend.controller;

import com.sammeydan.resumeanalyzer.backend.model.AnalysisResult;
import com.sammeydan.resumeanalyzer.backend.model.Resume;
import com.sammeydan.resumeanalyzer.backend.service.ResumeParsingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to access
public class ResumeController {
    
    @Autowired
    private ResumeParsingService resumeParsingService;
    
    @PostMapping("/resumes")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || 
                (!contentType.equals("application/pdf") && 
                 !contentType.equals("application/msword") && 
                 !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                return ResponseEntity.badRequest().body("Invalid file type. Please upload PDF, DOC, or DOCX files.");
            }
            
            // Check file size (10MB limit)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size exceeds 10MB limit");
            }
            
            // Create resume object
            Resume resume = new Resume();
            resume.setId(UUID.randomUUID().toString());
            resume.setName(file.getOriginalFilename());
            resume.setUploadDate(LocalDateTime.now());
            resume.setStatus("processing");
            resume.setFileSize(file.getSize());
            resume.setFileType(contentType);
            
            // Parse the resume
            AnalysisResult analysisResult = resumeParsingService.parseResume(
                file.getInputStream(), 
                file.getOriginalFilename(), 
                jobDescription
            );
            
            // Update resume status
            resume.setStatus("completed");
            resume.setAtsScore(analysisResult.getAtsCompatibility());
            resume.setSuggestions(analysisResult.getRecommendations().size());
            
            // Return both resume and analysis result
            return ResponseEntity.ok()
                .body(new ResumeUploadResponse(resume, analysisResult));
                
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unexpected error: " + e.getMessage());
        }
    }
    
    @GetMapping("/resumes/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable String id) {
        // TODO: Implement resume retrieval from database
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/resumes/{id}/analysis")
    public ResponseEntity<AnalysisResult> getAnalysis(@PathVariable String id) {
        // TODO: Implement analysis retrieval from database
        return ResponseEntity.notFound().build();
    }
    
    // Response wrapper class
    public static class ResumeUploadResponse {
        private Resume resume;
        private AnalysisResult analysisResult;
        
        public ResumeUploadResponse(Resume resume, AnalysisResult analysisResult) {
            this.resume = resume;
            this.analysisResult = analysisResult;
        }
        
        public Resume getResume() { return resume; }
        public void setResume(Resume resume) { this.resume = resume; }
        
        public AnalysisResult getAnalysisResult() { return analysisResult; }
        public void setAnalysisResult(AnalysisResult analysisResult) { this.analysisResult = analysisResult; }
    }
}
