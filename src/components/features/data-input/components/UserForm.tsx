import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { IoPersonAddOutline } from 'react-icons/io5';

// User role types
type UserRole = 'client' | 'opr' | 'ghw' | 'admin';

interface NewUser {
  username: string;
  password: string;
  role: UserRole | '';
}

interface UserFormProps {
  newUser: NewUser;
  loading: boolean;
  onUpdateField: (field: keyof NewUser, value: any) => void;
  onSubmit: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  newUser,
  loading,
  onUpdateField,
  onSubmit
}) => {
  // Form validation
  const isFormValid = (): boolean => {
    return !!(newUser.username && newUser.password && newUser.role);
  };

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <CardTitle className="text-xl font-semibold flex items-center space-x-3">
            <IoPersonAddOutline className="w-6 h-6" />
            <span>Add New User</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="Username"
              value={newUser.username || ''}
              onChange={(e) => onUpdateField('username', e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            {!newUser.username && (
              <p className="text-sm text-red-500">Username is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password || ''}
              onChange={(e) => onUpdateField('password', e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            {!newUser.password && (
              <p className="text-sm text-red-500">Password is required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Select 
              value={newUser.role || ''} 
              onValueChange={(value: UserRole) => onUpdateField('role', value)}
              disabled={loading}
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
            {!newUser.role && (
              <p className="text-sm text-red-500">Role is required</p>
            )}
          </div>
          
          <Button 
            onClick={onSubmit}
            disabled={loading || !isFormValid()}
            className="md:col-span-3 w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:from-indigo-700 hover:to-indigo-900 shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loading size="sm" className="text-white" />
                <span>Adding User...</span>
              </>
            ) : (
              <>
                <IoPersonAddOutline className="w-5 h-5" />
                <span>Add User</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserForm; 