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
import GoogleSheetsImporter from './GoogleSheetsImporter';
import UserAssessmentDetails from './UserAssessmentDetails';

type UserRole = "user" | "admin" | "coach";

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
  const { toast } = useToast();
  const { checkAndEnforceRateLimit } = useRateLimit();

  // Load all users (both regular and historical)
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get regular profiles
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
        `);

      if (regularError) {
        throw regularError;
      }

      // Get historical profiles
      const { data: historicalProfiles, error: historicalError } = await supabase
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
        `);

      if (historicalError) {
        console.warn('Could not load historical profiles:', historicalError);
      }

      // Combine and mark historical profiles
      const regularUsers = (regularProfiles || []).map(user => ({
        ...user,
        organization_name: (user.organizations as any)?.name || null,
        isHistorical: false
      }));

      const historicalUsers = (historicalProfiles || []).map(user => ({
        ...user,
        organization_name: (user.organizations as any)?.name || null,
        isHistorical: true
      }));

      const allUsers = [...regularUsers, ...historicalUsers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setUsers(allUsers);
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

  useEffect(() => {
    loadUsers();
  }, []);

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

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

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
      <GoogleSheetsImporter />
      
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
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'coach').length}
            </div>
            <div className="text-sm text-muted-foreground">Coaches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-muted-foreground">Regular Users</div>
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

        {filteredUsers.length === 0 && (
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