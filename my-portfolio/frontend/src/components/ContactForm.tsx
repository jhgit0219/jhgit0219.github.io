"use client";
import { useState } from "react";
import { isEmptyForm } from "@/utils/validateForm";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const invalid = isEmptyForm(formData);

  return (
    <form
      action="https://formspree.io/f/meokzdwe"
      method="POST"
      onSubmit={(e) => {
        if (invalid) e.preventDefault();
      }}
      className="flex flex-col gap-2 md:gap-2.5 h-full justify-between text-sm"
    >
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="bg-[#0a0a0a] text-gray-100 px-3 py-1.5 rounded-md border border-red-500/20 focus:ring-red-600 focus:outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="bg-[#0a0a0a] text-gray-100 px-3 py-1.5 rounded-md border border-red-500/20 focus:ring-red-600 focus:outline-none"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        className="bg-[#0a0a0a] text-gray-100 px-3 py-2 rounded-md border border-red-500/20 resize-none h-[220px] md:h-[180px] focus:ring-red-600 focus:outline-none"
      />
      <div className="flex justify-start">
        <button
          type="submit"
          disabled={invalid}
          className={`${
            invalid
              ? "bg-red-900/30 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } text-white text-sm px-4 py-1.5 rounded-md transition`}
        >
          Send
        </button>
      </div>
    </form>
  );
}
