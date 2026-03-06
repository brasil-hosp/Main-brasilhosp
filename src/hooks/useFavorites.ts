import { useState, useEffect } from "react";

export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("brasilhosp_favorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const toggleFavorite = (productId: number) => {
        setFavorites((prev) => {
            const isFav = prev.includes(productId);
            const newFavs = isFav ? prev.filter(id => id !== productId) : [...prev, productId];
            localStorage.setItem("brasilhosp_favorites", JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const isFavorite = (productId: number) => favorites.includes(productId);

    return { favorites, toggleFavorite, isFavorite };
}
