

export async function sendRegisteration({name,email,password,phone,role}) {
  try {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role }),
    });

    const data = await res.json();
    return {ok:res.ok,...data}
} catch (err) {
  return { ok: false, message: err.message };
} 
}