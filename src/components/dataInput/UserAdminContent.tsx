import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IoRefreshOutline } from 'react-icons/io5';
import { useUserStore } from '@/store';

// Import decomposed components
import UserForm from '@/components/features/data-input/components/UserForm';
import UserSearch from '@/components/features/data-input/components/UserSearch';
import UserTable from '@/components/features/data-input/components/UserTable';
import UserErrorAlert from '@/components/features/data-input/components/UserErrorAlert';

// User role types matching the store
type UserRole = 'client' | 'opr' | 'ghw' | 'admin';

const UserAdminContent: React.FC = () => {
  // Zustand store
  const { 
    users, 
    loading, 
    error, 
    searchQuery,
    newUser,
    fetchUsers, 
    searchUsers,
    createUser, 
    setNewUser,
    setSearchQuery,
    clearError,
  } = useUserStore();

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Handlers
  const handleAddUser = async () => {
    await createUser(newUser);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchUsers(searchQuery);
    } else {
      await fetchUsers(); // Reset if empty
    }
  };

  const handleReset = async () => {
    setSearchQuery('');
    await fetchUsers();
  };

  const handleUpdateUserField = (field: keyof typeof newUser, value: any) => {
    setNewUser({ [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-8">
        {/* Error Alert */}
        <UserErrorAlert 
          error={error} 
          onDismiss={clearError} 
        />

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <h1 className="text-3xl font-bold text-gray-800">User Administration</h1>
            </div>
          </div>
        </div>
        
        {/* Add New User Form */}
        <UserForm
          newUser={newUser}
          loading={loading}
          onUpdateField={handleUpdateUserField}
          onSubmit={handleAddUser}
        />

        {/* User Search */}
        <UserSearch
          searchQuery={searchQuery}
          loading={loading}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* User List */}
        <UserTable
          users={users}
          loading={loading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default UserAdminContent;