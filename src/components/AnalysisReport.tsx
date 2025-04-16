
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, Check, AlertTriangle } from "lucide-react";

interface ReportSection {
  title: string;
  content: string;
  type: "info" | "success" | "warning";
}

interface AnalysisReportProps {
  sections: {
    posture: ReportSection[];
    confidence: ReportSection[];
    eyeContact: ReportSection[];
    overall: ReportSection[];
  };
}

const ReportItem = ({ section }: { section: ReportSection }) => {
  const iconMap = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <Check className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  };

  return (
    <div className="flex space-x-3 py-3">
      <div className="flex-shrink-0">{iconMap[section.type]}</div>
      <div>
        <h4 className="font-medium">{section.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{section.content}</p>
      </div>
    </div>
  );
};

const AnalysisReport = ({ sections }: AnalysisReportProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Detailed Analysis Report</h2>
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="overall">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="posture">Posture</TabsTrigger>
              <TabsTrigger value="confidence">Confidence</TabsTrigger>
              <TabsTrigger value="eyeContact">Eye Contact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overall" className="pt-4">
              {sections.overall.map((section, index) => (
                <div key={index}>
                  <ReportItem section={section} />
                  {index < sections.overall.length - 1 && <Separator />}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="posture" className="pt-4">
              {sections.posture.map((section, index) => (
                <div key={index}>
                  <ReportItem section={section} />
                  {index < sections.posture.length - 1 && <Separator />}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="confidence" className="pt-4">
              {sections.confidence.map((section, index) => (
                <div key={index}>
                  <ReportItem section={section} />
                  {index < sections.confidence.length - 1 && <Separator />}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="eyeContact" className="pt-4">
              {sections.eyeContact.map((section, index) => (
                <div key={index}>
                  <ReportItem section={section} />
                  {index < sections.eyeContact.length - 1 && <Separator />}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisReport;
