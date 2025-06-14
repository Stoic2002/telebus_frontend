import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { IoPersonAddOutline, IoSearchOutline, IoPeopleOutline, IoCheckmarkCircleOutline, IoWarningOutline, IoPersonOutline } from 'react-icons/io5';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';

interface User {
  username: string;
  password: string;
  role: 'client' | 'opr' | 'ghw' | 'admin';
}

const UserAdminContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    password: '',
    role: undefined
  });
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert.type) {
      const timer = setTimeout(() => {
        setAlert({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetchWithRetry(
              () => axios.get('http://192.168.105.90/users'),
              3, // max attempts
              1000 // delay in ms
            );
      setUsers(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to fetch users'
      });
    }
  };

  // Search users by username
  const searchUsers = async () => {
    try {
      const response = await fetchWithRetry(
        () => axios.get(`http://192.168.105.90/search?username=${searchUsername}`),
        3, // max attempts
        1000 // delay in ms
      );
      setUsers(response.data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to search users'
      });
    }
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      // Validate input
      if (!newUser.username || !newUser.password || !newUser.role) {
        setAlert({
          type: 'error',
          message: 'Please fill all fields'
        });
        return;
      }

      await fetchWithRetry(
        () => axios.post('http://192.168.105.90/users', newUser),
        3, // max attempts
        1000 // delay in ms
      );
      
      // Reset form and refresh users
      setNewUser({ username: '', password: '', role: undefined });
      fetchUsers();
      
      setAlert({
        type: 'success',
        message: 'User added successfully'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to add user'
      });
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alert Notification */}
        {alert.type && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="bg-white/90 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              {alert.type === 'error' ? (
                <IoWarningOutline className="h-5 w-5 text-red-500" />
              ) : (
                <IoCheckmarkCircleOutline className="h-5 w-5 text-green-500" />
              )}
              <AlertTitle className="font-semibold">{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            </div>
            <AlertDescription className="mt-2 font-medium">{alert.message}</AlertDescription>
          </Alert>
        )}
        
        {/* Add New User Card */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6">
            <CardTitle className="flex items-center space-x-3">
              <IoPersonAddOutline className="w-8 h-8" />
              <span className="text-xl font-bold">Add New User</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Select 
                value={newUser.role} 
                onValueChange={(value: User['role']) => setNewUser(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="opr">OPR</SelectItem>
                  <SelectItem value="ghw">GHW</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddUser} 
                className="md:col-span-3 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-3"
              >
                <IoPersonAddOutline className="w-5 h-5" />
                <span>Add User</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Search Card */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <CardTitle className="flex items-center space-x-3">
              <IoSearchOutline className="w-8 h-8" />
              <span className="text-xl font-bold">User Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex space-x-2">
            <Input
              placeholder="Search by Username"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="flex-grow bg-white/90 backdrop-blur-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button 
              onClick={searchUsers}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg flex items-center space-x-2"
            >
              <IoSearchOutline className="w-4 h-4" />
              <span>Search</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchUsers}
              className="border-gray-300 hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>Reset</span>
            </Button>
          </CardContent>
        </Card>

        {/* User List Card */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-6">
            <CardTitle className="flex items-center space-x-3">
              <IoPeopleOutline className="w-8 h-8" />
              <span className="text-xl font-bold">User List</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200">
                    <TableHead className="font-semibold text-slate-700 flex items-center space-x-2">
                      <IoPersonOutline className="w-4 h-4" />
                      <span>Username</span>
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">Password</TableHead>
                    <TableHead className="font-semibold text-slate-700">Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/70 transition-colors">
                      <TableCell className="font-medium text-slate-700">{user.username}</TableCell>
                      <TableCell className="text-slate-600">{'*'.repeat(user.password.length)}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'ghw' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'opr' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAdminContent;