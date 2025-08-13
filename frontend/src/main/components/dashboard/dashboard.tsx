import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Plus } from 'lucide-react';

import styles from './Dashboard.module.css';
import { Button } from '../common/button';
import type { Resume, ResumeStats } from '../../models/Resume';

interface ResumeCardProps {
    resume: Resume;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
}

const ResumeCard = ({ resume, onView, onDelete }: ResumeCardProps) => {
    const formattedDate = new Date(resume.uploadDate).toLocaleDateString();

    return (
        <div className={styles.item}>
            <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{resume.name}</span>
                <span className={styles.itemMeta}>Uploaded {formattedDate}</span>
                <div className={styles.badges}>
                    <span className={styles.score}>ATS {resume.atsScore ?? 0}%</span>
                    <span className={styles.badge}>{resume.suggestions ?? 0} suggestions</span>
                    <span className={styles.badge}>{resume.status}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <Button variant="secondary" size="sm" onClick={() => onView(resume.id)}>
                    <Eye className="h-4 w-4" /> View details
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(resume.id)}>
                    <Trash2 className="h-4 w-4" /> Delete
                </Button>
            </div>
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: number | string;
}

const StatCard = ({ label, value }: StatCardProps) => (
    <div className={styles.kpiCard}>
        <div className={styles.kpiLabel}>{label}</div>
        <div className={styles.kpiValue}>{value}</div>
    </div>
);

export const Dashboard = () => {
    const navigate = useNavigate();

    // TODO replace with backend call. Seed with demo data for now.
    const [resumes, setResumes] = useState<Resume[]>([
        {
            id: '1',
            name: 'Senior Backend Engineer.pdf',
            uploadDate: new Date().toISOString(),
            status: 'completed',
            atsScore: 82,
            suggestions: 5,
        },
        {
            id: '2',
            name: 'Data Scientist Resume.pdf',
            uploadDate: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed',
            atsScore: 74,
            suggestions: 8,
        },
        {
            id: '3',
            name: 'Frontend Developer.docx',
            uploadDate: new Date(Date.now() - 3 * 86400000).toISOString(),
            status: 'processing',
            atsScore: 0,
            suggestions: 0,
        },
    ]);

    const stats: ResumeStats = useMemo(() => {
        const total = resumes.length;
        const completed = resumes.filter(r => r.status === 'completed');
        const avgScore = completed.length
            ? Math.round(
                completed.reduce((sum, r) => sum + (r.atsScore ?? 0), 0) / completed.length
              )
            : 0;
        return {
            total,
            completed: completed.length,
            processing: resumes.filter(r => r.status === 'processing').length,
            avgScore,
        };
    }, [resumes]);

    const handleView = (id: string) => {
        navigate('/analysis', { state: { resumeId: id } });
    };

    const handleDelete = (id: string) => {
        setResumes(prev => prev.filter(r => r.id !== id));
    };

    return (
        <section className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>Resume Dashboard</h1>
                <Button to="/upload" variant="primary">
                    <Plus className="h-4 w-4" /> Upload New Resume
                </Button>
            </div>

            <div className={styles.kpiGrid}>
                <StatCard label="Total Resumes" value={stats.total} />
                <StatCard label="Average ATS Score" value={`${stats.avgScore}%`} />
                <StatCard label="Processing" value={stats.processing} />
            </div>

            <div className={styles.list}>
                {resumes.map((resume) => (
                    <ResumeCard
                        key={resume.id}
                        resume={resume}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </section>
    );
};
