import { Challenge, CreateChallengeData } from '@/types/challenge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const getChallenges = async (token: string): Promise<Challenge[]> => {
  const response = await fetch(`${API_URL}/api/challenges`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch challenges');
  return response.json();
};

export const searchChallenges = async (query: string, token: string): Promise<Challenge[]> => {
  const response = await fetch(`${API_URL}/api/challenges/search?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to search challenges');
  return response.json();
};

export const createChallenge = async (data: CreateChallengeData, token: string): Promise<Challenge> => {
  const queryParams = new URLSearchParams({
    name: data.name,
    goal: data.goal.toString()
  });
  
  const response = await fetch(`${API_URL}/api/challenges?${queryParams}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to create challenge');
  return response.json();
};

export const joinChallenge = async (challengeId: number, email: string, token: string): Promise<Challenge> => {
  const response = await fetch(`${API_URL}/api/challenges/${challengeId}/join?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to join challenge');
  return response.json();
};

export const leaveChallenge = async (challengeId: number, email: string, token: string): Promise<Challenge> => {
  const response = await fetch(`${API_URL}/api/challenges/${challengeId}/leave?email=${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to leave challenge');
  return response.json();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLeaderboard = async (challengeId: number, token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/challenges/${challengeId}/leaderboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
};

export const getUserRanking = async (email: string, challengeId: number, token: string): Promise<number> => {
  const response = await fetch(`${API_URL}/api/challenges/${challengeId}/ranking?email=${encodeURIComponent(email)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to get user ranking');
  const data = await response.json();
  return data.rank;
};