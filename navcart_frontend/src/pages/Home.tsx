import { useEffect } from "react";
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
    document.title = "MegaMart | Your One-Stop Shopping Destination";
  }, []);

  const departments = [
    {
      name: "Kids Section",
      category: "Family",
      rating: 4.8,
      image: "/placeholder.svg",
      description: "Toys, clothes, and everything for children",
      icon: "🧸",
    },
    {
      name: "Fresh Fruits",
      category: "Groceries",
      rating: 4.9,
      image: "/placeholder.svg",
      description: "Fresh, organic fruits and vegetables",
      icon: "🍎",
    },
    {
      name: "Snacks & Beverages",
      category: "Food",
      rating: 4.7,
      image: "/placeholder.svg",
      description: "Your favorite snacks and drinks",
      icon: "🍿",
    },
    {
      name: "Electronics",
      category: "Tech",
      rating: 4.6,
      image: "/placeholder.svg",
      description: "Latest gadgets and home electronics",
      icon: "📱",
    },
    {
      name: "Clothing & Fashion",
      category: "Apparel",
      rating: 4.8,
      image: "/placeholder.svg",
      description: "Trendy clothes for all ages",
      icon: "👕",
    },
    {
      name: "Home & Garden",
      category: "Lifestyle",
      rating: 4.7,
      image: "/placeholder.svg",
      description: "Everything for your home and garden",
      icon: "🏠",
    },
    {
      name: "Sports & Outdoors",
      category: "Recreation",
      rating: 4.5,
      image: "/placeholder.svg",
      description: "Sports equipment and outdoor gear",
      icon: "⚽",
    },
    {
      name: "Health & Beauty",
      category: "Wellness",
      rating: 4.6,
      image: "/placeholder.svg",
      description: "Personal care and beauty products",
      icon: "💄",
    },
  ];

  const services = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Food Court",
      description: "Multiple dining options available",
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Free Parking",
      description: "Ample parking space for all customers",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Service",
      description: "Friendly staff ready to help",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Extended Hours",
      description: "Open 7 days a week",
    },
  ];

  const weeklyDeals = [
    {
      date: "Mon-Wed",
      title: "Fresh Produce Sale",
      discount: "20% OFF",
    },
    {
      date: "Thu-Fri",
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
    <div className="bg-base-100 text-base-content">
      {/* Hero */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-green-600 to-orange-600 text-white flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold">MegaMart</h1>
          <p className="text-xl md:text-2xl">Your One-Stop Shopping Destination</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary text-white">
              <MapPin className="w-5 h-5 mr-2" />
              Store Locator
            </button>
            <button className="btn btn-outline text-white border-white hover:bg-white hover:text-primary">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Deals
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { label: "Departments", value: "50+" },
            { label: "Products", value: "100K+" },
            { label: "Daily Customers", value: "25K+" },
            { label: "24/7 Locations", value: "24/7" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">Shop by Department</h2>
            <p className="text-gray-500 text-lg">Everything you need in one place</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, i) => (
              <div
                key={i}
                className="card bg-base-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <figure className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center text-6xl">
                  {dept.icon}
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title">{dept.name}</h3>
                    <div className="flex items-center text-yellow-500 gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{dept.rating}</span>
                    </div>
                  </div>
                  <div className="badge badge-secondary my-2">{dept.category}</div>
                  <p className="text-gray-600">{dept.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">Store Services</h2>
            <p className="text-gray-500 text-lg">We’re here to make shopping easier</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="card bg-base-100 p-6 text-center shadow hover:shadow-lg"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Deals */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">This Week's Deals</h2>
            <p className="text-gray-500 text-lg">Limited-time offers you can't miss</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {weeklyDeals.map((deal, i) => (
              <div
                key={i}
                className="card border-2 border-dashed border-primary/30 p-6 text-center hover:shadow-lg transition"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  %
                </div>
                <h3 className="text-lg font-semibold">{deal.title}</h3>
                <p className="text-gray-500">{deal.date}</p>
                <p className="text-primary font-bold text-xl mt-2">{deal.discount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
