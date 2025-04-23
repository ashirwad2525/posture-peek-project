
import { useState, useRef } from "react";
import { Upload, Camera, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface AnalysisResult {
  metrics: {
    posture: number;
    confidence: number;
    eyeContact: number;
  };
  sections: {
    posture: Array<{
      title: string;
      content: string;
      type: "info" | "success" | "warning";
    }>;
    confidence: Array<{
      title: string;
      content: string;
      type: "info" | "success" | "warning";
    }>;
    eyeContact: Array<{
      title: string;
      content: string;
      type: "info" | "success" | "warning";
    }>;
    overall: Array<{
      title: string;
      content: string;
      type: "info" | "success" | "warning";
    }>;
  };
}

const VideoInput = ({ onVideoSubmit }: { onVideoSubmit: (result: AnalysisResult) => void }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access your camera. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  };

  const saveRecording = () => {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    setVideoSrc(url);
    
    setRecordedChunks([]);
  };

  const clearVideo = () => {
    setVideoSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const { data, error } = await supabase.functions.invoke('analyze-video', {
        body: formData
      });

      if (error) throw error;

      onVideoSubmit(data);
      toast.success("Video analysis completed!");
    } catch (error) {
      console.error("Analysis error:", error);
      
      // Fallback to mock data if the edge function fails
      toast.error("Analysis service unavailable. Using sample data instead.");
      const mockData = await simulateVideoAnalysis();
      onVideoSubmit(mockData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateVideoAnalysis = async (): Promise<AnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const getRandomScore = () => Math.floor(Math.random() * 36) + 60;

    const posture = getRandomScore();
    const confidence = getRandomScore();
    const eyeContact = getRandomScore();

    const getAnalysisType = (score: number): "success" | "warning" | "info" => {
      if (score >= 80) return "success";
      if (score >= 70) return "warning";
      return "info";
    };

    const generateFeedback = (category: string, score: number) => {
      const type = getAnalysisType(score);
      const strength = score >= 80 ? "strong" : score >= 70 ? "moderate" : "needs improvement";
      
      return [
        {
          title: `${category} Overview`,
          content: `Your ${category.toLowerCase()} shows ${strength} performance with a score of ${score}%.`,
          type
        },
        {
          title: `Key Observations`,
          content: generateKeyObservation(category, score),
          type
        },
        {
          title: `Improvement Tips`,
          content: generateImprovementTip(category, score),
          type: "info" as const
        }
      ];
    };

    return {
      metrics: {
        posture,
        confidence,
        eyeContact
      },
      sections: {
        posture: generateFeedback("Posture", posture),
        confidence: generateFeedback("Confidence", confidence),
        eyeContact: generateFeedback("Eye Contact", eyeContact),
        overall: [
          {
            title: "Overall Performance",
            content: `Your presentation shows ${calculateOverallPerformance([posture, confidence, eyeContact])} results with an average score of ${Math.floor((posture + confidence + eyeContact) / 3)}%.`,
            type: getAnalysisType(Math.floor((posture + confidence + eyeContact) / 3))
          },
          {
            title: "Key Strengths",
            content: generateStrengths([posture, confidence, eyeContact]),
            type: "success" as const
          },
          {
            title: "Areas for Improvement",
            content: generateWeaknesses([posture, confidence, eyeContact]),
            type: "info" as const
          }
        ]
      }
    };
  };

  const generateKeyObservation = (category: string, score: number): string => {
    const observations = {
      Posture: [
        "Excellent upright position maintained throughout.",
        "Generally good posture with occasional slouching.",
        "Frequent shifting and inconsistent posture noticed."
      ],
      Confidence: [
        "Strong, assured presence throughout the presentation.",
        "Showed confidence with room for improvement.",
        "Signs of nervousness apparent in delivery."
      ],
      "Eye Contact": [
        "Consistent and engaging eye contact maintained.",
        "Moderate eye contact with occasional avoidance.",
        "Limited eye contact, often looking away."
      ]
    };
    
    const index = score >= 80 ? 0 : score >= 70 ? 1 : 2;
    return observations[category as keyof typeof observations][index];
  };

  const generateImprovementTip = (category: string, score: number): string => {
    const tips = {
      Posture: [
        "Keep up the great posture! Try varying your stance occasionally.",
        "Practice standing straight while presenting. Set reminders to check your posture.",
        "Focus on keeping your shoulders back and spine straight. Consider recording practice sessions."
      ],
      Confidence: [
        "Continue building on your confident delivery. Try new presentation techniques.",
        "Take deep breaths before speaking. Practice power poses before presentations.",
        "Start with small group presentations to build confidence. Record and review your presentations."
      ],
      "Eye Contact": [
        "Excellent eye contact! Try varying your gaze pattern more.",
        "Practice maintaining eye contact for longer periods. Use the triangle technique.",
        "Focus on looking at different areas of your audience. Practice with friends."
      ]
    };
    
    const index = score >= 80 ? 0 : score >= 70 ? 1 : 2;
    return tips[category as keyof typeof tips][index];
  };

  const calculateOverallPerformance = (scores: number[]): string => {
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (average >= 80) return "excellent";
    if (average >= 70) return "good";
    return "fair";
  };

  const generateStrengths = (scores: number[]): string => {
    const categories = ["posture", "confidence", "eye contact"];
    const strengths = categories.filter((_, i) => scores[i] >= 75);
    if (strengths.length === 0) return "Shows potential for improvement across all areas.";
    return `Strong performance in ${strengths.join(" and ")}.`;
  };

  const generateWeaknesses = (scores: number[]): string => {
    const categories = ["posture", "confidence", "eye contact"];
    const weaknesses = categories.filter((_, i) => scores[i] < 75);
    if (weaknesses.length === 0) return "No significant areas of concern. Focus on maintaining consistency.";
    return `Focus on improving ${weaknesses.join(" and ")}.`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">Upload or Record Your Video</h2>
          
          {!videoSrc && !isRecording ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 h-32 rounded-xl"
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 mb-2" />
                  <span>Upload Video</span>
                </div>
              </Button>
              
              <Button 
                onClick={startRecording} 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-32 rounded-xl"
              >
                <div className="flex flex-col items-center">
                  <Camera className="h-10 w-10 mb-2" />
                  <span>Record Video</span>
                </div>
              </Button>
              
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
          ) : (
            <div className="w-full relative">
              <video 
                ref={videoRef}
                src={isRecording ? undefined : videoSrc || undefined}
                className="w-full rounded-lg border border-gray-200"
                controls={!isRecording}
                autoPlay={isRecording}
                muted={isRecording}
              />
              
              {isRecording ? (
                <div className="flex justify-center gap-4 mt-4">
                  <Button variant="destructive" onClick={stopRecording}>
                    Stop Recording
                  </Button>
                </div>
              ) : videoSrc ? (
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={clearVideo}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button 
                    onClick={() => {
                      // Get the actual video file
                      if (fileInputRef.current?.files?.[0]) {
                        analyzeVideo(fileInputRef.current.files[0]);
                      } else if (recordedChunks.length > 0) {
                        const blob = new Blob(recordedChunks, { type: "video/webm" });
                        const file = new File([blob], "recording.webm", { type: "video/webm" });
                        analyzeVideo(file);
                      } else {
                        // Create a dummy file for testing if no real file is available
                        fetch(videoSrc || "")
                          .then(res => res.blob())
                          .then(blob => {
                            const file = new File([blob], "video.mp4", { type: "video/mp4" });
                            analyzeVideo(file);
                          })
                          .catch(err => {
                            console.error("Error creating file from video source:", err);
                            // Fallback to an empty file if we can't get the blob
                            const emptyFile = new File([new Blob()], "empty.mp4", { type: "video/mp4" });
                            analyzeVideo(emptyFile);
                          });
                      }
                    }}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Analyze Video
                      </>
                    )}
                  </Button>
                </div>
              ) : recordedChunks.length > 0 ? (
                <div className="flex justify-center gap-4 mt-4">
                  <Button onClick={saveRecording}>
                    Save Recording
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoInput;
