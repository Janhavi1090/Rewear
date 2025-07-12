import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import "./add-item.css";

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
    <div className="add-wrapper">
      <div className="emoji emoji-1">📸</div>
      <div className="emoji emoji-2">🧺</div>
      <div className="emoji emoji-3">🌸</div>
  
      <form onSubmit={handleSubmit} className="add-card">
        <h1>Add New Item</h1>
  
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
  
        <div className="form-grid">
          <input type="text" name="category" placeholder="Category" onChange={handleChange} />
          <input type="text" name="type" placeholder="Type (e.g. T-shirt, Jeans)" onChange={handleChange} />
          <input type="text" name="size" placeholder="Size" onChange={handleChange} />
          <input type="text" name="condition" placeholder="Condition (e.g. Like New)" onChange={handleChange} />
        </div>
  
        <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
  
        <input type="file" accept="image/*" onChange={handleImage} className="file-input" />
  
        {preview && (
          <Image src={preview} alt="Preview" width={300} height={200} className="preview" />
        )}
  
        <button type="submit">✨ Submit Item</button>
      </form>
    </div>
  );
}
