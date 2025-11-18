import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';
import { AuthGate } from '@/components/AuthGate';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  deal_type: string;
  address_slug: string;
  asking_price: string;
  created_at: string;
  updated_at: string;
}

export default function MyProperties() {
  const { user } = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, address, city, state, deal_type, address_slug, asking_price, created_at, updated_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      });

      setProperties(properties.filter(p => p.id !== deleteId));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete property',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">My Properties</h1>
              <p className="text-gray-300 mt-1">
                Manage all your property listings
              </p>
            </div>
            <Button onClick={() => navigate('/app')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : properties.length === 0 ? (
            <Card className="bg-card border-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-300 mb-4">
                  You haven't created any properties yet
                </p>
                <Button onClick={() => navigate('/app')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id} className="bg-card border-gray-800 hover:shadow-lg hover:shadow-blue-500/20 transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{property.address}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {property.city}{property.state ? `, ${property.state}` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="font-medium text-white">{property.deal_type}</span>
                      </div>
                      {property.asking_price && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="font-medium text-white">{property.asking_price}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="font-medium text-gray-300">{formatDate(property.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                        onClick={() => navigate(`/app?editSlug=${property.address_slug}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(property.id)}
                        className="border-gray-700 text-white hover:bg-gray-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="bg-card border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                This action cannot be undone. This will permanently delete your property listing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-700 text-white hover:bg-gray-800">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-blue-600 hover:bg-blue-700 text-white">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGate>
  );
}
