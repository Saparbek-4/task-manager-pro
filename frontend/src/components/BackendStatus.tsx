import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosInstance";

const MAX_RETRY_COUNT = 20; // Maximum number of retries
const RETRY_INTERVAL = 5000; // 5 seconds between retries

const BackendStatus = () => {
    const [status, setStatus] = useState({
        isUp: false,
        attempts: 0,
        error: null,
        isMaxRetries: false
    });

    const checkBackendStatus = useCallback(async () => {
        try {
            await axios.get("/user/me");
            setStatus(prev => ({ ...prev, isUp: true }));
            return true;
        } catch (error) {
            setStatus(prev => ({
                ...prev,
                attempts: prev.attempts + 1,
                error: error.message,
                isMaxRetries: prev.attempts + 1 >= MAX_RETRY_COUNT
            }));
            return false;
        }
    }, []);

    useEffect(() => {
        // Check immediately on mount
        checkBackendStatus();

        // Then set up interval
        const interval = setInterval(async () => {
            const success = await checkBackendStatus();

            // Clear interval if backend is up or max retries reached
            if (success || status.attempts >= MAX_RETRY_COUNT) {
                clearInterval(interval);
            }
        }, RETRY_INTERVAL);

        // Clean up interval on unmount
        return () => clearInterval(interval);
    }, [checkBackendStatus, status.attempts]);

    // Don't render anything if backend is up
    if (status.isUp) return null;

    // Show max retries message
    if (status.isMaxRetries) {
        return (
            <div className="p-4 bg-red-50 border border-red-300 rounded-md text-center">
                <h3 className="text-lg font-medium text-red-800">Backend Connection Failed</h3>
                <p className="text-red-700 mt-1">
                    Unable to connect after {MAX_RETRY_COUNT} attempts. Please check your connection or contact support.
                </p>
                <button
                    className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => {
                        setStatus({isUp: false, attempts: 0, error: null, isMaxRetries: false});
                        checkBackendStatus();
                    }}
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    // Normal loading state
    return (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-center">
            <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-amber-800 font-medium">
          Connecting to backend... (Attempt {status.attempts + 1}/{MAX_RETRY_COUNT})
        </span>
            </div>
            {status.error && (
                <p className="mt-2 text-amber-700 text-sm">
                    Last error: {status.error}
                </p>
            )}
        </div>
    );
};

export default BackendStatus;