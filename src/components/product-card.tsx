
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  seller: string;
  rating?: number;
  condition?: "New" | "Used" | "Refurbished";
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  seller,
  rating = 4.5,
  condition = "New"
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
      <Link href={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant={condition === 'New' ? 'default' : 'secondary'} className="font-bold">
            {condition}
          </Badge>
          {condition === 'New' && (
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-none shadow-sm text-primary flex items-center gap-1">
              <ShieldCheck size={12} className="text-secondary" />
              Warranty
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">
          {category}
        </div>
        <Link href={`/products/${id}`} className="block mb-2">
          <h3 className="font-headline font-bold text-lg text-primary line-clamp-1 group-hover:text-secondary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={i < Math.floor(rating) ? "" : "text-muted-foreground"}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {price.toLocaleString()} <span className="text-sm font-normal">DZD</span>
          </span>
          <span className="text-xs text-muted-foreground">by {seller}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 group/btn" variant="outline">
          <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
