import { useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { usePostData } from '../../hooks/usePostData';
import { useUpdateData } from '../../hooks/useUpdateData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AllCategories = () => {
  const [categoryForm, setCategoryForm] = useState({ name: '', availableAmount: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const { data: categories = [], isLoading, isError, refetch } = useFetchData('categories', '/allcategories');

  const { mutate: addCategory, isPending: isAdding } = usePostData('/add-category');
  const { mutate: updateCategory } = useUpdateData('/edit-category');
  const { mutate: deleteCategory } = useDeleteData('/delete-category');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!categoryForm.name || !categoryForm.availableAmount) return;

    const payload = {
      name: categoryForm.name,
      availableAmount: categoryForm.availableAmount,
    };

    if (editMode) {
      updateCategory(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            toast.success('Category updated!');
            setShowModal(false);
            setCategoryForm({ name: '', availableAmount: '' });
            setEditMode(false);
            setEditId(null);
          },
        }
      );
    } else {
      addCategory(payload, {
        onSuccess: () => {
          refetch()
          toast.success('Category added!');
          setShowModal(false);
          setCategoryForm({ name: '', availableAmount: '' });
        },
      });
    }
  };

  const handleEdit = (cat) => {
    setCategoryForm({ name: cat.name, availableAmount: cat.availableAmount });
    setEditMode(true);
    setEditId(cat._id);
    setShowModal(true);
  };

 const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteCategory(id, {
        onSuccess: () => {
          refetch()
          toast.success('Category deleted!');
        },
      });
    }
  });
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <button
          onClick={() => {
            setShowModal(true);
            setEditMode(false);
            setCategoryForm({ name: '', availableAmount: '' });
          }}
          className="px-4 py-2 bg-[#167389] text-white rounded-md hover:bg-[#347e8f]"
        >
          Add Category
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Category' : 'Add New Category'}
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="w-full mb-3 px-4 py-2 border rounded-md"
              value={categoryForm.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="availableAmount"
              placeholder="Available Amount"
              className="w-full mb-4 px-4 py-2 border rounded-md"
              value={categoryForm.availableAmount}
              onChange={handleInputChange}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isAdding}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {editMode ? 'Update' : isAdding ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <p className="p-4">Loading categories...</p>
        ) : isError ? (
          <p className="p-4 text-red-500">Failed to load categories.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.availableAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2 gap-2 flex">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:underline block"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:underline block"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
