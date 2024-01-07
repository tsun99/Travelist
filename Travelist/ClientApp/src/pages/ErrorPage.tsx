import { useRouteError } from 'react-router-dom';

interface ReactRouterError {
  status: number;
  statusText: string;
  internal: boolean;
  data: string;
  error: object;
}

export default function ErrorPage() {
  const error = useRouteError() as ReactRouterError;
  
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="rounded bg-white p-20 shadow-md">
        <h1 className="text-2xl text-black">
          {error.status === 404 ? '404 Page Not Found' : 'An Error Occurred'}
        </h1>
        <p className="mt-2 text-black">
          {error.status === 404 ? 'The page you are looking for could not be found.' : error.statusText}
        </p>
        {error.data && 
          <pre className="bg-gray mt-2 overflow-x-auto p-2">{error.data}</pre>
        }
      </div>
    </div>
  );
}