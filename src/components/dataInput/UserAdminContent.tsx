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
      const response = await axios.get('http://192.168.105.90/users');
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
      const response = await axios.get(`http://192.168.105.90/search?username=${searchUsername}`);
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

      await axios.post('http://192.168.105.90/users', newUser);
      
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
    <div className="p-6 space-y-6">
      {/* Alert Notification */}
      {alert.type && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          {alert.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              className="w-full"
            />
            <Select 
              value={newUser.role} 
              onValueChange={(value: User['role']) => setNewUser(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
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
              className="md:col-span-3 w-full"
            >
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Search</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2">
          <Input
            placeholder="Search by Username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={searchUsers}>Search</Button>
          <Button variant="outline" onClick={fetchUsers}>Reset</Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{'*'.repeat(user.password.length)}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAdminContent;