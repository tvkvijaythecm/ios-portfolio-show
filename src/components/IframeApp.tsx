import { useState } from "react";

interface IframeAppProps {
  url: string;
  title: string;
}

const IframeApp = ({ url, title }: IframeAppProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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
