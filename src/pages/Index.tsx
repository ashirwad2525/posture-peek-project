
import { useState } from "react";
import Header from "@/components/Header";
import VideoInput from "@/components/VideoInput";
import AnalysisMetrics, { AnalysisMetric } from "@/components/AnalysisMetrics";
import AnalysisReport from "@/components/AnalysisReport";

// Mock data for demo purposes
const mockMetrics: AnalysisMetric[] = [
  {
    name: "Posture",
    score: 78,
    description: "Your posture is generally good with some room for improvement",
    color: "from-teal-400 to-teal-600",
  },
  {
    name: "Confidence",
    score: 85,
    description: "Your confidence level is high throughout the video",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Eye Contact",
    score: 64,
    description: "Your eye contact could use some improvement",
    color: "from-purple-400 to-purple-600",
  },
];

const mockReportSections = {
  posture: [
    {
      title: "Shoulder Alignment",
      content: "Your shoulders are well aligned for most of the video, showing good upper body posture.",
      type: "success" as const,
    },
    {
      title: "Spine Curvature",
      content: "At times (1:24, 2:35) you tend to lean forward too much, creating excessive curvature in your upper spine.",
      type: "warning" as const,
    },
    {
      title: "Head Position",
      content: "Your head is held at a good angle, which projects confidence and attentiveness.",
      type: "success" as const,
    },
  ],
  confidence: [
    {
      title: "Voice Steadiness",
      content: "Your voice remains steady and clear throughout the presentation.",
      type: "success" as const,
    },
    {
      title: "Hand Gestures",
      content: "Your hand gestures are natural and help emphasize key points effectively.",
      type: "success" as const,
    },
    {
      title: "Pacing",
      content: "You tend to speed up during complex topics. Try to maintain a consistent pace.",
      type: "info" as const,
    },
  ],
  eyeContact: [
    {
      title: "Camera Focus",
      content: "You maintain good eye contact with the camera 64% of the time.",
      type: "info" as const,
    },
    {
      title: "Gaze Distribution",
      content: "Your gaze tends to drift downward when discussing technical details. Try to maintain eye contact even when explaining complex concepts.",
      type: "warning" as const,
    },
    {
      title: "Engagement",
      content: "Your eye contact conveys genuine interest in the subject matter.",
      type: "success" as const,
    },
  ],
  overall: [
    {
      title: "Overall Impression",
      content: "Your presentation conveys professionalism and knowledge. The combination of good posture and confident delivery creates a positive impression.",
      type: "success" as const,
    },
    {
      title: "Areas for Improvement",
      content: "Focus on maintaining consistent eye contact and be mindful of your posture when discussing complex topics.",
      type: "info" as const,
    },
    {
      title: "Key Strengths",
      content: "Natural hand gestures, confident voice modulation, and generally good posture are your key strengths.",
      type: "success" as const,
    },
  ],
};

const Index = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoSubmit = (file: File) => {
    // In a real application, you would upload the file to your backend for analysis
    // For now, we'll simulate the analysis with a loading state
    setIsLoading(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setIsLoading(false);
      setIsAnalyzed(true);
    }, 2000);
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
        
        <VideoInput onVideoSubmit={handleVideoSubmit} />
        
        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Analyzing your video...</p>
          </div>
        )}
        
        {isAnalyzed && (
          <>
            <AnalysisMetrics metrics={mockMetrics} />
            <AnalysisReport sections={mockReportSections} />
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
