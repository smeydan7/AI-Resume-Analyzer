import styles from './Analysis.module.css';

export const EmptyAnalysis = () => {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
                <h1 className={styles.emptyTitle}>No analysis selected</h1>
                <p className={styles.emptyMessage}>
                    Select a resume from your dashboard to view detailed analysis
                </p>
            </div>
        </div>
    );
}; 