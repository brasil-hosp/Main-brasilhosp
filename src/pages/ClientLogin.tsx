import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { User, Loader2, Eye, EyeOff } from "lucide-react";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Olhinho
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // Se já está logado, verificamos quem é
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      // Se for cliente (PF/PJ), vai pra Home. Se não, fica aqui ou vai pro Admin.
      if (profile && (profile.user_type === 'PF' || profile.user_type === 'PJ')) {
        navigate("/");
      }
      // OBS: Removi o redirecionamento automático para Admin aqui para evitar loops
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.session.user.id)
          .single();

        // Se NÃO tiver perfil de cliente, não deixamos entrar por aqui
        // (Isso evita que o Admin logue pela tela errada e fique confuso)
        if (!profile) {
          // Caso raro: Usuário sem perfil. 
          // Vamos mandá-lo para a home mesmo assim para não travar
          navigate("/");
        } else if (profile.user_type === 'PF' || profile.user_type === 'PJ') {
          navigate("/");
        } else {
          // Se for admin tentando logar aqui
          navigate("/admin");
        }
      }

      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Credenciais inválidas",
        description: "Verifique seu e-mail e senha.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md shadow-xl bg-white border-gray-100">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <User className="text-blue-600" size={24} />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Área do Cliente</CardTitle>
            <CardDescription>
              Entre para acessar orçamentos e produtos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  <Link to="/recuperar-senha" className="text-xs text-blue-600 hover:underline">Esqueceu a senha?</Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Acessar Conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 bg-gray-50/50">
            <p className="text-sm text-gray-600">
              Ainda não tem cadastro?{" "}
              <Link to="/cadastro" className="text-blue-600 font-bold hover:underline">
                Criar conta
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ClientLogin;