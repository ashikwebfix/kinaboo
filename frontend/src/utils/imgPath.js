export const getImgUrl = (url) => {
  if (!url) return 'https://placehold.co/400x400?text=No+Image';
  
  let fullUrl = url;
  if (!url.startsWith('http')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    fullUrl = `${baseUrl}${cleanUrl}`;
  }

  // Force HTTPS unless we are running locally
  if (!fullUrl.includes('localhost') && !fullUrl.includes('127.0.0.1')) {
    fullUrl = fullUrl.replace(/^http:\/\//i, 'https://');
  }

  return fullUrl;
};
