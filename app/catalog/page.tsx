"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  metal: string;
  purity: string;
  weight: string;
  description: string;
}

const categories = [
  { value: "all", label: "All Categories", path: "/catalog" },
  { value: "Rings", label: "Rings", path: "/catalog/Ring" },
  { value: "Necklaces", label: "Necklaces", path: "/catalog/Necklace" },
  { value: "Earrings", label: "Earrings", path: "/catalog/Earring" },
  { value: "Bracelets", label: "Bracelets", path: "/catalog/Bracelet" },
  { value: "Pendants", label: "Pendants", path: "/catalog/Pendant" },
];

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMetal, setSelectedMetal] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Filter and search logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Fallback to empty array on error
        setProducts([]);
        setFilteredProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Metal filter
    if (selectedMetal !== "all") {
      filtered = filtered.filter(
        (product) => product.metal.toLowerCase() === selectedMetal.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedMetal, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Jewelry Collection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our exquisite collection of handcrafted jewelry, each piece
            telling its own unique story
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Link key={category.value} href={category.path}>
              <Button
                variant={
                  selectedCategory === category.value ? "default" : "outline"
                }
                className="rounded-full px-4 py-2 text-sm transition-all hover:scale-105"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-0 shadow-sm overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <Link href={`/catalog/${product.category}`}>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>
              </div>

              <CardContent className="p-3">
                <Link href={`/catalog/${product.category}`}>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white text-center line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                {/* Removed Search Icon */}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                No jewelry found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find any pieces matching your search criteria. Try
                adjusting your filters.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedMetal("all");
                }}
                className="rounded-full"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
