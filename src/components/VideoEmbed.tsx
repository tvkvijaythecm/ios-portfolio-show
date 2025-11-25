interface VideoEmbedProps {
  url: string;
  title: string;
}

const VideoEmbed = ({ url, title }: VideoEmbedProps) => {
  const getEmbedUrl = (url: string) => {
    // YouTube URL conversion
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo URL conversion
    if (url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm">
      <iframe
        src={getEmbedUrl(url)}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoEmbed;
