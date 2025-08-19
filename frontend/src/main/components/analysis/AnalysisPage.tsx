import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Lightbulb, FileText } from 'lucide-react';
import { Button } from '../common/button';
import styles from './Analysis.module.css';
import type { AnalysisResult } from '../../models/AnalysisResult';
import type { Resume } from '../../models/Resume';

interface AnalysisPageProps {
    resumeId: string;
}

interface ScoreCardProps {
    title: string;
    score: number;
    icon: React.ReactNode;
    color: string;
}

const ScoreCard = ({ title, score, icon, color }: ScoreCardProps) => (
    <div className={styles.scoreCard} style={{ borderLeftColor: color }}>
        <div className={styles.scoreHeader}>
            <div className={styles.scoreIcon} style={{ color }}>
                {icon}
            </div>
            <h3 className={styles.scoreTitle}>{title}</h3>
        </div>
        <div className={styles.scoreValue} style={{ color }}>
            {score}%
        </div>
    </div>
);

interface RecommendationCardProps {
    recommendations: string[];
}

const RecommendationCard = ({ recommendations }: RecommendationCardProps) => (
    <div className={styles.recommendationCard}>
        <div className={styles.cardHeader}>
            <Lightbulb className={styles.cardIcon} />
            <h3 className={styles.cardTitle}>Priority Recommendations</h3>
        </div>
        <ul className={styles.recommendationList}>
            {recommendations.slice(0, 5).map((rec, index) => (
                <li key={index} className={styles.recommendationItem}>
                    {rec}
                </li>
            ))}
        </ul>
    </div>
);

interface SectionCardProps {
    section: {
        type: string;
        content: string;
        suggestions: string[];
    };
}

const SectionCard = ({ section }: SectionCardProps) => (
    <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
            <FileText className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
            </h4>
        </div>
        <div className={styles.sectionContent}>
            <p className={styles.sectionText}>{section.content}</p>
        </div>
        {section.suggestions.length > 0 && (
            <div className={styles.sectionSuggestions}>
                <h5 className={styles.suggestionsTitle}>Suggestions:</h5>
                <ul className={styles.suggestionsList}>
                    {section.suggestions.map((suggestion, index) => (
                        <li key={index} className={styles.suggestionItem}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

export const AnalysisPage = ({ resumeId }: AnalysisPageProps) => {
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API calls
        // For now, using mock data
        const mockAnalysis: AnalysisResult = {
            resumeId,
            sections: [
                {
                    type: 'summary',
                    content: 'Experienced software engineer with 5+ years in full-stack development...',
                    suggestions: [
                        'Add specific metrics and achievements',
                        'Include industry-specific keywords'
                    ],
                    atsIssues: []
                },
                {
                    type: 'experience',
                    content: 'Senior Developer at Tech Corp (2020-2023)\n- Led team of 5 developers...',
                    suggestions: [
                        'Quantify achievements with numbers',
                        'Use action verbs at the beginning of bullet points'
                    ],
                    atsIssues: []
                },
                {
                    type: 'skills',
                    content: 'JavaScript, React, Node.js, Python, AWS, Docker',
                    suggestions: [
                        'Group skills by category (Frontend, Backend, DevOps)',
                        'Add proficiency levels'
                    ],
                    atsIssues: []
                },
                {
                    type: 'education',
                    content: 'Bachelor of Science in Computer Science\nUniversity of Technology, 2019',
                    suggestions: [
                        'Include GPA if above 3.5',
                        'Add relevant coursework'
                    ],
                    atsIssues: []
                }
            ],
            overallScore: 78,
            atsCompatibility: 82,
            keywordMatches: ['JavaScript', 'React', 'Node.js', 'Python'],
            missingKeywords: ['TypeScript', 'MongoDB', 'CI/CD'],
            recommendations: [
                'Add more quantifiable achievements in experience section',
                'Include industry-specific keywords for better ATS matching',
                'Improve summary section with specific metrics',
                'Group skills by category for better readability',
                'Add relevant certifications if available'
            ],
            createdAt: new Date().toISOString()
        };

        const mockResume: Resume = {
            id: resumeId,
            name: 'Senior Backend Engineer.pdf',
            uploadDate: new Date().toISOString(),
            status: 'completed',
            atsScore: 82,
            suggestions: 5,
        };

        setAnalysis(mockAnalysis);
        setResume(mockResume);
        setLoading(false);
    }, [resumeId]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading analysis...</p>
            </div>
        );
    }

    if (!analysis || !resume) {
        return <div>Analysis not found</div>;
    }

    return (
        <div className={styles.analysisPage}>
            <div className={styles.header}>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>
                <h1 className={styles.pageTitle}>Resume Analysis</h1>
                <div className={styles.resumeInfo}>
                    <span className={styles.resumeName}>{resume.name}</span>
                </div>
            </div>

            <div className={styles.scoreGrid}>
                <ScoreCard
                    title="Overall Score"
                    score={analysis.overallScore}
                    icon={<TrendingUp />}
                    color="#3b82f6"
                />
                <ScoreCard
                    title="ATS Compatibility"
                    score={analysis.atsCompatibility}
                    icon={<Target />}
                    color="#10b981"
                />
            </div>

            <RecommendationCard recommendations={analysis.recommendations} />

            <div className={styles.sectionAnalysis}>
                <h2 className={styles.sectionTitle}>Section by Section Analysis</h2>
                <div className={styles.sectionGrid}>
                    {analysis.sections.map((section, index) => (
                        <SectionCard key={index} section={section} />
                    ))}
                </div>
            </div>
        </div>
    );
}; 