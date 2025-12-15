"use client";

import { useEffect, useState } from "react";
import {
  fetchOrders,
  fetchOrderById,
  fetchProfile,
  updateProfile,
  fetchAddresses,
  saveAddress,
  deleteAddress,
  fetchWishlist,
  removeWishlistItem,
  fetchSupportTickets,
  createSupportTicket,
} from "@/fetch/customer";

const fallbackOrders = [
  { id: "ord_1", total: 129.5, status: "DELIVERED", createdAt: "2025-01-10" },
  { id: "ord_2", total: 79.99, status: "SHIPPED", createdAt: "2025-01-08" },
];

const fallbackProfile = {
  name: "Customer",
  email: "user@example.com",
  phone: "",
};

const fallbackAddresses = [
  { id: "addr_1", line1: "123 Main St", city: "Kathmandu", country: "NP" },
];

const fallbackWishlist = [
  { id: "wish_1", name: "Sample Product", price: 49.99 },
];

const fallbackTickets = [
  { id: "tkt_1", subject: "Sample ticket", status: "open" },
];

const SectionCard = ({ id, title, children, actions }) => (
  <section
    id={id}
    className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {actions}
    </div>
    {children}
  </section>
);

export default function DashboardModules() {
  return (
    <div className="space-y-6">
      <OverviewStrip />
      <OrdersPanel />
      <ProfilePanel />
      <AddressesPanel />
      <WishlistPanel />
      <SupportPanel />
      <ActivityPanel />
    </div>
  );
}

