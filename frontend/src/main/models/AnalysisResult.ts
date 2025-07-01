import type {ParsedSection} from "./ParsedResume.ts";

export interface AnalysisResult {
    resumeId: string;
    sections: ParsedSection[];
    overallScore: number;
    atsCompatibility: number;
    keywordMatches: string[];
    missingKeywords: string[];
    recommendations: string[];
    createdAt: string;
}