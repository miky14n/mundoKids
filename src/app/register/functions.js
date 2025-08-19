export const calculateAge = (dateBorn) => {
  console.log("La fecha de nac", dateBorn);
  if (!dateBorn) return "";
  const today = new Date();
  const birthDate = new Date(dateBorn);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
};
