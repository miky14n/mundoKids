export const calculateAge = (dateBorn) => {
  if (!dateBorn) return "";
  const today = new Date();
  const birthDate = new Date(dateBorn);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  // Ajustar si el cumpleaños aún no ocurrió este año
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
};
