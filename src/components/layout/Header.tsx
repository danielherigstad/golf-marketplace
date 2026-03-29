"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Plus, User, LogOut, Menu, X } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/annonser?sok=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-green-600">
              GolfMarked
            </span>
          </Link>

          {/* Search - hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sok etter golfutstyr..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            <Link
              href="/annonser/ny"
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Ny annonse
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profil"
                  className="flex items-center gap-2 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Min side</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logg ut"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/logg-inn"
                className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Logg inn
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sok etter golfutstyr..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/annonser/ny"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg"
          >
            <Plus className="h-5 w-5" />
            Ny annonse
          </Link>
          {user ? (
            <>
              <Link
                href="/profil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <User className="h-5 w-5" />
                Min side
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
              >
                <LogOut className="h-5 w-5" />
                Logg ut
              </button>
            </>
          ) : (
            <Link
              href="/logg-inn"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <User className="h-5 w-5" />
              Logg inn
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
