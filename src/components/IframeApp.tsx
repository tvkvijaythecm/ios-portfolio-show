import { useState } from "react";

interface IframeAppProps {
  url: string;
  title: string;
}

const IframeApp = ({ url, title }: IframeAppProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-white/20 dark:bg-black/20 backdrop-blur-xl">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground/50"></div>
        </div>
      )}
      <iframe
        src={url}
        title={title}
        className="w-full h-full min-h-[500px] border-0"
        onLoad={() => setLoading(false)}
        allow="geolocation"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default IframeApp;
