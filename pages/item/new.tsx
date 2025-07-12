import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    image: "",
  });
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/items/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
      }),
    });

    if (res.ok) router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-md w-full max-w-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Add New Item</h1>

        <input type="text" name="title" placeholder="Title" onChange={handleChange} className="input" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="input" required />

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="category" placeholder="Category" onChange={handleChange} className="input" />
          <input type="text" name="type" placeholder="Type (e.g. T-shirt, Jeans)" onChange={handleChange} className="input" />
          <input type="text" name="size" placeholder="Size" onChange={handleChange} className="input" />
          <input type="text" name="condition" placeholder="Condition (e.g. Like New)" onChange={handleChange} className="input" />
        </div>

        <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} className="input" />

        <input type="file" accept="image/*" onChange={handleImage} className="input" />

        {preview && (
          <Image src={preview} alt="Preview" width={300} height={200} className="mx-auto rounded" />
        )}

        <button type="submit" className="bg-black text-white w-full py-2 rounded hover:bg-gray-800">
          Submit Item
        </button>
      </form>
    </div>
  );
}
