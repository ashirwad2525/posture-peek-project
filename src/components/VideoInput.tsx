
import { useState, useRef } from "react";
import { Upload, Camera, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VideoInput = ({ onVideoSubmit }: { onVideoSubmit: (file: File) => void }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      onVideoSubmit(file);
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
    
    const file = new File([blob], "recording.webm", { type: "video/webm" });
    onVideoSubmit(file);
    
    setRecordedChunks([]);
  };

  const clearVideo = () => {
    setVideoSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
                  <Button onClick={() => onVideoSubmit(new File([], "dummy.mp4"))}>
                    <Play className="h-4 w-4 mr-2" />
                    Analyze Video
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
