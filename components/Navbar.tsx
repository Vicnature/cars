/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
	const { data: session } = useSession();
	const pathname = usePathname();
	const role = session?.user?.role;

	const isAdmin = role === "admin";
	const isCustomer = role === "customer";

	return (
		<header className="w-full z-20 shadow bg-white dark:bg-gray-900 sticky top-0">
			<nav className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex justify-between items-center">
				{/* Logo */}
				{/* <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Garage Ke Logo"
            width={120}
            height={30}
            className="object-contain"
          />
        </Link> */}

				{/* Navigation Links */}
				<ul className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-600 dark:text-gray-200">
					{isCustomer && (
						<>
							<li>
								<Link
									href="/browse"
									className={pathname === "/browse" ? "text-blue-600" : ""}
								>
									Browse Parts
								</Link>
							</li>
							<li>
								<Link
									href="/my-orders"
									className={
										pathname.includes("my-orders") ? "text-blue-600" : ""
									}
								>
									My Orders
								</Link>
							</li>
						</>
					)}

					{isAdmin && (
						<>
							<li>
								<Link
									href="/admin/dashboard"
									className={
										pathname.includes("admin/products") ? "text-blue-600" : ""
									}
								>
									Dashboard
								</Link>
							</li>
							<li>
								<Link
									href="/admin/products"
									className={
										pathname.includes("admin/products") ? "text-blue-600" : ""
									}
								>
									Products
								</Link>
							</li>
							<li>
								<Link
									href="/admin/orders"
									className={
										pathname.includes("admin/orders") ? "text-blue-600" : ""
									}
								>
									Orders
								</Link>
							</li>
							<li>
								<Link
									href="/admin/users"
									className={
										pathname.includes("admin/users") ? "text-blue-600" : ""
									}
								>
									Customers
								</Link>
							</li>
							<li>
								<Link
									href="/admin/admins"
									className={
										pathname.includes("admin/admins") ? "text-blue-600" : ""
									}
								>
									Admins
								</Link>
							</li>
							<li>
								<Link
									href="/admin/paymentInstructions"
									className={
										pathname.includes("admin/paymentInstructions") ?
											"text-blue-600"
										:	""
									}
								>
									Payment Instructions
								</Link>
							</li>
							<li>
								<Link
									href="/admin/reports"
									className={
										pathname.includes("admin/reports") ? "text-blue-600" : ""
									}
								>
									Reports
								</Link>
							</li>
						</>
					)}
				</ul>

				{/* Auth Button */}
				<div className="flex items-center gap-4">
					{session ?
						<>
							<span className="text-sm text-gray-500 hidden md:inline">
								{session.user?.name || session.user?.email}
							</span>
							<button
								onClick={() => signOut({ callbackUrl: "/", redirect: true })}
								className="bg-red-100 text-red-600 px-4 py-2 text-sm rounded hover:bg-red-200 transition"
							>
								Sign Out
							</button>
						</>
					:	<button
							onClick={() => signIn()}
							className="bg-primary-blue text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition"
						>
							Sign In
						</button>
					}
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
