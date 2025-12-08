export async function sendLogout() {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }
}
