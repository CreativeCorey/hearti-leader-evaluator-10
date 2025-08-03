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
import PaginationControls from './PaginationControls';

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

  // Load users with pagination and filtering
  const loadUsers = async (page: number = currentPage) => {
    try {
      setLoading(true);
      
      const offset = (page - 1) * pageSize;
      
      // First, get total counts separately for better performance
      const { count: regularCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      const { count: historicalCount } = await supabase
        .from('historical_profiles')
        .select('*', { count: 'exact', head: true });
      
      // Calculate total before filtering
      const unfilteredTotal = (regularCount || 0) + (historicalCount || 0);
      
      // Build query filters for both regular and historical profiles
      let regularQuery = supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          role,
          organization_id,
          created_at,
          organizations(name)
        `, { count: 'exact' });

      let historicalQuery = supabase
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
        `, { count: 'exact' });

      // Apply search filters
      if (searchTerm) {
        const searchFilter = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
        regularQuery = regularQuery.or(searchFilter);
        historicalQuery = historicalQuery.or(searchFilter);
      }

      // Apply role filters  
      if (selectedRole !== 'all') {
        // Cast to any to avoid type issues with enum differences
        regularQuery = regularQuery.eq('role', selectedRole as any);
        historicalQuery = historicalQuery.eq('role', selectedRole as any);
      }

      // Get filtered regular profiles
      const { data: regularProfiles, error: regularError, count: filteredRegularCount } = await regularQuery
        .order('created_at', { ascending: false });

      if (regularError) {
        throw regularError;
      }

      // Get filtered historical profiles
      const { data: historicalProfilesData, error: historicalError, count: filteredHistoricalCount } = await historicalQuery
        .order('created_at', { ascending: false });

      if (historicalError) {
        console.warn('Could not load historical profiles:', historicalError);
      }

      // Combine and mark profiles
      const regularUsers = (regularProfiles || []).map(user => ({
        ...user,
        organization_name: (user.organizations as any)?.name || null,
        isHistorical: false
      }));

      const historicalUsers = (historicalProfilesData || []).map(user => ({
        ...user,
        organization_name: (user.organizations as any)?.name || null,
        isHistorical: true
      }));

      // Combine all filtered users and sort
      const allFilteredUsers = [...regularUsers, ...historicalUsers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Update counts - use unfiltered total if no search/filter is applied
      const totalFilteredCount = (searchTerm || selectedRole !== 'all') 
        ? allFilteredUsers.length 
        : unfilteredTotal;
        
      setTotalCount(totalFilteredCount);
      setTotalPages(Math.ceil(totalFilteredCount / pageSize));

      // Apply pagination to filtered results - FIXED: Ensure we have data for the requested page
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      // For debugging pagination issues
      console.log('Pagination Debug:', {
        page,
        startIndex,
        endIndex,
        totalUsers: allFilteredUsers.length,
        totalCount: totalFilteredCount,
        pageSize,
        searchTerm,
        selectedRole
      });
      
      const paginatedUsers = allFilteredUsers.slice(startIndex, endIndex);
      console.log('Paginated users:', paginatedUsers.length);

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

  // Users are already filtered in the query, no need to filter again
  const filteredUsers = users;

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
            <div className="text-2xl font-bold text-green-600">{totalCount}</div>
            <div className="text-sm text-muted-foreground">Total Users Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Admins (This Page)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'coach').length}
            </div>
            <div className="text-sm text-muted-foreground">Coaches (This Page)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-muted-foreground">Regular Users (This Page)</div>
          </div>
        </div>

        {/* Top Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          loading={loading}
          onGoToPage={goToPage}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />

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

        {/* Bottom Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          loading={loading}
          onGoToPage={goToPage}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />

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