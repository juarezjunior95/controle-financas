export const fetchAPI = async (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1';
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (error) {
    console.error('API Fetch failed', error);
    return null;
  }
};
