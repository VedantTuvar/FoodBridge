export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatKg = (kg: number | string): string => {
  return `${Number(kg).toFixed(1)} kg`;
};

export const formatMeals = (meals: number | string): string => {
  return `${meals} meals`;
};
