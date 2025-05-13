import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGeneratedAppContext } from '@/contexts/GeneratedAppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Optional: for styling

const GeneratedAppPage: React.FC = () => {
  const { appName } = useParams<{ appName: string }>();
  const { getAppByName } = useGeneratedAppContext();
  const appData = appName ? getAppByName(appName) : undefined;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // The requirement "ensure the iframe on the new dedicated page still loads its content only once"
  // is typically met if the component instance itself is not re-created.
  // If the router unmounts and remounts this page, the iframe will reload.
  // For true "load once and never again even if page is revisited",
  // the iframe state or the iframe itself would need to be managed outside this component,
  // e.g. lifted higher or using a keep-alive mechanism not standard in React Router v6 without extra libraries.
  // Given the context, we'll assume standard component lifecycle.

  if (!appName) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Application name not provided in the URL.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appData) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Application Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No generated application found with the name: {appName}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { generatedScriptUrl, appIcon } = appData;

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex items-center mb-4">
        {appIcon && <img src={appIcon} alt={appName} className="w-8 h-8 mr-2" />}
        <h1 className="text-2xl font-bold">{appName}</h1>
      </div>
      <iframe
        ref={iframeRef}
        src={generatedScriptUrl}
        title={appName}
        className="w-full h-full border-0 flex-grow"
        // sandbox="allow-scripts allow-same-origin" // Consider security implications
      />
    </div>
  );
};

export default GeneratedAppPage;