
import { useState } from "react";
import Header from "@/components/Header";
import VideoInput from "@/components/VideoInput";
import AnalysisMetrics, { AnalysisMetric } from "@/components/AnalysisMetrics";
import AnalysisReport from "@/components/AnalysisReport";
import type { AnalysisResult } from "@/components/VideoInput";

const Index = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    const metrics: AnalysisMetric[] = [
      {
        name: "Posture",
        score: result.metrics.posture,
        description: result.sections.posture[0].content,
        color: "from-teal-400 to-teal-600",
      },
      {
        name: "Confidence",
        score: result.metrics.confidence,
        description: result.sections.confidence[0].content,
        color: "from-blue-400 to-blue-600",
      },
      {
        name: "Eye Contact",
        score: result.metrics.eyeContact,
        description: result.sections.eyeContact[0].content,
        color: "from-purple-400 to-purple-600",
      },
    ];

    setAnalysisData(result);
    setIsAnalyzed(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-blue-600 text-transparent bg-clip-text">
            Analyze Your Video Presentation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload or record a video to get detailed insights on your posture, confidence, and eye contact.
          </p>
        </div>
        
        <VideoInput onVideoSubmit={handleAnalysisComplete} />
        
        {isAnalyzed && analysisData && (
          <>
            <AnalysisMetrics metrics={[
              {
                name: "Posture",
                score: analysisData.metrics.posture,
                description: analysisData.sections.posture[0].content,
                color: "from-teal-400 to-teal-600",
              },
              {
                name: "Confidence",
                score: analysisData.metrics.confidence,
                description: analysisData.sections.confidence[0].content,
                color: "from-blue-400 to-blue-600",
              },
              {
                name: "Eye Contact",
                score: analysisData.metrics.eyeContact,
                description: analysisData.sections.eyeContact[0].content,
                color: "from-purple-400 to-purple-600",
              },
            ]} />
            <AnalysisReport sections={analysisData.sections} />
          </>
        )}
      </main>
      
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Posture Peek &copy; 2025 | Video Analysis Tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