function OverviewStrip() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then((res) => {
      setOrders(res.ok ? res.data?.orders || [] : fallbackOrders);
    });
  }, []);

  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const pending = orders.filter((o) => o.status !== "DELIVERED").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        label="Total Orders"
        value={orders.length || fallbackOrders.length}
      />
      <SummaryCard label="Delivered" value={delivered} tone="success" />
      <SummaryCard label="In Progress" value={pending} tone="warn" />
      <SummaryCard label="Wishlist Items" value={fallbackWishlist.length} />
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600 bg-emerald-50"
      : tone === "warn"
      ? "text-amber-600 bg-amber-50"
      : "text-slate-700 bg-slate-50";

  return (
    <div
      className={`rounded-xl border border-slate-200 px-4 py-3 shadow-sm ${toneClass}`}
    >
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetchOrders();
      setOrders(res.ok ? res.data?.orders || [] : fallbackOrders);
      setLoading(false);
    };
    load();
  }, []);

  const handleSelect = async (orderId) => {
    setSelected({ loading: true });
    const res = await fetchOrderById(orderId);
    setSelected(res.ok ? res.data?.order : null);
  };

  return (
    <SectionCard id="orders" title="Recent Orders">
      {loading ? (
        <p className="text-sm text-slate-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-slate-500">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          <div className="space-y-3">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => handleSelect(order.id)}
                className="w-full text-left border border-slate-200 rounded-lg p-3 hover:border-green-500 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    #{order.id}
                  </span>
                  <span className="text-sm text-slate-500">
                    {order.createdAt}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-sm">
                  <span className="text-slate-700">${order.total}</span>
                  <span className="text-emerald-600 font-medium">
                    {order.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="border border-dashed border-slate-200 rounded-lg p-3 min-h-[160px]">
            {!selected ? (
              <p className="text-sm text-slate-500">
                Select an order to see details.
              </p>
            ) : selected.loading ? (
              <p className="text-sm text-slate-500">Loading details...</p>
            ) : (
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">
                  Order #{selected.id}
                </h3>
                <p className="text-sm text-slate-600">
                  Status: {selected.status}
                </p>
                <p className="text-sm text-slate-600">
                  Total: ${selected.total}
                </p>
                <p className="text-sm text-slate-600">
                  Items:{" "}
                  {selected.items?.length || selected.orderItems?.length || 0}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function ProfilePanel() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile().then((res) => {
      if (res.ok && res.data?.profile) setProfile(res.data.profile);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("Saving...");
    const res = await updateProfile(profile);
    setMessage(res.ok ? "Profile updated" : res.message || "Failed to update");
  };

  return (
    <SectionCard id="profile" title="Profile">
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="Name"
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="Email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          type="email"
        />
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="Phone"
          value={profile.phone || ""}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700"
        >
          Save
        </button>
      </form>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </SectionCard>
  );
}

function AddressesPanel() {
  const [addresses, setAddresses] = useState(fallbackAddresses);
  const [form, setForm] = useState({ line1: "", city: "", country: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAddresses().then((res) => {
      if (res.ok && res.data?.addresses?.length) {
        setAddresses(res.data.addresses);
      }
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("Saving address...");
    const res = await saveAddress(form);
    if (res.ok && res.data?.address) {
      setAddresses((prev) => [...prev, res.data.address]);
      setForm({ line1: "", city: "", country: "" });
      setMessage("Saved");
    } else {
      setMessage(res.message || "Failed to save");
    }
  };

  const remove = async (id) => {
    setMessage("Removing...");
    const res = await deleteAddress(id);
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      setMessage("Removed");
    } else {
      setMessage(res.message || "Failed to remove");
    }
  };

  return (
    <SectionCard id="addresses" title="Addresses">
      <div className="space-y-2">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2"
          >
            <div className="text-sm text-slate-700">
              <p>{addr.line1}</p>
              <p className="text-slate-500">
                {addr.city}, {addr.country}
              </p>
            </div>
            <button
              onClick={() => remove(addr.id)}
              className="text-sm text-rose-600 hover:text-rose-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="Address"
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
          required
        />
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        />
        <button
          type="submit"
          className="sm:col-span-3 bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700"
        >
          Add Address
        </button>
      </form>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </SectionCard>
  );
}

function WishlistPanel() {
  const [items, setItems] = useState(fallbackWishlist);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWishlist().then((res) => {
      if (res.ok && res.data?.items) setItems(res.data.items);
    });
  }, []);

  const removeItem = async (id) => {
    setMessage("Removing...");
    const res = await removeWishlistItem(id);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage("Removed");
    } else {
      setMessage(res.message || "Failed to remove");
    }
  };

  return (
    <SectionCard id="wishlist" title="Wishlist">
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No wishlist items yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2"
            >
              <div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">${item.price}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </SectionCard>
  );
}

function SupportPanel() {
  const [tickets, setTickets] = useState(fallbackTickets);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSupportTickets().then((res) => {
      if (res.ok && res.data?.tickets) setTickets(res.data.tickets);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");
    const res = await createSupportTicket(form);
    if (res.ok && res.data?.ticket) {
      setTickets((prev) => [res.data.ticket, ...prev]);
      setForm({ subject: "", message: "" });
      setMessage("Ticket submitted");
    } else {
      setMessage(res.message || "Failed to submit");
    }
  };

  return (
    <SectionCard id="support" title="Support & Returns">
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="border border-slate-200 rounded-lg px-3 py-2"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <textarea
          className="border border-slate-200 rounded-lg px-3 py-2 sm:col-span-2"
          placeholder="How can we help?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-green-700 sm:col-span-2"
        >
          Submit Ticket
        </button>
      </form>
      <div className="space-y-2">
        {tickets.map((tkt) => (
          <div
            key={tkt.id}
            className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2"
          >
            <div>
              <p className="font-semibold text-slate-800">{tkt.subject}</p>
              <p className="text-sm text-slate-500">Status: {tkt.status}</p>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </SectionCard>
  );
}

function ActivityPanel() {
  return (
    <SectionCard id="activity" title="Recent Activity">
      <p className="text-sm text-slate-500">
        Activity feed coming soon. For now, you can review orders, wishlist
        changes, and support tickets above.
      </p>
    </SectionCard>
  );
}
