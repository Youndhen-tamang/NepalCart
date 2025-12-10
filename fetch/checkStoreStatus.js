export async function checkStoreStatus() {
  try {
    const res = await fetch('/api/store/status', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();
    
    if (!res.ok || !data.success) {
      return { ok: false, hasStore: false, store: null, message: data.message };
    }
    
    return { 
      ok: true, 
      hasStore: data.hasStore || false,
      store: data.store || null,
    };
  } catch (err) {
    return { ok: false, hasStore: false, store: null, message: err.message };
  }
}

