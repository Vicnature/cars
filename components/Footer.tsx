"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Footer = () => {
	const { data: session } = useSession();
	const pathname = usePathname();
	const role = session?.user?.role;

	const isAdmin = role === "admin";
	const isCustomer = role === "customer";

	return (
		<footer className="flex flex-col text-black-100 mt-5 border-t border-gray-100 bg-white dark:bg-gray-900">
			<div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
				{/* Left section */}
				<div className="flex flex-col justify-start items-start gap-2">
					<p className="text-base text-gray-700 dark:text-gray-300">
						Garage Kenya 2025 <br />
						All rights reserved &copy;
					</p>
				</div>

				{/* Right section - Dynamic Links */}
				<ul className="flex flex-col sm:flex-row flex-wrap gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
					{isCustomer && (
						<>
							<li>
								<Link href="/" className={pathname === "/" ? "text-blue-600" : ""}>
									Browse Parts
								</Link>
							</li>
							<li>
								<Link
									href="/my-orders"
									className={pathname.includes("my-orders") ? "text-blue-600" : ""}
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
									href="/admin/products"
									className={pathname.includes("admin/products") ? "text-blue-600" : ""}
								>
									Products
								</Link>
							</li>
							<li>
								<Link
									href="/admin/orders"
									className={pathname.includes("admin/orders") ? "text-blue-600" : ""}
								>
									Orders
								</Link>
							</li>
							<li>
								<Link
									href="/admin/users"
									className={pathname.includes("admin/users") ? "text-blue-600" : ""}
								>
									Customers
								</Link>
							</li>
							<li>
								<Link
									href="/admin/admins"
									className={pathname.includes("admin/admins") ? "text-blue-600" : ""}
								>
									Admins
								</Link>
							</li>
							<li>
								<Link
									href="/admin/paymentInstructions"
									className={
										pathname.includes("admin/paymentInstructions") ? "text-blue-600" : ""
									}
								>
									Payment Instructions
								</Link>
							</li>
						</>
					)}
				</ul>
			</div>

			<div className="flex justify-between items-center flex-wrap mt-10 border-t border-gray-100 sm:px-16 px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
				<p>@2025 Garage Ke. All rights reserved.</p>
				<div className="flex gap-4">
					{/* <Link href="/privacy-policy">Privacy Policy</Link> */}
					{/* <Link href="/terms-of-use">Terms of Use</Link> */}
				</div>
			</div>
		</footer>
	);
};

export default Footer;
