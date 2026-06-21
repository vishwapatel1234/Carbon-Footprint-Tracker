import { useState, useEffect, useCallback } from 'react';
import { getHistory, saveEntry, getProfile, saveProfile, clearHistory as clearStorage } from '../utils/storage.js';
import { calculateStreak, calculateTrend } from '../utils/carbon.js';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [streak, setStreak] = useState(0);
  const [trend, setTrend] = useState(0);

  const loadData = useCallback(() => {
    const hist = getHistory();
    const prof = getProfile();
    setHistory(hist);
    setProfile(prof);
    setStreak(calculateStreak(hist));
    setTrend(calculateTrend(hist));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addEntry = useCallback((entry) => {
    saveEntry(entry);
    loadData();
  }, [loadData]);

  const updateProfile = useCallback((newProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
  }, []);

  const clearAllHistory = useCallback(() => {
    clearStorage();
    loadData();
  }, [loadData]);

  return {
    history,
    profile,
    streak,
    trend,
    addEntry,
    updateProfile,
    clearAllHistory,
    reload: loadData
  };
};
