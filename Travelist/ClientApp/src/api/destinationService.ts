import { CommentType } from '../types/CommentTypes.ts';
import {
  DestinationPreviewType,
  DestinationType,
  CreateDestinationData,
  updateDestinationType,
} from '../types/destinationTypes.ts';

export const queryLocations = async (query: string, count: number, offset: number): Promise<DestinationPreviewType[]> => {
  const baseUrl = 'https://localhost:7011/api/travelentity/filter';
  const url = new URL(baseUrl);

  url.searchParams.append('query', query);
  url.searchParams.append('count', count.toString());
  url.searchParams.append('offset', offset.toString());

  // console.log(url.toString());

  const token = localStorage.getItem('token');
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = (await response.json()) as DestinationPreviewType[];
  return data;
};

export const queryContribution = async (username: string, count: number, offset: number): Promise<DestinationPreviewType[]> => {
  const baseUrl = `https://localhost:7011/api/travelentity/contribution/${username}`;
  const url = new URL(baseUrl);

  url.searchParams.append('count', count.toString());
  url.searchParams.append('offset', offset.toString());

  const token = localStorage.getItem('token');
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = await response.json() as DestinationPreviewType[];
  return data;
};

export const getDestinationCities = async (): Promise<string[]> => {
  const response = await fetch('/api/TravelEntity/locations', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const cities = (await response.json()) as string[];
  return cities;
};

export const createDestination = async (
  data: CreateDestinationData
): Promise<DestinationType> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found in local storage');
  }

  const response = await fetch('/api/TravelEntity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const result = (await response.json()) as DestinationType;
  return result;
};

export const getDestinationById = async (travelEntityId: number): Promise<DestinationType> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/TravelEntity/${travelEntityId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const travelEntity = await response.json() as DestinationType;
  return travelEntity;
};

export const updateDestination = async (destinationData: updateDestinationType) => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/TravelEntity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(destinationData),
  });

  if(!response.ok) {
    throw new Error('Failed to update destination');
  }
  return response.json();
};

export const postComment = async (travelEntityId: number, commentText: string) => {
  const url = `/api/travelentity/comment`;
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content: commentText, travelEntityId })
  });

  if (!response.ok) {
    throw new Error('Failed to post comment');
  }
};
export const fetchComments = async (travelEntityId: number): Promise<CommentType[]> => {
  const response = await fetch(`/api/TravelEntity/comments/${travelEntityId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    // console.log(response.headers.get('content-type'));
    throw new Error('Response is not JSON');
  }
  const comments = await response.json() as CommentType[];
  return comments;
};

export const updateComment = async (commentId: number, content: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/travelentity/comment/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  return response.text();
};

export const deleteComment = async (commentId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/travelentity/comment/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.text();
};

export const deleteDestination = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/TravelEntity/delete/${id}` , {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if(!response.ok) {
    throw new Error('failed to delete destination');
  }

  return response.text();
};