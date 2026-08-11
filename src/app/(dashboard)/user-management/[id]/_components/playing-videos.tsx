import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VideoPreview = {
  type: "video" | "embed";
  src: string;
  originalUrl: string;
};

const getLinkedVideoPreview = (url: string): VideoPreview | null => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    if (hostname === "youtu.be") {
      const videoId = pathParts[0];
      return videoId
        ? {
            type: "embed",
            src: `https://www.youtube.com/embed/${videoId}`,
            originalUrl: url,
          }
        : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const videoId =
        parsedUrl.searchParams.get("v") ||
        (["shorts", "embed", "live"].includes(pathParts[0])
          ? pathParts[1]
          : null);

      return videoId
        ? {
            type: "embed",
            src: `https://www.youtube.com/embed/${videoId}`,
            originalUrl: url,
          }
        : null;
    }

    if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
      const videoId = pathParts[pathParts.length - 1];
      return videoId && /^\d+$/.test(videoId)
        ? {
            type: "embed",
            src: `https://player.vimeo.com/video/${videoId}`,
            originalUrl: url,
          }
        : null;
    }

    if (hostname === "facebook.com" || hostname === "m.facebook.com") {
      const videosIndex = pathParts.indexOf("videos");
      const videoId =
        parsedUrl.searchParams.get("v") ||
        (videosIndex >= 0 ? pathParts[videosIndex + 1] : null) ||
        (pathParts[0] === "reel" ? pathParts[1] : null);

      if (!videoId) return null;

      const canonicalUrl =
        pathParts[0] === "reel"
          ? `https://www.facebook.com/reel/${videoId}`
          : `https://www.facebook.com/watch/?v=${videoId}`;

      return {
        type: "embed",
        src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonicalUrl)}&show_text=false`,
        originalUrl: url,
      };
    }

    if (hostname === "instagram.com") {
      const postType = pathParts[0];
      const postId = pathParts[1];
      return ["p", "reel", "tv"].includes(postType) && postId
        ? {
            type: "embed",
            src: `https://www.instagram.com/${postType}/${postId}/embed/`,
            originalUrl: url,
          }
        : null;
    }

    if (hostname === "tiktok.com" || hostname === "m.tiktok.com") {
      const videoIndex = pathParts.indexOf("video");
      const videoId = videoIndex >= 0 ? pathParts[videoIndex + 1] : null;
      return videoId
        ? {
            type: "embed",
            src: `https://www.tiktok.com/player/v1/${videoId}`,
            originalUrl: url,
          }
        : null;
    }

    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(parsedUrl.pathname)
      ? { type: "video", src: url, originalUrl: url }
      : null;
  } catch {
    return null;
  }
};

const PlayingVideosPage = ({
  videos = [],
  highlightedUrls = [],
}: {
  videos?: string[];
  highlightedUrls?: string[];
}) => {
  const uploadedVideos: VideoPreview[] = videos.map((url) => ({
    type: "video",
    src: url,
    originalUrl: url,
  }));
  const linkedVideos = highlightedUrls
    .map(getLinkedVideoPreview)
    .filter((video): video is VideoPreview => video !== null);
  const allVideos = [...uploadedVideos, ...linkedVideos].filter(
    (video, index, items) =>
      items.findIndex((item) => item.originalUrl === video.originalUrl) === index,
  );

  if (allVideos.length === 0) {
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
        <CardTitle className="text-2xl font-bold md:text-3xl">
          Playing Highlights Videos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {allVideos.map((video, index) => (
            <div
              key={`${video.originalUrl}-${index}`}
              className="aspect-video overflow-hidden rounded-lg bg-black"
            >
              {video.type === "embed" ? (
                <iframe
                  src={video.src}
                  title={`Playing video ${index + 1}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={video.src}
                  controls
                  preload="metadata"
                  className="h-full w-full object-contain"
                  playsInline
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayingVideosPage;
