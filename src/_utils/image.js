export const getImageUrl = (
  path,
  placeholder = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80"
) => {
  if (!path) return placeholder;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const backendUrl = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
    : "http://localhost:8000";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${backendUrl}/storage/${cleanPath}`;
};
