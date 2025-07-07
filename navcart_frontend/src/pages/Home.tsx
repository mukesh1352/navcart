import { useEffect } from "react";
import Footer from "../components/Footer";
import {
  MapPin,
  Clock,
  Calendar,
  Star,
  Users,
  Utensils,
  Car,
} from "lucide-react";

const Index = () => {
  useEffect(() => {
    document.title = "Navcart | Where life begins";
  }, []);

  const departments = [
    {
      name: "Kids Section",
      category: "Family",
      rating: 4.8,
      image: "/images/kids.jpg",
      description: "Toys, clothes, and fun gear for kids",
      icon: "🧸",
    },
    {
      name: "Fresh Fruits",
      category: "Groceries",
      rating: 4.9,
      image: "/images/fruits.jpg",
      description: "Fresh, organic fruits and vegetables",
      icon: "🍎",
    },
    {
      name: "Snacks & Beverages",
      category: "Food",
      rating: 4.7,
      image: "/images/snacks.jpg",
      description: "Your favorite snacks and drinks",
      icon: "🍿",
    },
    {
      name: "Electronics",
      category: "Tech",
      rating: 4.6,
      image: "/images/electronics.jpg",
      description: "Latest gadgets and home electronics",
      icon: "📱",
    },
    {
      name: "Clothing & Fashion",
      category: "Apparel",
      rating: 4.8,
      image: "/images/fashion.jpg",
      description: "Trendy fashion for all ages",
      icon: "👕",
    },
    {
      name: "Home & Garden",
      category: "Lifestyle",
      rating: 4.7,
      image: "/images/home.jpg",
      description: "Essentials for your home & garden",
      icon: "🏠",
    },
    {
      name: "Sports & Outdoors",
      category: "Recreation",
      rating: 4.5,
      image: "/images/sports.jpg",
      description: "Gear for every adventure",
      icon: "⚽",
    },
    {
      name: "Health & Beauty",
      category: "Wellness",
      rating: 4.6,
      image: "/images/beauty.jpg",
      description: "Care products that shine",
      icon: "💄",
    },
  ];

  const services = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Food Court",
      description: "Dine in with multi-cuisine delights",
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Free Parking",
      description: "Ample and secure parking",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Service",
      description: "Support that actually helps",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Extended Hours",
      description: "Shop late, stress-free",
    },
  ];

  const weeklyDeals = [
    {
      date: "Mon–Wed",
      title: "Fresh Produce Sale",
      discount: "20% OFF",
    },
    {
      date: "Thu–Fri",
      title: "Electronics Clearance",
      discount: "Up to 30% OFF",
    },
    {
      date: "Weekend",
      title: "Kids Items Special",
      discount: "Buy 2 Get 1 FREE",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      {/* Hero Section */}
<section className="relative h-[90vh] bg-[url('/public/image3.png')] bg-cover bg-center flex items-center justify-center text-white">
  <div className="absolute inset-0 bg-black/50" />

  {/* Background image behind the NavCart title */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20">
    <img
      src="/images/navcart-logo-bg.png" // <-- replace with your image path
      alt="NavCart Background"
      className="w-72 h-72 object-contain"
    />
  </div>

  <div className="relative z-10 text-center space-y-6 px-4 max-w-3xl">
    <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
      NavCart
    </h1>
    <p className="text-xl md:text-2xl font-light">Where life begins</p>
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white">
        <MapPin className="w-5 h-5" />
        Store Locator
      </button>
      <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white text-white hover:bg-white hover:text-black transition">
        <Calendar className="w-5 h-5" />
        Weekly Deals
      </button>
    </div>
  </div>
</section>


      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["50+", "Departments"],
            ["100K+", "Products"],
            ["25K+", "Daily Customers"],
            ["24/7", "Open Locations"],
          ].map(([value, label], index) => (
            <div key={index}>
              <div className="text-4xl font-extrabold text-blue-600">{value}</div>
              <p className="text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Shop by Department</h2>
            <p className="text-lg text-gray-600">Explore categories crafted for convenience</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, i) => (
              <div
                key={i}
                className="group bg-white border rounded-2xl overflow-hidden shadow hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div
                  className="h-40 bg-cover bg-center flex items-center justify-center text-6xl"
                  style={{ backgroundImage: `url(${dept.image})` }}
                >
                  <span className="backdrop-blur bg-black/20 p-2 rounded-xl">
                    {dept.icon}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{dept.name}</h3>
                    <span className="flex items-center gap-1 text-yellow-500 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      {dept.rating}
                    </span>
                  </div>
                  <div className="text-xs inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded">
                    {dept.category}
                  </div>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">In-Store Services</h2>
            <p className="text-lg text-gray-600">Extra convenience at your fingertips</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Deals Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">This Week’s Deals</h2>
            <p className="text-lg text-gray-600">Limited-time offers you’ll love</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {weeklyDeals.map((deal, i) => (
              <div
                key={i}
                className="bg-white border border-dashed border-blue-300 rounded-2xl p-6 text-center shadow hover:shadow-lg transition"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  %
                </div>
                <h3 className="text-lg font-semibold">{deal.title}</h3>
                <p className="text-sm text-gray-500">{deal.date}</p>
                <div className="text-lg font-bold text-blue-600 mt-1">
                  {deal.discount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
