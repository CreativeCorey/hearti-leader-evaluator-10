import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Search, UserCheck, UserX, Shield, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRateLimit } from '@/hooks/useRateLimit';
import UserAssessmentDetails from './UserAssessmentDetails';

type UserRole = "user" | "admin" | "coach" | "super_admin";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  organization_id: string | null;
  created_at: string;
  organization_name?: string;
  isHistorical?: boolean;
  source_unique_id?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const { toast } = useToast();
  const { checkAndEnforceRateLimit } = useRateLimit();

  // Load users with pagination
  const loadUsers = async (page: number = currentPage) => {
    try {
      setLoading(true);
      
      const offset = (page - 1) * pageSize;
      
      // Get total counts first
      const { count: regularCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: historicalCount } = await supabase
        .from('historical_profiles')
        .select('*', { count: 'exact', head: true });

      const totalUserCount = (regularCount || 0) + (historicalCount || 0);
      setTotalCount(totalUserCount);
      setTotalPages(Math.ceil(totalUserCount / pageSize));

      // Get regular profiles (always include all since they're few)
      const { data: regularProfiles, error: regularError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role,
          organization_id,
          created_at,
          organizations(name)
        `)
        .order('created_at', { ascending: false });

      if (regularError) {
        throw regularError;
      }

      // Calculate how many historical profiles to fetch based on pagination
      const regularUsersCount = regularProfiles?.length || 0;
      const historicalOffset = Math.max(0, offset - regularUsersCount);
      const historicalLimit = offset < regularUsersCount 
        ? pageSize 
        : pageSize - Math.max(0, regularUsersCount - offset);

      // Get historical profiles with pagination
      let historicalProfiles: any[] = [];
      if (historicalLimit > 0 && historicalOffset < (historicalCount || 0)) {
        const { data, error: historicalError } = await supabase
          .from('historical_profiles')
          .select(`
            id,
            name,
            email,
            role,
            organization_id,
            created_at,
            source_unique_id,
            organizations(name)
          `)
          .order('created_at', { ascending: false })
          .range(historicalOffset, historicalOffset + historicalLimit - 1);

        if (historicalError) {
          console.warn('Could not load historical profiles:', historicalError);
        } else {
          historicalProfiles = data || [];
        }
      }

      // Combine and mark profiles
      const regularUsers = (regularProfiles || []).map(user => ({
        ...user,
        organization_name: (user.organizations as any)?.name || null,
        isHistorical: false
      }));

      const historicalUsers = historicalProfiles.map(user => ({
        ...user,
        organization_name: (user.organizations as any)?.name || null,
        isHistorical: true
      }));

      // Combine all users and apply pagination correctly
      const allUsers = [...regularUsers, ...historicalUsers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // For pagination, we need to slice correctly based on the page
      const startIndex = offset;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      setUsers(paginatedUsers);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when search or filter changes
  const handleSearchOrFilterChange = () => {
    setCurrentPage(1);
    loadUsers(1);
  };

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadUsers(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  // Update search and filter handlers
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || selectedRole !== 'all') {
        handleSearchOrFilterChange();
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedRole]);

  // Update user role
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    // Rate limiting: 10 role changes per hour
    if (!checkAndEnforceRateLimit('user_role_update', 10, 3600000)) {
      return;
    }

    try {
      setUpdatingUser(userId);

      const user = users.find(u => u.id === userId);
      const tableName = user?.isHistorical ? 'historical_profiles' : 'profiles';

      const { error } = await supabase
        .from(tableName)
        .update({ role: newRole as any })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Success",
        description: `User role updated to ${newRole} successfully.`,
      });
      
      // Reload current page to reflect changes
      loadUsers(currentPage);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  // Filter users based on search and role (applied to current page)
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  // Calculate pagination info
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'coach': return 'default';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'coach': return <UserCheck className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user roles and permissions. Grant coach or admin privileges to users.
          </CardDescription>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="coach">Coaches</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCount}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Admins (Page)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'coach').length}
            </div>
            <div className="text-sm text-muted-foreground">Coaches (Page)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-muted-foreground">Regular Users (Page)</div>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="flex justify-between items-center py-2 text-sm text-muted-foreground">
          <div>
            Showing {startIndex} to {endIndex} of {totalCount} users
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Users Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name || 'No name'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      {user.source_unique_id && (
                        <div className="text-xs text-muted-foreground">ID: {user.source_unique_id}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isHistorical ? "outline" : "default"}>
                      {user.isHistorical ? "Historical" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.organization_name || 'No organization'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRoleBadgeVariant(user.role)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        View Assessments
                      </Button>
                      {user.role !== 'coach' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={updatingUser === user.id}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Make Coach
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Grant Coach Privileges</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to grant coach privileges to {user.name || user.email}? 
                                They will be able to view participant data and assessments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => updateUserRole(user.id, 'coach')}
                              >
                                Grant Coach Role
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      {user.role !== 'admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={updatingUser === user.id}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Make Admin
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Grant Admin Privileges</AlertDialogTitle>
                              <AlertDialogDescription>
                                <strong>⚠️ WARNING:</strong> Are you sure you want to grant admin privileges to {user.name || user.email}? 
                                They will have full system access including user management, data import, and all admin functions.
                                This action should only be performed for trusted users.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => updateUserRole(user.id, 'admin')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Grant Admin Role
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      {user.role !== 'user' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={updatingUser === user.id}
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Remove Privileges
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Privileges</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {user.role} privileges from {user.name || user.email}? 
                                They will become a regular user with basic access only.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => updateUserRole(user.id, 'user')}
                              >
                                Remove Privileges
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={index} className="px-2">...</span>
                ) : (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    disabled={loading}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Go to page:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  goToPage(page);
                }
              }}
              className="w-20"
              disabled={loading}
            />
          </div>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No users found matching your search criteria.</p>
          </div>
        )}
      </CardContent>
      </Card>

      {selectedUser && (
        <UserAssessmentDetails
          userId={selectedUser.id}
          userName={selectedUser.name || ''}
          userEmail={selectedUser.email}
          isHistorical={selectedUser.isHistorical || false}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;