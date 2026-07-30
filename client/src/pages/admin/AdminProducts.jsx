import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Sparkles, Image, Check, X, Upload } from "lucide-react";
import adminService from "../../services/adminService";
import productService from "../../services/productService";
import { formatINR } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  // New Product Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: 20,
    imageUrl: "",
    shapes: ["Almond", "Coffin", "Square"],
    lengths: ["Medium", "Long"],
    isFeatured: true,
  });

  const availableShapes = ["Square", "Almond", "Coffin", "Stiletto", "Oval", "Round"];
  const availableLengths = ["Short", "Medium", "Long", "Extra Long"];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProducts();
      if (res && res.success) {
        setProducts(res.products || res.data || []);
      }
    } catch (err) {
      console.error("Fetch products error", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats || []);
      if (cats && cats.length > 0) {
        setFormData((prev) => ({ ...prev, category: cats[0]._id }));
      }
    } catch (err) {
      console.error("Categories fetch error", err);
    }
  };

  const handleToggleShape = (shape) => {
    setFormData((prev) => {
      const exists = prev.shapes.includes(shape);
      return {
        ...prev,
        shapes: exists ? prev.shapes.filter((s) => s !== shape) : [...prev.shapes, shape],
      };
    });
  };

  const handleToggleVisibility = async (id) => {
    try {
      const res = await adminService.toggleProductVisibility(id);
      if (res && res.success) {
        toast.success("Product visibility updated!");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product set from catalog?")) return;
    try {
      const res = await adminService.deleteProduct(id);
      if (res && res.success) {
        toast.success("Product set removed!");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in design title and price");
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description || `${formData.name} handcrafted press-on nail set.`);
      fd.append("shortDescription", formData.shortDescription || `${formData.name} press-on set.`);
      fd.append("price", Number(formData.price));
      fd.append("discountPrice", formData.discountPrice ? Number(formData.discountPrice) : "");
      fd.append("category", formData.category || categories[0]?._id);
      fd.append("stock", Number(formData.stock));
      fd.append("shapes", formData.shapes.join(","));
      fd.append("lengths", formData.lengths.join(","));
      fd.append("isFeatured", formData.isFeatured);

      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          fd.append("images", imageFiles[i]);
        }
      } else if (formData.imageUrl) {
        fd.append("imageUrl", formData.imageUrl);
      }

      const res = await adminService.createProduct(fd);
      if (res && res.success) {
        toast.success("✨ New design set is live in the catalog!");
        setIsAddModalOpen(false);
        fetchProducts();
        setImageFiles([]);
        setFormData({
          name: "",
          description: "",
          shortDescription: "",
          price: "",
          discountPrice: "",
          category: categories[0]?._id || "",
          stock: 20,
          imageUrl: "",
          shapes: ["Almond", "Coffin", "Square"],
          lengths: ["Medium", "Long"],
          isFeatured: true,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark-800">Nail Art Studio Catalog</h1>
          <p className="text-dark-400 text-sm">Publish new press-on nail designs & manage live studio inventory.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm shadow-glow-rose">
          <Plus size={18} /> + Add New Product Set
        </button>
      </div>

      {/* Catalog Table Card */}
      <div className="glass-card p-6 border border-rose-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={18} />
          <input
            type="text"
            placeholder="Search catalog by design name..."
            className="input-dark w-full pl-10 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-dark-400">Loading live catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-dark-300">
            <Sparkles size={36} className="mx-auto mb-2 opacity-40" />
            <p>No products match your search. Click "+ Add New Product Set" to publish one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-dark-400 border-b border-rose-100 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Design Set</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Shapes Offered</th>
                  <th className="pb-3">Visibility</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=100"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-rose-100"
                      />
                      <div>
                        <div className="font-bold text-dark-800">{product.name}</div>
                        {product.isFeatured && (
                          <span className="text-[10px] text-gold-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            ⭐ Bestseller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-dark-400">{product.category?.name || "General"}</td>
                    <td className="py-4">
                      <span className="text-rose-500 font-bold">{formatINR(product.discountPrice || product.price)}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-dark-300 line-through ml-2">{formatINR(product.price)}</span>
                      )}
                    </td>
                    <td className="py-4 font-mono font-bold text-dark-400">{product.stock} sets</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {product.shapes?.map((s) => (
                          <span key={s} className="text-[10px] bg-white px-2 py-0.5 rounded text-dark-400 border border-rose-50">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        {product.isActive ? "Live on Store" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(product._id)}
                        className="p-2 rounded-lg bg-white text-dark-400 hover:text-dark-800 hover:bg-rose-50"
                        title="Toggle visibility"
                      >
                        {product.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-dark-800"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* "+ ADD NEW PRODUCT SET" MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-card border border-rose-100 p-6 md:p-8 rounded-3xl space-y-6 my-8 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div>
                <span className="text-xs text-rose-500 font-semibold uppercase tracking-wider">Publish New Design Set</span>
                <h2 className="text-2xl font-bold font-display text-dark-800">+ Add New Product Set</h2>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-dark-400 hover:text-dark-800 rounded-full bg-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-medium text-dark-400 mb-1">Product Title / Set Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavender Velvet Chrome Set"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark w-full text-sm"
                />
              </div>

              {/* Price & Discount Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-400 mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="899"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-dark w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-400 mb-1">Sale / Discount Price (₹)</label>
                  <input
                    type="number"
                    placeholder="699"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="input-dark w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-400 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-dark w-full text-sm"
                  />
                </div>
              </div>

              {/* Category & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-dark w-full text-sm bg-black/30"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-dark-400 mb-2">Upload Product Images (Max 5)</label>
                  <div className="border border-dashed border-rose-200 rounded-2xl p-4 text-center hover:bg-white transition-all relative min-h-24 flex flex-col justify-center items-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const chosenFiles = Array.from(e.target.files);
                        if (chosenFiles.length > 5) {
                          toast.error("You can upload a maximum of 5 images");
                          setImageFiles(chosenFiles.slice(0, 5));
                        } else {
                          setImageFiles(chosenFiles);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={20} className="text-dark-300 mb-1" />
                    <p className="text-dark-800 text-xs font-medium">
                      {imageFiles.length > 0 ? `${imageFiles.length} image(s) selected` : "Select product photos"}
                    </p>
                    <p className="text-[10px] text-dark-400 mt-0.5">
                      {imageFiles.length > 0 ? imageFiles.map(f => f.name).join(', ') : "or drag and drop here"}
                    </p>
                  </div>
                  <div className="mt-2 text-center text-xs text-dark-300">— OR —</div>
                  <label className="block text-xs font-medium text-dark-400 mb-1 mt-2">External Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="input-dark w-full text-sm"
                  />
                </div>
              </div>

              {/* Shapes Offered Checkboxes */}
              <div>
                <label className="block text-xs font-medium text-dark-400 mb-2">Shapes Offered</label>
                <div className="flex flex-wrap gap-2">
                  {availableShapes.map((shape) => {
                    const isSelected = formData.shapes.includes(shape);
                    return (
                      <button
                        type="button"
                        key={shape}
                        onClick={() => handleToggleShape(shape)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? "bg-rose-500 text-dark-800 border-rose-500 shadow-glow-rose"
                            : "bg-white text-dark-400 border-rose-100 hover:text-dark-800"
                        }`}
                      >
                        {isSelected && "✓ "} {shape}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-medium text-dark-400 mb-1">Short Description / Catchphrase</label>
                <input
                  type="text"
                  placeholder="Lavender base with 3D chrome details — ultra elegant"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="input-dark w-full text-sm"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-rose-500 focus:ring-rose-500 bg-black"
                />
                <label htmlFor="isFeatured" className="text-xs text-dark-400 cursor-pointer">
                  Feature on Homepage Bestsellers section ⭐
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-rose-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2">
                  {isSubmitting ? "Publishing..." : "✨ Publish Design Set Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
