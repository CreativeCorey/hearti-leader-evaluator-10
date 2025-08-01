import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language/LanguageContext";
import DataImporter from "@/components/admin/DataImporter";
import UserManagement from "@/components/admin/UserManagement";
import UserDataManager from "@/components/admin/UserDataManager";
import { Shield, Database, Users, Trash2 } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Set document title based on language
  useEffect(() => {
    document.title = `HEARTI™ - ${currentLanguage === 'en' ? 'Admin Dashboard' : 
      currentLanguage === 'zh' ? '管理员仪表板' : 
      currentLanguage === 'it' ? 'Dashboard Amministratore' : 
      currentLanguage === 'fr' ? 'Tableau de Bord Administrateur' : 
      currentLanguage === 'es' ? 'Panel de Administración' : 
      currentLanguage === 'de' ? 'Admin-Dashboard' : 
      currentLanguage === 'ar' ? 'لوحة تحكم المدير' : 
      currentLanguage === 'ja' ? '管理者ダッシュボード' : 'Admin Dashboard'}`;
  }, [currentLanguage]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!authLoading && (!user || userProfile?.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. You need admin privileges to view this dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage system data and configurations</p>
        </div>
      </div>

      <Tabs defaultValue="user-management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user-management" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="data-import" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Import
          </TabsTrigger>
          <TabsTrigger value="data-management" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-management">
          <UserManagement />
        </TabsContent>

        <TabsContent value="data-import">
          <DataImporter />
        </TabsContent>

        <TabsContent value="data-management">
          <UserDataManager />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>
                Quick stats and system information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>System overview coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;