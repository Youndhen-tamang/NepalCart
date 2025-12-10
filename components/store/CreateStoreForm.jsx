"use client";

import { assets } from "@/assets/assets";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createStore } from "@/fetch/createStore";

export default function CreateStoreForm({ initialStatus = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    image: null,
    imagePreview: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setStoreInfo({ ...storeInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoreInfo({
        ...storeInfo,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Upload to Cloudinary
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      return data.url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    let toastId = toast.loading("Submitting...");

    try {
      let bannerImage = "";

      // Upload image if selected
      if (storeInfo.image) {
        setUploading(true);
        bannerImage = await uploadImage(storeInfo.image);
        setUploading(false);
      }

      // Make API call
      const result = await createStore({
        name: storeInfo.name,
        username: storeInfo.username,
        email: storeInfo.email,
        phone: storeInfo.phone,
        address: storeInfo.address,
        description: storeInfo.description,
        bannerImage,
      });

      if (!result.ok || !result.success) {
        throw new Error(result.message || "Failed to create store");
      }

      toast.success("Store created successfully! Waiting for admin approval.");
      toast.dismiss(toastId);

      // Refresh & Redirect
      setTimeout(() => {
        router.refresh();
        router.push("/create-store");
      }, 1200);

    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Failed to create store");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-6 min-h-[70vh] my-16">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
      >
        <div>
          <h1 className="text-3xl">
            Add Your <span className="text-slate-800 font-medium">Store</span>
          </h1>
          <p className="max-w-lg">
            To become a seller on GoCart, submit your store details for review.
            Your store will be activated after admin verification.
          </p>
        </div>

        {/* Store Logo */}
        <label className="mt-10 cursor-pointer">
          Store Logo
          <Image
            src={storeInfo.imagePreview || assets.upload_area}
            className="rounded-lg mt-2 h-16 w-auto"
            alt="Store logo preview"
            width={150}
            height={100}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>

        {/* Username */}
        <div className="w-full max-w-lg">
          <p className="mb-1">Username</p>
          <input
            name="username"
            onChange={onChangeHandler}
            value={storeInfo.username}
            type="text"
            placeholder="Enter your store username"
            className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
            required
          />
        </div>

        {/* Name */}
        <div className="w-full max-w-lg">
          <p className="mb-1">Name</p>
          <input
            name="name"
            onChange={onChangeHandler}
            value={storeInfo.name}
            type="text"
            placeholder="Enter your store name"
            className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div className="w-full max-w-lg">
          <p className="mb-1">Description</p>
          <textarea
            name="description"
            onChange={onChangeHandler}
            value={storeInfo.description}
            rows={5}
            placeholder="Enter your store description"
            className="border border-slate-300 outline-slate-400 w-full p-2 rounded resize-none"
            required
          />
        </div>

        {/* Email */}
        <div className="w-full max-w-lg">
          <p className="mb-1">Email</p>
          <input
            name="email"
            onChange={onChangeHandler}
            value={storeInfo.email}
            type="email"
            placeholder="Enter your store email"
            className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
            required
          />
        </div>

        {/* Contact Number */}
        <div className="w-full max-w-lg">
          <p className="mb-1">Contact Number</p>
          <input
            name="phone"
            onChange={onChangeHandler}
            value={storeInfo.phone}
            type="text"
            placeholder="Enter your store contact number"
            className="border border-slate-300 outline-slate-400 w-full p-2 rounded"
            required
          />
        </div>

        {/* Address */}
        <div className="w-full max-w-lg">
          <p className="mb-1">Address</p>
          <textarea
            name="address"
            onChange={onChangeHandler}
            value={storeInfo.address}
            rows={5}
            placeholder="Enter your store address"
            className="border border-slate-300 outline-slate-400 w-full p-2 rounded resize-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
