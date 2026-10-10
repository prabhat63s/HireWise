import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalyticsData, Question } from '@/types';

interface AutoTableJsPDF extends jsPDF {
    lastAutoTable: { finalY: number };
}

export const generatePDF = (
    candidateInfo: AnalyticsData['candidate_info'],
    score: number,
    questions: Question[],
    correctCount: number,
    avgTime: number,
    totalTime: number,
    analytics: AnalyticsData['notes_analysis']
) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("HireWise: Technical Interview Assessment Report", 20, 20);

    // Candidate Info
    doc.setFontSize(12);
    doc.text(`Candidate: ${candidateInfo.name}`, 20, 40);
    doc.text(`Role: ${candidateInfo.role}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Score: ${score.toFixed(1)}%`, 20, 70);

    // Stats
    autoTable(doc, {
        startY: 80,
        head: [['Metric', 'Value']],
        body: [
            ['Total Questions', questions.length],
            ['Correct Answers', correctCount],
            ['Average Time', `${avgTime.toFixed(1)}s`],
            ['Total Time', `${totalTime.toFixed(1)}s`],
        ],
    });

    // AI Analysis
    if (analytics) {
        let yPos = (doc as AutoTableJsPDF).lastAutoTable.finalY + 20;

        doc.setFontSize(16);
        doc.text("AI Analysis", 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.text("Strengths:", 20, yPos);
        yPos += 10;
        analytics.strengths.forEach(s => {
            doc.text(`• ${s}`, 25, yPos);
            yPos += 7;
        });

        yPos += 5;
        doc.text("Areas for Improvement:", 20, yPos);
        yPos += 10;
        analytics.areas_of_improvement.forEach(s => {
            doc.text(`• ${s}`, 25, yPos);
            yPos += 7;
        });
    }

    doc.save(`interview-report-${candidateInfo.name.replace(/\s+/g, '_')}.pdf`);
};
