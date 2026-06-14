
import Link from "next/link";
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-secondary p-2 rounded-lg text-primary">
                <Car size={24} />
              </div>
              <span className="font-headline font-bold text-xl tracking-tight">
                Bourouisse <span className="text-secondary">PieceDz</span>
              </span>
            </Link>
            <p className="text-blue-100/70 text-sm leading-relaxed">
              Algeria's leading marketplace for premium auto parts. We connect reliable sellers with car enthusiasts and professionals across the nation.
            </p>
            <div className="flex gap-4 pt-2">
              <Facebook size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-secondary cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-secondary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6 text-lg">Shop by Category</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/catalog?cat=engine" className="hover:text-secondary transition-colors">Engine & Drivetrain</Link></li>
              <li><Link href="/catalog?cat=brakes" className="hover:text-secondary transition-colors">Brakes & Suspension</Link></li>
              <li><Link href="/catalog?cat=electrical" className="hover:text-secondary transition-colors">Electrical & Lighting</Link></li>
              <li><Link href="/catalog?cat=body" className="hover:text-secondary transition-colors">Body Parts & Mirrors</Link></li>
              <li><Link href="/catalog?cat=interior" className="hover:text-secondary transition-colors">Interior Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li><Link href="/seller/register" className="hover:text-secondary transition-colors">Become a Seller</Link></li>
              <li><Link href="/how-it-works" className="hover:text-secondary transition-colors">How it Works</Link></li>
              <li><Link href="/shipping" className="hover:text-secondary transition-colors">Shipping Information</Link></li>
              <li><Link href="/faq" className="hover:text-secondary transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/support" className="hover:text-secondary transition-colors">Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm text-blue-100/70">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-secondary" />
                <span>support@bourouisse-piecedz.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-secondary" />
                <span>+213 778 42 89 77</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-secondary" />
                <span>Algiers, Algeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100/40">
          <p>© 2024 Bourouisse-PieceDz. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
