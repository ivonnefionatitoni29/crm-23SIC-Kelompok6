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
    imageUrl: "", // To display current image in edit mode or hold a new image URL preview
  });
  const [imageFile, setImageFile] = useState(null); // State for the selected image file
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

  // Handle form input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImageFile(selectedFile);
      // Optional: Update formData.imageUrl for instant preview (using blob URL)
      setFormData((prev) => ({ ...prev, imageUrl: URL.createObjectURL(selectedFile) }));
    } else {
      // If user clears file input (e.g., clicks 'x' on file input)
      setImageFile(null);
      // Only clear formData.imageUrl if it was a preview URL.
      // If it's an existing product's URL, we keep it until 'Remove Current Image' button is pressed
      // or a new file is uploaded.
      if (formData.imageUrl.startsWith("blob:")) {
         setFormData((prev) => ({ ...prev, imageUrl: "" }));
      }
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    if (!file) {
      console.log("UploadImage: No file provided, returning null.");
      return null;
    }

    const fileExt = file.name.split('.').pop();
    // Generate a unique file name to avoid conflicts, using timestamp and a random string
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    // Define the full path in the bucket. Storing directly in root of 'product-images'
    const filePath = `${fileName}`;

    console.log(`UploadImage: Attempting to upload file '${file.name}' to path '${filePath}' in bucket 'product-images'.`);

    const { data, error } = await supabase.storage
      .from('product-images') // Ensure this bucket exists and is correctly named
      .upload(filePath, file, {
        cacheControl: '3600', // Cache for 1 hour
        upsert: false // Do not overwrite if file with same name exists (though our naming prevents this)
      });

    if (error) {
      console.error('UploadImage: Error during Supabase Storage upload:', error.message, error);
      // More specific error handling for common issues
      if (error.statusCode === '404') {
        throw new Error('Failed to upload image: Storage bucket "product-images" not found. Please check its name or if it exists.');
      }
      if (error.statusCode === '403') {
        throw new Error('Failed to upload image: Permission denied. Check your Storage RLS policies for INSERT.');
      }
      throw new Error('Failed to upload image: ' + error.message);
    }

    // Get the public URL for the newly uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (publicUrlData && publicUrlData.publicUrl) {
      console.log('UploadImage: Image uploaded successfully, public URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } else {
      console.error('UploadImage: Failed to get public URL for uploaded image. Public URL data:', publicUrlData);
      throw new Error('Failed to get public URL for image after upload.');
    }
  };

  // Delete image from Supabase Storage
  const deleteImage = async (imageUrl) => {
    if (!imageUrl || imageUrl.startsWith("blob:")) { // Don't try to delete a blob URL
      console.log("DeleteImage: No valid image URL provided for deletion (or it's a blob URL), skipping.");
      return;
    }

    try {
      // Supabase public URL format is typically:
      // [SUPABASE_URL]/storage/v1/object/public/[BUCKET_NAME]/[FILE_PATH_WITHIN_BUCKET]
      // We need to extract [FILE_PATH_WITHIN_BUCKET]
      const urlParts = imageUrl.split('/');
      const publicIndex = urlParts.indexOf('public');

      if (publicIndex === -1 || publicIndex + 2 >= urlParts.length) {
        console.warn('DeleteImage: Could not parse image URL for deletion: Invalid URL format or missing parts.', imageUrl);
        return;
      }

      const bucketName = urlParts[publicIndex + 1]; // e.g., 'product-images'
      const filePathInBucket = urlParts.slice(publicIndex + 2).join('/'); // The rest is the file path

      if (!bucketName || !filePathInBucket) {
        console.warn('DeleteImage: Extracted bucketName or filePathInBucket is empty. Skipping deletion.', { bucketName, filePathInBucket });
        return;
      }

      console.log(`DeleteImage: Attempting to delete file '${filePathInBucket}' from bucket '${bucketName}'.`);

      const { error } = await supabase.storage
        .from(bucketName) // Use the extracted bucket name
        .remove([filePathInBucket]); // Supabase storage remove expects an array of paths

      if (error) {
        console.error('DeleteImage: Error deleting old image from storage:', error.message);
        // Important: Do not throw an error here if the image might genuinely not exist (e.g., already deleted manually)
        // or if it's a 404 (file not found in storage).
        // If it's a 403 (permission denied), you might want to re-evaluate policies.
      } else {
        console.log('DeleteImage: Old image deleted successfully:', filePathInBucket);
      }
    } catch (e) {
      console.error('DeleteImage: Error processing image URL for deletion:', e.message, e);
    }
  };

  // Handle adding or updating a product
  const handleAddOrUpdateProduct = async () => {
    const { name, description, price, oldPrice, rating } = formData;

    if (!name.trim() || !price) {
      setError("Product name and price must be filled.");
      return;
    }

    setLoading(true);
    setError(null);

    let finalImageUrl = formData.imageUrl; // Start with the URL currently in the form (could be existing, or a new preview blob URL)

    try {
      if (imageFile) {
        // Scenario 1: A new image file has been selected
        console.log("handleAddOrUpdateProduct: New image file selected.");
        // If editing and there was an existing image before new selection, delete it first
        // (Only delete if it's a real URL, not a blob preview URL)
        if (editId && formData.imageUrl && !formData.imageUrl.startsWith("blob:")) {
            console.log("handleAddOrUpdateProduct: Editing and old image URL exists. Deleting old image...");
            await deleteImage(formData.imageUrl);
        }
        // Upload the new image
        finalImageUrl = await uploadImage(imageFile);
      } else if (editId && formData.imageUrl === "" && products.find(p => p.id === editId)?.image_url) {
        // Scenario 2: User explicitly cleared the image field for an existing product
        // (no new file, formData.imageUrl is empty, but product originally had an image)
        console.log("handleAddOrUpdateProduct: Editing: User explicitly removed existing image. Deleting from storage.");
        const originalProduct = products.find(p => p.id === editId);
        if (originalProduct && originalProduct.image_url) {
          await deleteImage(originalProduct.image_url);
        }
        finalImageUrl = null; // Set image_url in DB to NULL
      } else if (!imageFile && formData.imageUrl === "") {
        // Scenario 3: No new image file selected and formData.imageUrl is also empty (e.g., adding new product without image)
        console.log("handleAddOrUpdateProduct: No image selected for new product or existing product, setting image_url to NULL.");
        finalImageUrl = null; // Ensure it's explicitly null in DB
      }
      // Scenario 4: No new imageFile, and formData.imageUrl is already a valid existing URL (user didn't change image)
      // In this case, finalImageUrl correctly retains its value from formData.imageUrl.

      const productData = {
        name: name.trim(),
        // Store description as NULL if it's empty, otherwise trim it
        description: description.trim() === "" ? null : description.trim(),
        price: parseFloat(price),
        old_price: oldPrice ? parseFloat(oldPrice) : null,
        rating: rating ? parseFloat(rating) : null,
        image_url: finalImageUrl, // Use the final determined image URL (can be null)
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
      setImageFile(null); // Clear image file input
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
      // First, get the product data to retrieve the image_url before deleting the record
      console.log(`HandleDelete: Fetching product with ID ${itemIdToDelete} to get image_url.`);
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', itemIdToDelete)
        .single(); // Use .single() as we're expecting one record

      if (fetchError) {
        console.error('HandleDelete: Error fetching product for deletion:', fetchError.message);
        throw new Error('Failed to fetch product for deletion.');
      }

      // Delete the product record from the database
      console.log(`HandleDelete: Deleting product record with ID ${itemIdToDelete}.`);
      const { error: deleteRecordError } = await supabase
        .from('products')
        .delete()
        .eq('id', itemIdToDelete);

      if (deleteRecordError) {
        console.error('HandleDelete: Error deleting product record:', deleteRecordError.message);
        throw new Error('Failed to delete product record.');
      }

      // If the product had an image_url, delete it from storage
      if (productData && productData.image_url) {
        console.log('HandleDelete: Product had an image, attempting to delete from storage.');
        await deleteImage(productData.image_url);
      } else {
        console.log('HandleDelete: Product had no image_url, skipping storage deletion.');
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
        setImageFile(null);
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
    setImageFile(null); // Clear any previously selected file when starting edit
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
    setImageFile(null); // Clear image file input
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
              setImageFile(null); // Reset file
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
            <div className="mb-6">
              <label htmlFor="image" className="block mb-2 font-medium text-blue-800">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              {/* Show current image if exists (not a new preview blob) AND no new file selected yet */}
              {(formData.imageUrl && !imageFile && !formData.imageUrl.startsWith("blob:")) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Image:</p>
                  <img src={formData.imageUrl} alt="Current Product" className="mt-1 w-24 h-24 object-cover rounded-md shadow-sm" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, imageUrl: "" })); // Clear the URL in form data
                      setImageFile(null); // Ensure no new file is pending upload either
                      // Note: Actual deletion from storage happens on Save Changes if imageUrl becomes empty
                    }}
                    className="mt-1 ml-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove Current Image
                  </button>
                </div>
              )}
              {/* Show preview of newly selected image (blob URL) */}
              {imageFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">New Image Preview:</p>
                  <img src={URL.createObjectURL(imageFile)} alt="New Product Preview" className="mt-1 w-24 h-24 object-cover rounded-md shadow-sm" />
                </div>
              )}
               {/* Show No Image text if no image is set and no new file is selected */}
              {!formData.imageUrl && !imageFile && (
                <div className="mt-2 text-sm text-gray-500">No image selected.</div>
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