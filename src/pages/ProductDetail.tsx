import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, ShoppingCart, Image as ImageIcon, Box, List, ShieldCheck, Heart, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import FloatingCart from "@/components/FloatingCart";
import { supabase } from "@/lib/supabase";
import { productService } from "@/services/productService";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from "@/types/product";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRestricted, setIsRestricted] = useState(false);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            if (!id) return;

            const data = await productService.getById(id);
            if (!data) throw new Error('Produto não encontrado');

            // Restriction check for Medicamentos category
            if (data.category === 'Medicamentos') {
                const { data: { session } } = await supabase.auth.getSession();
                let canSee = false;
                if (session) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('user_type, is_verified')
                        .eq('id', session.user.id)
                        .single();
                    if (profile && (profile.user_type === 'ADMIN' || (profile.user_type === 'PJ' && profile.is_verified))) {
                        canSee = true;
                    }
                }
                if (!canSee) {
                    setIsRestricted(true);
                    setIsLoading(false);
                    return;
                }
            }

            setProduct(data);

            if (data?.category) {
                const related = await productService.getRelated(data.category, data.id);
                setRelatedProducts(related);
            }
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

    if (isRestricted) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
                        <Lock size={48} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Acesso Restrito</h2>
                    <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                        A categoria de Medicamentos é exclusiva para empresas (PJ) com cadastro aprovado e regularizado.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/catalogo">
                            <Button variant="outline" className="w-full sm:w-auto h-12 px-6">Voltar ao Catálogo</Button>
                        </Link>
                        <Link to="/entrar">
                            <Button className="w-full sm:w-auto h-12 px-6 bg-red-600 hover:bg-red-700 shadow-md">Faça Login como PJ</Button>
                        </Link>
                    </div>
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
                            {/* Lado Esquerdo - IMAGEM (Vitrine Premium) */}
                            <div className="relative p-8 lg:p-16 flex items-center justify-center border-r border-gray-100 min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
                                {/* Decorator circles for "studio" lighting effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-30 mix-blend-multiply pointer-events-none"></div>

                                {product.image_url ? (
                                    <div className="relative z-10 w-full flex justify-center group">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="max-w-full max-h-[550px] object-contain drop-shadow-2xl transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:-translate-y-2"
                                        />
                                        {/* Premium reflection shadow */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/10 blur-xl rounded-[100%] transition-all duration-700 group-hover:w-1/2 group-hover:opacity-50"></div>
                                    </div>
                                ) : (
                                    <div className="relative z-10 flex flex-col items-center text-gray-300">
                                        <ImageIcon size={72} className="mb-4 opacity-40 drop-shadow-md" />
                                        <p className="font-medium tracking-wide">Imagem em breve</p>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                                    className="absolute top-6 right-6 p-4 bg-white/70 backdrop-blur-md border border-white/50 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-20 group/fav"
                                >
                                    <Heart size={28} className={`transition-colors duration-300 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/fav:text-red-400"}`} />
                                </button>
                            </div>

                            {/* Lado Direito - INFORMAÇÕES (Hierarquia Elevada) */}
                            <div className="p-8 lg:p-14 flex flex-col justify-start bg-white z-10">
                                <div className="animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-both" style={{ animationDelay: "100ms" }}>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 uppercase tracking-wider text-[10px] font-bold border border-blue-100">
                                            {product.category}
                                        </Badge>
                                        {product.subcategory && product.subcategory.trim() !== "" && (
                                            <Badge variant="outline" className="px-3 py-1 text-red-600 bg-red-50 border-red-100 uppercase tracking-wider text-[10px] font-bold">
                                                {product.subcategory}
                                            </Badge>
                                        )}
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-[1.1] tracking-tight text-balance">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-400 bg-gray-50 w-fit px-3 py-1.5 rounded-md border border-gray-100">
                                        <List size={14} className="text-primary" />
                                        <span>Cód: <span className="text-gray-600 font-bold">#{product.id.toString().padStart(6, '0')}</span></span>
                                    </div>

                                    <div className="prose prose-base text-gray-600 mb-10 max-w-none leading-relaxed">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            Especificações Técnicas
                                        </h3>
                                        <p className="whitespace-pre-line text-justify text-gray-500">
                                            {product.description || "Descrição técnica detalhada indisponível no momento. Nossa equipe de engenharia clínica está à disposição para fornecer manuais, certificados e especificações de compatibilidade."}
                                        </p>
                                    </div>
                                </div>

                                {/* Ações & Trust Badges */}
                                <div className="space-y-6 pt-8 border-t border-gray-100 mt-auto animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-both" style={{ animationDelay: "250ms" }}>

                                    {/* Premium Trust Bar */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                                <Box size={22} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Disponibilidade</p>
                                                <p className="font-bold text-gray-900 text-sm">Pronta Entrega</p>
                                            </div>
                                        </div>
                                        <div className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="bg-green-50 p-3 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                                                <ShieldCheck size={22} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Certificação</p>
                                                <p className="font-bold text-gray-900 text-sm">Garantia BR Hosp</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Primary CTA */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-primary rounded-full blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                                        <Button
                                            onClick={handleAddToCart}
                                            size="lg"
                                            className="relative w-full bg-primary hover:bg-blue-700 text-white rounded-full font-bold shadow-xl text-lg h-16 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            <ShoppingCart size={24} className="transition-transform group-hover:-rotate-12" />
                                            Adicionar ao Orçamento
                                        </Button>
                                    </div>

                                    <p className="text-center text-xs font-medium text-gray-400 px-4">
                                        Adicione produtos à sua lista para gerar uma cotação formal sem compromisso com nossa equipe comercial.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Produtos Relacionados (Carrossel) */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-20 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-both" style={{ animationDelay: "400ms" }}>
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    Produtos Relacionados
                                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md border border-blue-100">{relatedProducts.length}</span>
                                </h2>
                            </div>

                            <div className="relative px-0 md:px-12">
                                <Carousel
                                    opts={{
                                        align: "start",
                                        loop: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent className="-ml-4 py-2">
                                        {relatedProducts.map((related) => (
                                            <CarouselItem key={related.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                                <Link to={`/produto/${related.id}`} className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
                                                    <div className="bg-white rounded-xl border border-gray-100 p-5 h-full flex flex-col hover:shadow-xl hover:border-primary/20 transition-all duration-500 group">
                                                        <div className="aspect-square bg-gray-50 rounded-lg mb-5 flex items-center justify-center p-4 overflow-hidden relative">
                                                            {/* Decorator Light On Hover */}
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                                                            {related.image_url ? (
                                                                <img
                                                                    src={related.image_url}
                                                                    alt={related.name}
                                                                    className="w-full h-full object-contain group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-md transition-all duration-700"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="text-gray-300 w-12 h-12" />
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(related.id); }}
                                                            className="absolute top-8 right-8 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                                                        >
                                                            <Heart size={18} className={isFavorite(related.id) ? "fill-red-500 text-red-500" : "text-gray-300"} />
                                                        </button>
                                                        <div className="flex flex-col flex-grow">
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">{related.category}</div>
                                                            <h3 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-primary transition-colors leading-relaxed">{related.name}</h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="hidden md:flex -left-4 xl:-left-12 bg-white hover:bg-gray-50 hover:text-primary border-gray-200 shadow-md h-12 w-12" />
                                    <CarouselNext className="hidden md:flex -right-4 xl:-right-12 bg-white hover:bg-gray-50 hover:text-primary border-gray-200 shadow-md h-12 w-12" />
                                </Carousel>
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
