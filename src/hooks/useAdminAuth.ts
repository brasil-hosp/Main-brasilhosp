import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isChecking: boolean;
  currentUserId: string | null;
  logout: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      setCurrentUserId(session.user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (profile?.user_type === 'PF' || profile?.user_type === 'PJ') {
        toast({
          variant: 'destructive',
          title: 'Acesso Negado',
          description: 'Área restrita apenas para administradores.',
        });
        navigate('/');
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro na verificação de auth:', error);
      navigate('/login');
    } finally {
      setIsChecking(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return { isAuthenticated, isChecking, currentUserId, logout };
}
