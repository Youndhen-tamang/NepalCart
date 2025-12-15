"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StoreAddProduct() {

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty & Health",
    "Toys & Games",
    "Sports & Outdoors",
    "Books & Media",
    "Food & Drink",
    "Hobbies & Crafts",
    "Others",
  ];

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });

  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    discoutedPrice: 0,
    slug: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------- INPUT HANDLER ---------- */
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setProductInfo({ ...productInfo, [name]: value });
  };

  /* ---------- IMAGE HANDLER ---------- */
  const handleImageChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages({ ...images, [key]: file });
  };

  /* ---------- UPLOAD IMAGE ---------- */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Image upload failed");
    }

    return data.url || data.urls?.[0];
  };

  const uploadImages = async () => {
    const files = Object.values(images).filter(Boolean);
    return await Promise.all(files.map(uploadImage));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Adding Product...");

    try {
      setUploading(true);
      const imageUrls = await uploadImages();
      setUploading(false);

      if (!imageUrls.length) {
        throw new Error("Please upload at least one image");
      }

      const payload = {
        title: productInfo.title,
        description: productInfo.description,
        price: Number(productInfo.price),
        discountPrice: Number(productInfo.discoutedPrice),
        category: productInfo.category,
        images: imageUrls,
        slug: productInfo.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      toast.success("Product added successfully");
      toast.dismiss(toastId);

      setProductInfo({
        title: "",
        description: "",
        price: 0,
        category: "",
        discoutedPrice: 0,
        slug: "",
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });

    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  /* ---------- JSX (UNCHANGED) ---------- */
  return (
    <form
      onSubmit={onSubmitHandler}
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        Add New <span className="text-slate-800 font-medium">Products</span>
      </h1>

      <p className="mt-7">Product Images</p>

      <div htmlFor="" className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className="h-15 w-auto border border-slate-200 rounded cursor-pointer"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.upload_area
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`images${key}`}
              onChange={(e) => handleImageChange(e, key)}
              hidden
            />
          </label>
        ))}
      </div>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Name
        <input
          type="text"
          name="title"
          onChange={onChangeHandler}
          value={productInfo.title}
          placeholder="Enter product name"
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
          required
        />
      </label>

      <label htmlFor="" className="flex flex-col gap-2 my-6 ">
        Description
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Enter product description"
          rows={5}
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none"
          required
        />
      </label>

      <div className="flex gap-5">
        <label htmlFor="" className="flex flex-col gap-2 ">
          Actual Price ($)
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
            required
          />
        </label>
        <label htmlFor="" className="flex flex-col gap-2 ">
          Offer Price ($)
          <input
            type="number"
            name="discoutedPrice"
            onChange={onChangeHandler}
            value={productInfo.discoutedPrice}
            placeholder="0"
            rows={5}
            className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none"
          />
        </label>
      </div>

      <select
        onChange={(e) =>
          setProductInfo({ ...productInfo, category: e.target.value })
        }
        value={productInfo.category}
        className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded"
        required
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <br />

      <button
        disabled={loading || uploading}
        className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition"
      >
        {uploading ? "Uploading..." : loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
