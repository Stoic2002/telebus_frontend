import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loading } from '@/components/ui/loading';
import { IoPeopleOutline, IoPersonOutline } from 'react-icons/io5';

// Use consistent types from userStore to avoid conflicts
type UserRole = 'client' | 'opr' | 'ghw' | 'admin';

// Store User interface (compatible with userStore)
interface User {
  _id?: string;
  username: string;
  password?: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  searchQuery: string;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  searchQuery
}) => {
  // Role badge styling
  const getRoleBadgeStyle = (role: UserRole) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      ghw: 'bg-blue-100 text-blue-800',
      opr: 'bg-green-100 text-green-800',
      client: 'bg-gray-100 text-gray-800'
    };
    return styles[role] || styles.client;
  };

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <CardTitle className="text-xl font-semibold flex items-center space-x-3">
              <IoPeopleOutline className="w-6 h-6" />
              <span>User List</span>
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span>Total: {users.length}</span>
            {loading && <Loading size="sm" className="text-white" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loading size="lg" />
              <p className="text-gray-600 font-medium">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <IoPeopleOutline className="w-16 h-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 font-medium">No users found</p>
                <p className="text-gray-500 text-sm">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Add your first user to get started'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <TableHead className="font-semibold text-slate-700">
                    <div className="flex items-center space-x-2">
                      <IoPersonOutline className="w-4 h-4" />
                      <span>Username</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">Password</TableHead>
                  <TableHead className="font-semibold text-slate-700">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: User, index: number) => (
                  <TableRow 
                    key={`${user.username}-${index}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-700">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {'•'.repeat(Math.min(user.password?.length || 8, 8))}
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTable; 