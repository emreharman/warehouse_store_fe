"use client";

import Link from "next/link";
import { UserCog, Lock, MapPin, PackageSearch } from "lucide-react";
import { useCustomerAuthRedirect } from '@/hooks/useCustomerAuthRedirect'

const menuItems = [
  {
    title: "Profil Bilgilerim",
    href: "/profile/edit",
    icon: <UserCog className="text-primary-600 w-6 h-6" />,
  },
  {
    title: "Siparişlerim",
    href: "/profile/orders",
    icon: <PackageSearch className="text-primary-600 w-6 h-6" />,
  },
  {
    title: "Adreslerim",
    href: "/profile/addresses",
    icon: <MapPin className="text-primary-600 w-6 h-6" />,
  },
  {
    title: "Şifre Değiştir",
    href: "/profile/change-password",
    icon: <Lock className="text-primary-600 w-6 h-6" />,
  },
];

export default function ProfilePage() {
  useCustomerAuthRedirect()
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Hesabım</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-4 p-5 rounded-xl border border-primary/20 hover:shadow-md hover:bg-primary/5 transition bg-white"
          >
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              {item.icon}
            </div>
            <span className="text-lg font-medium text-gray-700">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
