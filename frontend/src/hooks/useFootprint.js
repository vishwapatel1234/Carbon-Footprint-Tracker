import { useState, useCallback } from 'react';
import { AI_TIMEOUT_MS } from '../utils/constants.js';

export const useFootprint = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsight = useCallback(async (profile, currentEntry, history, breakdown, highestImpactCategory) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/insight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          currentEntry,
          history,
          breakdown,
          highestImpactCategory
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setInsight(data);
      return data;
    } catch (err) {
      console.error('API Fetch Error:', err);
      let errMsg = 'Could not fetch personalized recommendations.';
      if (err.name === 'AbortError') {
        errMsg = 'Request timed out. Please try again.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setInsight(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    insight,
    loading,
    error,
    fetchInsight,
    setInsight
  };
};
