import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { IoSearchOutline, IoRefreshOutline } from 'react-icons/io5';

interface UserSearchProps {
  searchQuery: string;
  loading: boolean;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const UserSearch: React.FC<UserSearchProps> = ({
  searchQuery,
  loading,
  onSearchQueryChange,
  onSearch,
  onReset
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <CardTitle className="text-xl font-semibold flex items-center space-x-3">
            <IoSearchOutline className="w-6 h-6" />
            <span>User Search</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-white flex space-x-2">
        <Input
          placeholder="Search by Username"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow bg-white/90 backdrop-blur-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <Button 
          onClick={onSearch}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <Loading size="sm" className="text-white" />
          ) : (
            <IoSearchOutline className="w-4 h-4" />
          )}
          <span>Search</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          disabled={loading}
          className="border-gray-300 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
        >
          <IoRefreshOutline className="w-4 h-4" />
          <span>Reset</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserSearch; 