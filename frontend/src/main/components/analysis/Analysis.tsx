import { useLocation } from 'react-router-dom';
import { AnalysisPage } from './AnalysisPage';
import { EmptyAnalysis } from './EmptyAnalysis';

export const Analysis = () => {
    const location = useLocation();
    const resumeId = location.state?.resumeId;

    if (!resumeId) {
        return <EmptyAnalysis />;
    }

    return <AnalysisPage resumeId={resumeId} />;
}; 