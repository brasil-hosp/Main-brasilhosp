import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, ShoppingCart, Image as ImageIcon, Box, List, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";

interface Product {
    id: number;
    name: string;
    category: string;
    subcategory?: string | null;
    description?: string | null;
    image_url?: string | null;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();
    const { toast } = useToast();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            if (!id) return;
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            toast({ title: "Infelizmente", description: "O produto não foi encontrado.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({ id: product.id.toString(), name: product.name, quantity: 1 });
        toast({ title: "Adicionado ao Carrinho!", description: `${product.name} incluído.`, duration: 2000 });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 size={48} className="animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
                    <Link to="/catalogo">
                        <Button>Voltar ao Catálogo</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <FloatingCart />
            <main className="flex-grow pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-6xl">

                    <div className="mb-6">
                        <Link to="/catalogo" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                            <ArrowLeft size={16} className="mr-1" /> Voltar ao Catálogo
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Lado Esquerdo - IMAGEM */}
                            <div className="bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100 min-h-[400px]">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="max-w-full max-h-[500px] object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-300">
                                        <ImageIcon size={64} className="mb-4 opacity-50" />
                                        <p>Imagem ilustrativa indisponível</p>
                                    </div>
                                )}
                            </div>

                            {/* Lado Direito - INFORMAÇÕES */}
                            <div className="p-8 lg:p-12 flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                            {product.category}
                                        </Badge>
                                        {product.subcategory && product.subcategory.trim() !== "" && (
                                            <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">
                                                {product.subcategory}
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                        {product.name}
                                    </h1>

                                    <p className="text-gray-500 mb-6 text-sm flex items-center gap-1">
                                        <List size={14} /> Ref/ID: #{product.id}
                                    </p>

                                    <div className="prose prose-sm md:prose-base text-gray-600 mb-8 max-w-none">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalhes</h3>
                                        <p className="whitespace-pre-line">
                                            {product.description || "Descrição técnica detalhada indisponível no momento. Consulte nossos consultores para mais informações sobre especificações, marca e disponibilidade."}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-gray-100 mt-6">

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <Box className="text-primary" size={24} />
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Estoque</p>
                                                <p className="font-semibold text-gray-800 text-sm">Pronta Entrega</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <ShieldCheck className="text-green-600" size={24} />
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase">Qualidade</p>
                                                <p className="font-semibold text-gray-800 text-sm">Garantia BR Hosp</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleAddToCart}
                                        size="lg"
                                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-bold shadow-md text-lg h-14 transition-transform active:scale-95"
                                    >
                                        <ShoppingCart size={22} className="mr-2" />
                                        Adicionar à Lista de Orçamento
                                    </Button>

                                    <p className="text-center text-xs text-gray-500 mt-4">
                                        Ao adicionar à lista, você poderá solicitar cotação formal sem compromisso.
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
