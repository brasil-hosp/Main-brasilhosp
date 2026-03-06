import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Escutando por eventos de mudança de auth para verificar se o usuário
        // está usando um token válido de recuperação, porém com a nova API (V2),
        // o usuário já estará logado após clicar no link, necessitando apenas um updateUser.
        const hash = window.location.hash;
        if (hash && hash.includes("error_description")) {
            toast({
                variant: "destructive",
                title: "Link Inválido ou Expirado",
                description: "O link de recuperação de senha é inválido ou já expirou. Por favor, solicite um novo fluxo."
            });
            navigate("/recuperar-senha");
        }
    }, [navigate, toast]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "As senhas não coincidem",
                description: "Certifique-se de digitar a mesma senha em ambos os campos."
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                variant: "destructive",
                title: "Senha muito curta",
                description: "A senha deve ter pelo menos 6 caracteres."
            });
            return;
        }

        setLoading(true);

        try {
            // O usuário já foi autenticado pelo hash do link mágico do Supabase
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast({
                title: "Senha atualizada com sucesso!",
                description: "Você já pode acessar sua conta com a nova senha."
            });

            // Deslogar por segurança e enviar de volta ao login
            await supabase.auth.signOut();
            navigate("/entrar");

        } catch (error) {
            const err = error as Error;
            toast({
                variant: "destructive",
                title: "Erro ao atualizar senha",
                description: err.message || "Tente solicitar a redefinição novamente.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-4 pt-24">
                <Card className="w-full max-w-md shadow-xl bg-white border-gray-100 animate-in fade-in zoom-in-95 duration-300">
                    <CardHeader className="text-center space-y-1">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <ShieldCheck className="text-green-600" size={24} />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Nova Senha</CardTitle>
                        <CardDescription>
                            Crie uma nova senha para acessar sua conta.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-gray-700">Nova Senha</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-bold" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Redefinir e Acessar"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
