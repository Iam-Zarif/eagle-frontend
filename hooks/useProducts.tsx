import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product } from "@/types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const q = collection(db, "product");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Product[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Product;

        return {
          ...data,
          id: doc.id, 
        };
      });

      setProducts(items);
    });

    return () => unsubscribe();
  }, []);

  return products;
};
