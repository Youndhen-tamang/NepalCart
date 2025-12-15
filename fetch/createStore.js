export async function createStore(payload) {
  try {
    const res = await fetch("/api/store/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",  
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
