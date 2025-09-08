package com.sammeydan.resumeanalyzer.backend.service;

import com.sammeydan.resumeanalyzer.backend.model.AnalysisResult;
import com.sammeydan.resumeanalyzer.backend.model.ParsedSection;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class ResumeParsingService {
    
    private final Tika tika = new Tika();
    
    public AnalysisResult parseResume(InputStream fileStream, String fileName, String jobDescription) {
        try {
            // Extract text from the file
            String resumeText = tika.parseToString(fileStream);
            
            // Parse sections
            List<ParsedSection> sections = parseSections(resumeText);
            
            // Analyze ATS compatibility
            int atsScore = calculateATSScore(resumeText, sections);
            
            // Extract keywords and match with job description
            List<String> keywordMatches = new ArrayList<>();
            List<String> missingKeywords = new ArrayList<>();
            
            if (jobDescription != null && !jobDescription.trim().isEmpty()) {
                analyzeKeywords(resumeText, jobDescription, keywordMatches, missingKeywords);
            }
            
            // Generate recommendations
            List<String> recommendations = generateRecommendations(sections, atsScore, keywordMatches, missingKeywords);
            
            // Calculate overall score
            int overallScore = calculateOverallScore(atsScore, sections.size(), keywordMatches.size());
            
            return new AnalysisResult(
                UUID.randomUUID().toString(),
                sections,
                overallScore,
                atsScore,
                keywordMatches,
                missingKeywords,
                recommendations,
                LocalDateTime.now()
            );
            
        } catch (IOException | TikaException e) {
            throw new RuntimeException("Failed to parse resume: " + e.getMessage(), e);
        }
    }
    
    private List<ParsedSection> parseSections(String resumeText) {
        List<ParsedSection> sections = new ArrayList<>();
        
        // Parse different sections using regex patterns
        sections.addAll(parseSectionByPattern(resumeText, "experience|work history|employment", "experience"));
        sections.addAll(parseSectionByPattern(resumeText, "education|academic|degree", "education"));
        sections.addAll(parseSectionByPattern(resumeText, "skills|technical skills|competencies", "skills"));
        sections.addAll(parseSectionByPattern(resumeText, "summary|objective|profile|about", "summary"));
        
        return sections;
    }
    
    private List<ParsedSection> parseSectionByPattern(String text, String pattern, String type) {
        List<ParsedSection> sections = new ArrayList<>();
        Pattern sectionPattern = Pattern.compile("(?i)\\b(" + pattern + ")\\b[\\s\\S]*?(?=\\n\\s*\\n|\\n\\s*[A-Z][a-z]+:|$)", Pattern.MULTILINE);
        
        java.util.regex.Matcher matcher = sectionPattern.matcher(text);
        while (matcher.find()) {
            String content = matcher.group().trim();
            if (content.length() > 20) { // Only include substantial sections
                sections.add(new ParsedSection(
                    type,
                    content,
                    generateSuggestions(content, type),
                    identifyATSIssues(content)
                ));
            }
        }
        
        return sections;
    }
    
    private List<String> generateSuggestions(String content, String type) {
        List<String> suggestions = new ArrayList<>();
        
        switch (type) {
            case "experience":
                if (!content.toLowerCase().contains("achieved") && !content.toLowerCase().contains("increased")) {
                    suggestions.add("Add quantifiable achievements to demonstrate impact");
                }
                if (!content.toLowerCase().contains("action verbs")) {
                    suggestions.add("Use strong action verbs to start each bullet point");
                }
                break;
            case "skills":
                if (content.split(",").length < 5) {
                    suggestions.add("Consider adding more relevant skills");
                }
                break;
            case "summary":
                if (content.length() < 50) {
                    suggestions.add("Expand your professional summary to 2-3 sentences");
                }
                break;
        }
        
        return suggestions;
    }
    
    private List<String> identifyATSIssues(String content) {
        List<String> issues = new ArrayList<>();
        
        // Check for common ATS issues
        if (content.contains("•") || content.contains("◦")) {
            issues.add("Replace bullet symbols with standard dashes or numbers");
        }
        if (content.contains("&")) {
            issues.add("Spell out 'and' instead of using '&' symbol");
        }
        if (content.contains("'") && !content.contains("'s")) {
            issues.add("Avoid contractions - spell out words completely");
        }
        
        return issues;
    }
    
    private int calculateATSScore(String resumeText, List<ParsedSection> sections) {
        int score = 0;
        
        // Check for essential sections
        if (sections.stream().anyMatch(s -> "experience".equals(s.getType()))) score += 25;
        if (sections.stream().anyMatch(s -> "education".equals(s.getType()))) score += 20;
        if (sections.stream().anyMatch(s -> "skills".equals(s.getType()))) score += 15;
        if (sections.stream().anyMatch(s -> "summary".equals(s.getType()))) score += 10;
        
        // Check for contact information
        if (resumeText.matches(".*\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b.*")) score += 10; // Phone
        if (resumeText.matches(".*\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b.*")) score += 10; // Email
        
        // Check for keywords density
        String[] keywords = {"experience", "skills", "education", "achievement", "responsibility"};
        long keywordCount = Arrays.stream(keywords)
            .mapToLong(keyword -> resumeText.toLowerCase().split(keyword).length - 1)
            .sum();
        score += Math.min(10, (int) keywordCount * 2);
        
        return Math.min(100, score);
    }
    
    private void analyzeKeywords(String resumeText, String jobDescription, 
                               List<String> keywordMatches, List<String> missingKeywords) {
        Set<String> resumeWords = extractWords(resumeText.toLowerCase());
        Set<String> jobWords = extractWords(jobDescription.toLowerCase());
        
        // Common resume keywords to look for
        Set<String> importantKeywords = new HashSet<>(Arrays.asList(
            "leadership", "management", "project", "team", "development", "analysis",
            "communication", "problem solving", "innovation", "strategy", "results",
            "achievement", "improvement", "efficiency", "collaboration", "initiative"
        ));
        
        for (String keyword : importantKeywords) {
            if (jobWords.contains(keyword)) {
                if (resumeWords.contains(keyword)) {
                    keywordMatches.add(keyword);
                } else {
                    missingKeywords.add(keyword);
                }
            }
        }
    }
    
    private Set<String> extractWords(String text) {
        return new HashSet<>(Arrays.asList(text.split("\\W+")));
    }
    
    private List<String> generateRecommendations(List<ParsedSection> sections, int atsScore, 
                                               List<String> keywordMatches, List<String> missingKeywords) {
        List<String> recommendations = new ArrayList<>();
        
        if (atsScore < 70) {
            recommendations.add("Improve ATS compatibility by adding more keywords and standard formatting");
        }
        
        if (missingKeywords.size() > 3) {
            recommendations.add("Add more relevant keywords from the job description to improve match rate");
        }
        
        if (sections.stream().noneMatch(s -> "summary".equals(s.getType()))) {
            recommendations.add("Add a professional summary section to highlight your key qualifications");
        }
        
        if (sections.stream().anyMatch(s -> s.getAtsIssues().size() > 0)) {
            recommendations.add("Fix formatting issues to improve ATS compatibility");
        }
        
        return recommendations;
    }
    
    private int calculateOverallScore(int atsScore, int sectionCount, int keywordMatches) {
        int sectionScore = Math.min(20, sectionCount * 5);
        int keywordScore = Math.min(10, keywordMatches * 2);
        return (atsScore + sectionScore + keywordScore) / 3;
    }
}