export function getUserRole() {
try {
const storedUser = localStorage.getItem("user");


if (!storedUser) {
  return "";
}

const user = JSON.parse(storedUser);

// Adjust these fields if your login response uses a different structure.
const role =
  user?.role ||
  user?.roles?.[0] ||
  user?.authorities?.[0]?.authority ||
  "";

return String(role)
  .replace(/^ROLE_/i, "")
  .toUpperCase();


} catch (error) {
console.error("Could not read user role:", error);
return "";
}
}

export function isAdminUser() {
return getUserRole() === "ADMIN";
}
