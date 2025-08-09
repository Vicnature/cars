"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { fetchSpareParts } from "@/utils/fetchSpareParts";
import PartCard from "@/components/PartCard";
import CustomButton from "@/components/CustomButton";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect logic based on user role once session is loaded
  useEffect(() => {
    if (status === "loading") return; // wait for session loading

    if (session?.user?.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (session?.user?.role === "customer") {
      router.replace("/browse");
    }
    // If no session or unknown role, stay on landing page
  }, [session, status, router]);

  const getSampleParts = async () => {
    setLoading(true);
    try {
      const results = await fetchSpareParts({ limit: 3 }); // just show a preview
      setParts(results || []);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSampleParts();
  }, []);

  // Optional: while redirecting, render nothing or a loader
  if (status === "loading") {
    return (
      <main className="overflow-hidden flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </main>
    );
  }

  // If redirected, component unmounts so no need to handle that here

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Find the Right Spare Parts, Fast.
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Welcome to <span className="font-semibold">Garage Kenya</span> —
          your one-stop shop for genuine car spare parts. Browse, order, and
          get them delivered to your doorstep.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <CustomButton
              title="Log In"
              containerStyles="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-gray-100"
            />
          </Link>
          <Link href="/signup">
            <CustomButton
              title="Sign Up"
              containerStyles="bg-yellow-400 text-gray-900 px-6 py-3 rounded-md font-bold hover:bg-yellow-500"
            />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Garage Kenya?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              From engines to body parts — find everything your car needs in one place.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Trusted Quality</h3>
            <p className="text-gray-600">
              We source from verified suppliers to ensure you get the best quality.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Get your parts quickly — wherever you are in Kenya.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
