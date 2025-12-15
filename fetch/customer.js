const apiGet = async (path) => {
  try {
    const res = await fetch(path, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return { ok: true, data };
  } catch (err) {
    return { ok: false, message: err.message };
  }
};

const apiSend = async (path, method, body = {}) => {
  try {
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return { ok: true, data };
  } catch (err) {
    return { ok: false, message: err.message };
  }
};

export const fetchOrders = () => apiGet("/api/customer/orders");
export const fetchOrderById = (id) => apiGet(`/api/customer/orders/${id}`);
export const fetchProfile = () => apiGet("/api/auth/user/me");
export const updateProfile = (payload) =>
  apiSend("/api/customer/profile", "PATCH", payload);
export const fetchAddresses = () => apiGet("/api/customer/addresses");
export const saveAddress = (payload) =>
  apiSend("/api/customer/addresses", "POST", payload);
export const deleteAddress = (id) =>
  apiSend(`/api/customer/addresses/${id}`, "DELETE");
export const fetchWishlist = () => apiGet("/api/customer/wishlist");
export const removeWishlistItem = (id) =>
  apiSend(`/api/customer/wishlist/${id}`, "DELETE");
export const fetchSupportTickets = () => apiGet("/api/customer/support");
export const createSupportTicket = (payload) =>
  apiSend("/api/customer/support", "POST", payload);
