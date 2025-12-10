export async function createStore({ name, username, email, phone, address, description, bannerImage }) {
  try {
    const res = await fetch('/api/store/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, phone, address, description, bannerImage }),
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

