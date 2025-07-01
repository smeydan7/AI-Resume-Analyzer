
export interface ParsedSection {
    type: 'education' | 'experience' | 'skills' | 'summary';
    content: string;
    suggestions: string[];
    atsIssues: string[];
}