import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Ensure this path is correct

export default function AdminProductCRUD() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "", // Optional
    rating: "", // Optional
    imageUrl: "", // Now directly holds the URL string
  });
  // const [imageFile, setImageFile] = useState(null); // No longer needed for file upload
  const [editId, setEditId] = useState(null); // ID of the product being edited
  const [showConfirmModal, setShowConfirmModal] = useState(false); // For delete confirmation
  const [itemIdToDelete, setItemIdToDelete] = useState(null); // ID of the item to delete

  // User and Role check
  useEffect(() => {
    const checkUserAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log('AdminProductCRUD: Current User:', user);

      if (!user) {
        console.log('AdminProductCRUD: No user found, redirecting to login.');
        navigate('/admin-products'); // Adjust to your actual admin login route
        return;
      }

      const userRole = localStorage.getItem('userRole');
      console.log('AdminProductCRUD: User role from localStorage:', userRole);

      if (userRole !== 'admin') {
        alert('Anda tidak memiliki akses sebagai admin ke halaman ini!');
        console.log('AdminProductCRUD: User is not admin, redirecting to /homeuserlogin.');
        navigate('/homeuserlogin'); // Adjust to your actual non-admin home route
      }
    };

    checkUserAndRole();
  }, [navigate]);

  // Function to fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error.message);
      setError('Failed to load products. Please try again.');
    } else {
      setProducts(data);
      console.log('Products fetched:', data);
    }
    setLoading(false);
  };

  // Effect to load products and subscribe to real-time updates
  useEffect(() => {
    fetchProducts();

    // Subscribe to real-time changes on the 'products' table
    const channel = supabase
      .channel('public:products_admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        console.log('Realtime change received for Products (Admin):', payload);
        fetchProducts(); // Re-fetch all products to update the list
      })
      .subscribe();

    // Cleanup function to remove the channel when component unmounts
    return () => {
      console.log('Unsubscribing from products changes.');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle form input changes for text fields (now including imageUrl)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // No longer need handleImageChange, uploadImage, or deleteImage functions
  // as we're directly inputting URLs.

  // Handle adding or updating a product
  const handleAddOrUpdateProduct = async () => {
    const { name, description, price, oldPrice, rating, imageUrl } = formData;

    if (!name.trim() || !price) {
      setError("Product name and price must be filled.");
      return;
    }

    setLoading(true);
    setError(null);

    // The image URL is now directly from formData.imageUrl
    let finalImageUrl = imageUrl.trim() === "" ? null : imageUrl.trim();

    try {
      const productData = {
        name: name.trim(),
        // Store description as NULL if it's empty, otherwise trim it
        description: description.trim() === "" ? null : description.trim(),
        price: parseFloat(price),
        old_price: oldPrice ? parseFloat(oldPrice) : null,
        rating: rating ? parseFloat(rating) : null,
        image_url: finalImageUrl, // Use the URL directly from the form input
      };

      console.log("handleAddOrUpdateProduct: Final product data for DB operation:", productData);

      if (editId !== null) {
        // Update existing product
        console.log("handleAddOrUpdateProduct: Updating product with ID:", editId);
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editId)
          .select(); // Use .select() to get the updated data immediately

        if (error) {
          console.error('handleAddOrUpdateProduct: Error updating product:', error.message);
          setError('Failed to update product. Please try again: ' + error.message);
        } else {
          console.log('handleAddOrUpdateProduct: Product updated successfully:', data);
          alert('Produk berhasil diupdate!');
        }
      } else {
        // Add new product
        console.log("handleAddOrUpdateProduct: Adding new product.");
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select(); // Use .select() to get the inserted data

        if (error) {
          console.error('handleAddOrUpdateProduct: Error adding product:', error.message);
          setError('Failed to add product. Please try again: ' + error.message);
        } else {
          console.log('handleAddOrUpdateProduct: Product added successfully:', data);
          alert('Produk berhasil ditambahkan!');
        }
      }

      // Reset form states after successful operation
      setFormData({ name: "", description: "", price: "", oldPrice: "", rating: "", imageUrl: "" });
      // setImageFile(null); // No longer needed
      setShowForm(false); // Hide the form
      setEditId(null); // Clear edit ID
    } catch (e) {
      console.error("handleAddOrUpdateProduct: Operation failed:", e.message, e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation modal before deleting
  const handleDeleteConfirm = (id) => {
    setItemIdToDelete(id);
    setShowConfirmModal(true);
  };

  // Execute deletion after confirmation
  const handleDelete = async () => {
    if (itemIdToDelete === null) return;

    setLoading(true);
    setError(null);

    try {
      // No need to fetch image_url to delete from storage, as we're not managing storage here.
      // Simply delete the product record from the database.
      console.log(`HandleDelete: Deleting product record with ID ${itemIdToDelete}.`);
      const { error: deleteRecordError } = await supabase
        .from('products')
        .delete()
        .eq('id', itemIdToDelete);

      if (deleteRecordError) {
        console.error('HandleDelete: Error deleting product record:', deleteRecordError.message);
        throw new Error('Failed to delete product record.');
      }

      console.log(`HandleDelete: Product ID ${itemIdToDelete} deleted successfully.`);
      alert('Produk berhasil dihapus!');
    } catch (e) {
      console.error("HandleDelete: Operation failed:", e.message, e);
      setError('Failed to delete data: ' + e.message);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setItemIdToDelete(null);
      // If the product being edited was deleted, reset the form
      if (editId === itemIdToDelete) {
        setEditId(null);
        setShowForm(false);
        setFormData({ name: "", description: "", price: "", oldPrice: "", rating: "", imageUrl: "" });
        // setImageFile(null); // No longer needed
      }
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    console.log("HandleEdit: Editing product:", product);
    setFormData({
      name: product.name,
      description: product.description || "", // Ensure description is a string for input
      price: product.price,
      oldPrice: product.old_price || "", // Use empty string if null
      rating: product.rating || "", // Use empty string if null
      imageUrl: product.image_url || "", // Set existing image URL for display, use "" if null
    });
    // setImageFile(null); // No longer needed
    setEditId(product.id);
    setShowForm(true); // Show the form
    setError(null); // Clear previous errors
  };

  // Handle form or modal cancellation
  const handleCancel = () => {
    console.log("HandleCancel: Cancelling current operation.");
    setShowConfirmModal(false);
    setItemIdToDelete(null);
    setEditId(null); // Reset edit ID
    setShowForm(false); // Hide form
    setFormData({ name: "", description: "", price: "", oldPrice: "", rating: "", imageUrl: "" }); // Reset form data
    // setImageFile(null); // No longer needed
    setError(null); // Clear errors
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
          Product Management
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {loading && (
          <p className="text-center text-lg text-blue-600 mb-4">Loading data...</p>
        )}

        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null); // Ensure add new mode
              setFormData({ name: "", description: "", price: "", oldPrice: "", rating: "", imageUrl: "" }); // Reset form
              // setImageFile(null); // Reset file - no longer needed
              setError(null); // Clear error
            }}
            className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add New Product
          </button>
        )}

        {showForm && (
          <div className="mb-8 p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              {editId !== null ? "Edit Product" : "Add Product"}
            </h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium text-blue-800">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter product name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 font-medium text-blue-800">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block mb-2 font-medium text-blue-800">
                Price (Rp)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., 45000"
                step="0.01"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="oldPrice" className="block mb-2 font-medium text-blue-800">
                Old Price (Rp) (Optional for Discount)
              </label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., 52000"
                step="0.01"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label htmlFor="rating" className="block mb-2 font-medium text-blue-800">
                  Rating (Optional, 0.0 - 5.0)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="e.g., 4.5"
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
            </div>
            {/* New Image URL Input */}
            <div className="mb-6">
              <label htmlFor="imageUrl" className="block mb-2 font-medium text-blue-800">
                Image URL
              </label>
              <input
                type="text" // Changed to text input for URL
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange} // Use the same handleChange
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., https://example.com/image.jpg"
              />
              {/* Show preview of the image URL */}
              {formData.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Image Preview:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Product Preview"
                    className="mt-1 w-24 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/96x96?text=Image+Error'; }} // Fallback for broken images
                  />
                </div>
              )}
               {!formData.imageUrl && (
                 <div className="mt-2 text-sm text-gray-500">No image URL provided.</div>
               )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddOrUpdateProduct}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {editId !== null ? "Save Changes" : "Save Product"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg relative mb-4 text-center">
            <strong className="font-bold">Info:</strong>
            <span className="block sm:inline"> No products available.</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-blue-200 text-sm text-left text-gray-800">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 rounded-tl-xl text-blue-800 font-semibold">Image</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Name</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Description</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Price</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Old Price</th>
                  <th className="py-3 px-4 text-blue-800 font-semibold">Rating</th>
                  <th className="py-3 px-4 rounded-tr-xl text-center text-blue-800 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-3 px-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md shadow-sm"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80x80?text=Image+Error'; }} // Fallback for broken images
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-blue-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {product.description || '-'} {/* Display '-' if description is null/empty */}
                    </td>
                    <td className="py-3 px-4">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4">
                      {product.old_price ? `Rp ${product.old_price.toLocaleString('id-ID')}` : '-'}
                      {product.old_price && product.price < product.old_price && (
                        <span className="ml-2 text-red-500 text-xs font-bold">
                          DISCOUNT {(((product.old_price - product.price) / product.old_price) * 100).toFixed(0)}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{product.rating || '-'}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(product.id)}
                        className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}