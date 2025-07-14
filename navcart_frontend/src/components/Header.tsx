import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

const Header = () => {
	return (
		<header className="sticky top-0 z-50 w-full bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md">
			<div className="container mx-auto px-6 py-4 flex items-center justify-between">
				{/* Logo / Brand */}
				<Link
					to="/"
					className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2 hover:opacity-90 transition-opacity"
				>
					<ShoppingCart className="w-6 h-6 text-yellow-400 animate-pulse" />
					NAVCART
				</Link>
			</div>
		</header>
	);
};

export default Header;
