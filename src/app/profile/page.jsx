"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  UserCog,
  Lock,
  MapPin,
  PackageSearch,
  LogOut,
} from "lucide-react";
import { useCustomerAuthRedirect } from "../../hooks/useCustomerAuthRedirect";

export default function ProfilePage() {
  useCustomerAuthRedirect();

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/user");
  }, [dispatch, router]);

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
    {
      title: "Çıkış Yap",
      href: null,
      icon: <LogOut className="text-red-500 w-6 h-6" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Hesabım</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {menuItems.map((item) =>
          item.href ? (
            <Link
              key={item.title}
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
          ) : (
            <button
              key={item.title}
              onClick={item.onClick}
              className="flex w-full items-center space-x-4 p-5 rounded-xl border border-red-300 hover:shadow-md hover:bg-red-50 transition bg-white"
            >
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                {item.icon}
              </div>
              <span className="text-lg font-medium text-red-700">
                {item.title}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
