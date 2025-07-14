import { useEffect } from "react";
import {
	MapPin,
	Clock,
	Calendar,
	Star,
	Users,
	Utensils,
	Car,
	ArrowRight,
	Sparkles
} from "lucide-react";

const Index = () => {
	useEffect(() => {
		document.title = "Navcart | Smart Shopping Starts Here.";
	}, []);

	const departments = [
		{
			name: "Kids Section",
			category: "Family",
			rating: 4.8,
			image: "/images/kids.jpg",
			description: "Toys, clothes, and fun gear for kids",
			icon: "🧸",
			gradient: "from-pink-500 to-purple-600",
		},
		{
			name: "Fresh Fruits",
			category: "Groceries",
			rating: 4.9,
			image: "/images/fruits.jpg",
			description: "Fresh, organic fruits and vegetables",
			icon: "🍎",
			gradient: "from-green-500 to-emerald-600",
		},
		{
			name: "Snacks & Beverages",
			category: "Food",
			rating: 4.7,
			image: "/images/snacks.jpg",
			description: "Your favorite snacks and drinks",
			icon: "🍿",
			gradient: "from-orange-500 to-red-600",
		},
		{
			name: "Electronics",
			category: "Tech",
			rating: 4.6,
			image: "/images/electronics.jpg",
			description: "Latest gadgets and home electronics",
			icon: "📱",
			gradient: "from-blue-500 to-cyan-600",
		},
		{
			name: "Clothing & Fashion",
			category: "Apparel",
			rating: 4.8,
			image: "/images/fashion.jpg",
			description: "Trendy fashion for all ages",
			icon: "👕",
			gradient: "from-purple-500 to-pink-600",
		},
		{
			name: "Home & Garden",
			category: "Lifestyle",
			rating: 4.7,
			image: "/images/home.jpg",
			description: "Essentials for your home & garden",
			icon: "🏠",
			gradient: "from-amber-500 to-yellow-600",
		},
		{
			name: "Sports & Outdoors",
			category: "Recreation",
			rating: 4.5,
			image: "/images/sports.jpg",
			description: "Gear for every adventure",
			icon: "⚽",
			gradient: "from-teal-500 to-green-600",
		},
		{
			name: "Health & Beauty",
			category: "Wellness",
			rating: 4.6,
			image: "/images/beauty.jpg",
			description: "Care products that shine",
			icon: "💄",
			gradient: "from-rose-500 to-pink-600",
		},
	];

	const services = [
		{
			id: "food-court",
			icon: <Utensils className="w-6 h-6" />,
			title: "Food Court",
			description: "Dine in with multi-cuisine delights",
			color: "bg-gradient-to-br from-orange-100 to-red-100",
			iconColor: "text-orange-600",
		},
		{
			id: "parking",
			icon: <Car className="w-6 h-6" />,
			title: "Free Parking",
			description: "Ample and secure parking",
			color: "bg-gradient-to-br from-blue-100 to-cyan-100",
			iconColor: "text-blue-600",
		},
		{
			id: "support",
			icon: <Users className="w-6 h-6" />,
			title: "Customer Service",
			description: "Support that actually helps",
			color: "bg-gradient-to-br from-purple-100 to-pink-100",
			iconColor: "text-purple-600",
		},
		{
			id: "hours",
			icon: <Clock className="w-6 h-6" />,
			title: "Extended Hours",
			description: "Shop late, stress-free",
			color: "bg-gradient-to-br from-green-100 to-emerald-100",
			iconColor: "text-green-600",
		},
	];

	const weeklyDeals = [
		{
			id: "bogo",
			title: "Buy 1 Get 1 Free",
			date: "July 8 - July 14",
			discount: "100% on second item",
			gradient: "from-blue-500 to-purple-600",
			badge: "POPULAR",
		},
		{
			id: "fruit-offer",
			title: "Fresh Fruits Offer",
			date: "July 8 - July 10",
			discount: "Up to 40% off",
			gradient: "from-green-500 to-emerald-600",
			badge: "LIMITED",
		},
		{
			id: "fashion-fiesta",
			title: "Fashion Fiesta",
			date: "July 11 - July 14",
			discount: "Flat 30% off",
			gradient: "from-pink-500 to-rose-600",
			badge: "TRENDING",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900 font-sans">
			{/* Hero Section */}
			<section className="relative h-screen bg-[url('/image3.png')] bg-cover bg-center flex items-center justify-center text-white overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
				
				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
				</div>

				<div className="relative z-10 text-center space-y-8 px-4 max-w-4xl">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-4">
						<Sparkles className="w-4 h-4 text-yellow-400" />
						<span className="text-sm font-medium">Smart Shopping Revolution</span>
					</div>

					<h1 className="text-6xl md:text-8xl font-black drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
						NavCart
					</h1>
					<p className="text-xl md:text-3xl font-light text-blue-100 max-w-2xl mx-auto leading-relaxed">
						Where Innovation Meets Convenience
					</p>

					<div className="flex flex-wrap justify-center gap-4 pt-8">
  <button
    type="button"
    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
  >
    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
    <span>Store Locator</span>
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </button>

  <button
    type="button"
    className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
  >
    <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
    <span>Store Map</span>
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </button>
</div>



				</div>
			</section>

			{/* Stats */}
			<section className="py-20 bg-gradient-to-r from-white to-gray-50">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						{[
							["50+", "Departments", "from-blue-500 to-cyan-500"],
							["100K+", "Products", "from-purple-500 to-pink-500"],
							["25K+", "Daily Customers", "from-green-500 to-emerald-500"],
							["24/7", "Open Locations", "from-orange-500 to-red-500"],
						].map(([value, label, gradient]) => (
							<div key={label} className="group hover:scale-105 transition-transform duration-300">
								<div className={`text-5xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
									{value}
								</div>
								<p className="text-gray-600 font-medium">{label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Departments */}
			<section className="py-24 bg-gradient-to-br from-gray-50 to-white">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Shop by Department
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Discover curated categories designed for the modern shopper
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{departments.map((dept) => (
							<div
								key={dept.name}
								className="group bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
							>
								<div className="relative h-48 overflow-hidden">
									<div
										className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
										style={{ backgroundImage: `url(${dept.image})` }}
									/>
									<div className={`absolute inset-0 bg-gradient-to-t ${dept.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-6xl backdrop-blur-sm bg-white/20 p-4 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
											{dept.icon}
										</span>
									</div>
								</div>
								<div className="p-6 space-y-3">
									<div className="flex justify-between items-start">
										<h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
											{dept.name}
										</h3>
										<div className="flex items-center gap-1 text-yellow-500">
											<Star className="w-4 h-4 fill-current" />
											<span className="text-sm font-semibold">{dept.rating}</span>
										</div>
									</div>
									<div className={`inline-block px-3 py-1 bg-gradient-to-r ${dept.gradient} text-white text-xs font-semibold rounded-full`}>
										{dept.category}
									</div>
									<p className="text-gray-600 text-sm leading-relaxed">{dept.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Services */}
			<section className="py-24 bg-gradient-to-br from-white to-gray-50">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Premium Services
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Elevated shopping experience with world-class amenities
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{services.map((service) => (
							<div
								key={service.id}
								className={`group ${service.color} backdrop-blur-lg rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50`}
							>
								<div className={`w-16 h-16 mx-auto mb-6 ${service.iconColor} bg-white/50 backdrop-blur-lg flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
									{service.icon}
								</div>
								<h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
								<p className="text-gray-600 leading-relaxed">{service.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Weekly Deals */}
			<section className="py-24 bg-gradient-to-br from-gray-50 to-white">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Exclusive Deals
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Limited-time offers that redefine value
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{weeklyDeals.map((deal) => (
							<div
								key={deal.id}
								className="group relative bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
							>
								<div className="absolute top-4 right-4">
									<span className={`inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r ${deal.gradient} rounded-full`}>
										{deal.badge}
									</span>
								</div>
								
								<div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${deal.gradient} text-white flex items-center justify-center text-3xl font-black shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
									%
								</div>
								
								<h3 className="text-2xl font-bold text-gray-800 mb-2">{deal.title}</h3>
								<p className="text-gray-500 mb-4">{deal.date}</p>
								<div className={`text-2xl font-black bg-gradient-to-r ${deal.gradient} bg-clip-text text-transparent`}>
									{deal.discount}
								</div>
								
								<div className="mt-6">
									<button type = "button" className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${deal.gradient} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
										Claim Deal
										<ArrowRight className="w-4 h-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Index;