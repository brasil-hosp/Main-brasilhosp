import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Step = "EMAIL" | "CODE" | "NEW_PASSWORD" | "SUCCESS";

const ForgotPassword = () => {
    const [step, setStep] = useState<Step>("EMAIL");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    // Passo 1: Solicitar envio do código para o e-mail
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // O Supabase precisa estar configurado para usar {{ .Token }} no template de e-mail de recuperação
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) throw error;

            setStep("CODE");
            toast({
                title: "Código enviado!",
                description: "Verifique sua caixa de entrada e spam."
            });

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao enviar código",
                description: error.message || "Tente novamente mais tarde.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Passo 2: Validar o código de segurança
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length < 4) return;

        setLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: code,
                type: 'recovery'
            });

            if (error) throw error;

            // Código validado! O usuário agora tem uma sessão ativa temporária de recuperação.
            setStep("NEW_PASSWORD");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Código inválido",
                description: "O código digitado está incorreto ou expirou.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Passo 3: Atualizar a senha
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({ variant: "destructive", title: "As senhas não coincidem" });
            return;
        }

        if (newPassword.length < 6) {
            toast({ variant: "destructive", title: "Senha muito curta", description: "Mínimo de 6 caracteres." });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setStep("SUCCESS");

            // Deslogar para obrigar fazer login com a nova senha
            await supabase.auth.signOut();

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao redefinir a senha",
                description: error.message,
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

                    {/* CABEÇALHO */}
                    <CardHeader className="text-center space-y-1">
                        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step === 'SUCCESS' ? 'bg-green-100' : 'bg-amber-100'}`}>
                            {step === 'SUCCESS' ? <CheckCircle2 className="text-green-600" size={24} /> :
                                step === 'NEW_PASSWORD' ? <ShieldCheck className="text-amber-600" size={24} /> :
                                    <KeyRound className="text-amber-600" size={24} />}
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {step === 'EMAIL' && "Recuperar Senha"}
                            {step === 'CODE' && "Código de Segurança"}
                            {step === 'NEW_PASSWORD' && "Nova Senha"}
                            {step === 'SUCCESS' && "Senha Redefinida!"}
                        </CardTitle>
                        <CardDescription>
                            {step === 'EMAIL' && "Digite o e-mail cadastrado para receber o código de segurança."}
                            {step === 'CODE' && `Enviamos um código para ${email}.`}
                            {step === 'NEW_PASSWORD' && "O código foi validado. Crie sua nova senha agora."}
                            {step === 'SUCCESS' && "Sua senha foi alterada com segurança."}
                        </CardDescription>
                    </CardHeader>

                    {/* CORPO DO FORMULÁRIO */}
                    <CardContent>
                        {step === 'EMAIL' && (
                            <form onSubmit={handleSendCode} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Seu E-mail</label>
                                    <Input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Receber Código por E-mail"}
                                </Button>
                            </form>
                        )}

                        {step === 'CODE' && (
                            <form onSubmit={handleVerifyCode} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 text-center block">Código de Segurança</label>
                                    <Input
                                        type="text"
                                        placeholder="••••••"
                                        maxLength={12}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.trim())}
                                        className="text-center text-2xl tracking-widest font-mono font-bold"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold" disabled={loading || code.length < 4}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Validar Código"}
                                </Button>
                                <Button type="button" variant="ghost" className="w-full text-gray-500 text-xs" onClick={() => setStep('EMAIL')} disabled={loading}>
                                    Digitar outro e-mail
                                </Button>
                            </form>
                        )}

                        {step === 'NEW_PASSWORD' && (
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
                                        minLength={6}
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Salvar e Acessar"}
                                </Button>
                            </form>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Sua senha foi redefinida com sucesso. Você já pode voltar a utilizar a plataforma da Brasil Hosp.
                                </p>
                                <Button onClick={() => navigate("/entrar")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold mt-2">
                                    Ir para o Login
                                </Button>
                            </div>
                        )}
                    </CardContent>

                    {/* RODAPÉ */}
                    {step !== 'SUCCESS' && (
                        <CardFooter className="flex justify-center border-t p-4 bg-gray-50/50">
                            <Link to="/entrar" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                                <ArrowLeft size={16} /> Voltar para o Login
                            </Link>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
