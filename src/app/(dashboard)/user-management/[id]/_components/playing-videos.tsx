import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PlayingVideosPage = ({ videos }: { videos?: string[] }) => {
  console.log(videos)
  if (!videos || videos.length === 0) {
    return (
      <Card className="mt-8">
        <CardContent className="py-12 text-center text-muted-foreground">
          No playing videos uploaded yet
        </CardContent>
      </Card>
    );
  }

  return (


    
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold">Playing Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos?.map((videoUrl, index) => (
            <div key={`${videoUrl}-${index}`} className="space-y-3">
              <video src={videoUrl}
                controls
                preload="metadata"
                className="w-full h-full rounded-lg"
                // controlsList="nodownload"
                playsInline />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayingVideosPage;