import { useState, useRef } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { usePostData } from '../../hooks/usePostData';
import { useUpdateData } from '../../hooks/useUpdateData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AllProducts = () => {
  const [productForm, setProductForm] = useState({
    productId: '',
    name: '',
    availableAmount: '',
    description: '',
    price: '',
    category: '',
    image: '',
    shortDescription:''
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  

  // Fetch categories and products
  const { data: categories = [], isLoading: isCategoriesLoading } = useFetchData('categories', '/allcategories');
  const { data: products = [], isLoading, isError, refetch } = useFetchData('products', '/products');

  // Mutation hooks
  const { mutate: addProduct, isPending: isAdding } = usePostData('/add-product');
  const { mutate: updateProduct } = useUpdateData('/update-product');
  const { mutate: deleteProduct } = useDeleteData('/delete-product');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check if file is an image
  if (!file.type.match('image.*')) {
    toast.error('Please select an image file');
    return;
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    setIsUploading(true);

    // Upload to ImgBB
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const imgbbData = await imgbbResponse.json();

    if (imgbbData.success) {
      setProductForm(prev => ({ ...prev, image: imgbbData.data.url }));
      toast.success('Image uploaded successfully!');
    } else {
      throw new Error(imgbbData.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    toast.error(error.message || 'Failed to upload image');
  } finally {
    setIsUploading(false);
  }
};


  const handleRemoveImage = () => {
    setProductForm(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!productForm.name || !productForm.productId) {
      toast.error('Product ID and Name are required');
      return;
    }

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price) || 0,
      availableAmount: productForm.availableAmount || 0,
      category: productForm.category || null,
      image: productForm.image || null
    };

    if (editMode) {
      updateProduct(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            toast.success('Product updated successfully!');
            refetch();
            resetForm();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
          }
        }
      );
    } else {
      addProduct(payload, {
        onSuccess: () => {
          toast.success('Product added successfully!');
          refetch();
          resetForm();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to add product');
        }
      });
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      productId: product.productId,
      name: product.name,
      availableAmount: product.availableAmount,
      description: product.description,
      price: product.price.toString(),
      category: product.category?._id || product.category || '',
      image: product.image || '',
      shortDescription: product.shortDescription || ''
    });
    setEditMode(true);
    setEditId(product._id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Product?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id, {
          onSuccess: () => {
            toast.success('Product deleted!');
            refetch();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
          }
        });
      }
    });
  };

  const resetForm = () => {
    setProductForm({
      productId: '',
      name: '',
      availableAmount: '',
      description: '',
      price: '',
      category: '',
      image: '',
      shortDescription: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown Category';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={isCategoriesLoading}
        >
          Add New Product
        </button>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <input
                  type="text"
                  name="productId"
                  value={productForm.productId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="PROD-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Product
                </label>
                <input
                  type="text"
                  name="availableAmount"
                  value={productForm.availableAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0"
                  
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={productForm.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Short Description...."
                 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                {productForm.image ? (
                  <div className="mt-2">
                    <img 
                      src={productForm.image} 
                      alt="Product preview" 
                      className="h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload an image</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                            accept="image/*"
                            disabled={isUploading}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {isUploading && (
                        <p className="text-xs text-blue-500">Uploading image...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isAdding || isUploading}
                className={`px-4 py-2 text-white rounded-md ${
                  isAdding || isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editMode ? 'Update' : isAdding ? 'Adding...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">Loading products...</div>
        ) : isError ? (
          <div className="p-6 text-center text-red-500">
            Failed to load products. Please try again.
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No products found. Add your first product!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.availableAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availableAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default AllProducts;