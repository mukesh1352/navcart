import { useEffect, useState } from "react";

type Location = {
	city: string;
	country: string;
	lat: number;
	lng: number;
};

const StoreLocator = () => {
	const [locations, setLocations] = useState<Location[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

	useEffect(() => {
		const fetchLocations = async () => {
			setLoading(true);
			try {
				// Simulate API call with mock data since we can't make external requests
				await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading

				const mockLocations: Location[] = [
					{ city: "Tokyo", country: "Japan", lat: 35.6895, lng: 139.6917 },
					{ city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
					{ city: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
					{ city: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
					{ city: "Delhi", country: "India", lat: 28.7041, lng: 77.1025 },
					{ city: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
					{ city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
					{
						city: "Singapore",
						country: "Singapore",
						lat: 1.3521,
						lng: 103.8198,
					},
					{ city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
					{
						city: "Jakarta",
						country: "Indonesia",
						lat: -6.2088,
						lng: 106.8456,
					},
					{
						city: "Kuala Lumpur",
						country: "Malaysia",
						lat: 3.139,
						lng: 101.6869,
					},
					{
						city: "Manila",
						country: "Philippines",
						lat: 14.5995,
						lng: 120.9842,
					},
					{
						city: "Ho Chi Minh City",
						country: "Vietnam",
						lat: 10.8231,
						lng: 106.6297,
					},
					{ city: "Coimbatore", country: "India", lat: 11.0168, lng: 76.9558 },
				];

				// Randomly select 8-15 locations from the comprehensive list
				const randomCount = Math.floor(Math.random() * 8) + 8; // 8 to 15 locations
				const shuffled = [...mockLocations].sort(() => Math.random() - 0.5);
				const selectedLocations = shuffled.slice(0, randomCount);

				setLocations(selectedLocations);
				setError(null);
			} catch (err: unknown) {
				if (err instanceof Error) {
					console.error("Error fetching store locations:", err);
					setError(err.message);
				} else {
					console.error("Unknown error:", err);
					setError("Something went wrong");
				}
			} finally {
				setLoading(false);
			}
		};

		const getUserLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setUserLocation({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						});
						setLocationError(null); // Clear any previous errors
					},
					(error) => {
						console.error("Error getting user location:", error);
						let errorMessage = "Unable to get your location. ";

						switch (error.code) {
							case error.PERMISSION_DENIED:
								errorMessage +=
									'Location access was denied. Click "Allow" if prompted, or use the manual direction options below.';
								break;
							case error.POSITION_UNAVAILABLE:
								errorMessage +=
									"Location information is unavailable. Please check your device settings.";
								break;
							case error.TIMEOUT:
								errorMessage +=
									"Location request timed out. Please try refreshing the page.";
								break;
							default:
								errorMessage +=
									"An unknown error occurred. You can still get directions manually.";
								break;
						}

						setLocationError(errorMessage);
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 300000, // 5 minutes
					},
				);
			} else {
				setLocationError(
					"Geolocation is not supported by this browser. You can still get directions manually.",
				);
			}
		};

		fetchLocations();
		getUserLocation();
	}, []);

	const calculateDistance = (
		lat1: number,
		lng1: number,
		lat2: number,
		lng2: number,
	): number => {
		const R = 6371; // Earth's radius in kilometers
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLng = ((lng2 - lng1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLng / 2) *
				Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	const getDirections = (
		location: Location,
		method: "google" | "apple" | "manual" = "google",
	) => {
		const destination = `${location.lat},${location.lng}`;
		const locationName = `${location.city}, ${location.country}`;

		let url: string;

		switch (method) {
			case "google":
				if (userLocation) {
					url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination}`;
				} else {
					url = `https://www.google.com/maps/dir//${destination}`;
				}
				break;
			case "apple":
				if (userLocation) {
					url = `http://maps.apple.com/?saddr=${userLocation.lat},${userLocation.lng}&daddr=${destination}`;
				} else {
					url = `http://maps.apple.com/?daddr=${destination}`;
				}
				break;
			case "manual":
				url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
				break;
			default:
				url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
		}

		window.open(url, "_blank");
	};

	const copyToClipboard = (text: string, index: number) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopiedIndex(index);
				setTimeout(() => setCopiedIndex(null), 2000);
			})
			.catch(() => alert("Could not copy address. Please copy manually."));
	};

	const retryLocation = () => {
		setLocationError(null);
		setUserLocation(null);
		// Optionally trigger location fetch again:
		// getUserLocation();
	};

	const getCountryFlag = (country: string) => {
		const flags: { [key: string]: string } = {
			Japan: "🇯🇵",
			China: "🇨🇳",
			India: "🇮🇳",
			"South Korea": "🇰🇷",
			Singapore: "🇸🇬",
			Thailand: "🇹🇭",
			Indonesia: "🇮🇩",
			Malaysia: "🇲🇾",
			Philippines: "🇵🇭",
			Vietnam: "🇻🇳",
		};
		return flags[country] || "🏪";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header with enhanced styling */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
						<span className="text-3xl">🏪</span>
					</div>
					<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
						Store Locations
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Find our stores near you and get instant directions to visit us
					</p>
				</div>

				{/* Location Error Alert with enhanced styling */}
				{locationError && (
					<div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
										<svg
											className="h-6 w-6 text-amber-600"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
											role="img"
											aria-labelledby="warningIconTitle"
										>
											<title id="warningIconTitle">Warning icon</title>
											<path
												fillRule="evenodd"
												d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-semibold text-amber-800 mb-1">
										Location Access
									</h3>
									<p className="text-amber-700">{locationError}</p>
								</div>
							</div>
							<button
								type="button"
								onClick={retryLocation}
								className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
							>
								Try Again
							</button>
						</div>
					</div>
				)}

				{/* Loading State with enhanced animation */}
				{loading ? (
					<div className="flex flex-col justify-center items-center py-20">
						<div className="relative">
							<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
							<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
						</div>
						<div className="mt-6 text-center">
							<p className="text-xl text-gray-600 mb-2">
								Loading store locations...
							</p>
							<div className="flex space-x-1 justify-center">
								<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
								<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
								<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
							</div>
						</div>
					</div>
				) : error ? (
					<div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-2xl">❌</span>
						</div>
						<h3 className="text-2xl font-bold text-red-800 mb-2">
							Oops! Something went wrong
						</h3>
						<p className="text-red-700 text-lg">Error: {error}</p>
					</div>
				) : locations.length === 0 ? (
					<div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-12 text-center shadow-lg">
						<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-3xl">🔍</span>
						</div>
						<h3 className="text-2xl font-bold text-gray-800 mb-2">
							No stores found
						</h3>
						<p className="text-gray-600 text-lg">
							We couldn't find any store locations at the moment.
						</p>
					</div>
				) : (
					<>
						{/* Stats Bar */}
						<div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="text-center">
									<div className="text-3xl font-bold text-blue-600 mb-1">
										{locations.length}
									</div>
									<div className="text-gray-600">Total Stores</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-green-600 mb-1">
										{userLocation ? locations.length : 0}
									</div>
									<div className="text-gray-600">With Distance Info</div>
								</div>
								<div className="text-center">
									<div className="text-3xl font-bold text-purple-600 mb-1">
										{new Set(locations.map((loc) => loc.country)).size}
									</div>
									<div className="text-gray-600">Countries</div>
								</div>
							</div>
						</div>

						{/* Store Cards Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{locations.map((loc, index) => {
								const distance = userLocation
									? calculateDistance(
											userLocation.lat,
											userLocation.lng,
											loc.lat,
											loc.lng,
										)
									: null;

								return (
									<div
										key={`${loc.city}-${loc.lat}-${loc.lng}`}
										className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/80"
									>
										{/* Card Header */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center">
												<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
													<span className="text-xl">
														{getCountryFlag(loc.country)}
													</span>
												</div>
												<div>
													<h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
														{loc.city}
													</h3>
													<p className="text-gray-600">{loc.country}</p>
												</div>
											</div>
											<div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
												#{index + 1}
											</div>
										</div>

										{/* Location Details */}
										<div className="bg-gray-50/50 rounded-xl p-4 mb-4">
											<div className="text-sm text-gray-600 space-y-1">
												<div className="flex justify-between">
													<span>Latitude:</span>
													<span className="font-mono">
														{loc.lat.toFixed(4)}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Longitude:</span>
													<span className="font-mono">
														{loc.lng.toFixed(4)}
													</span>
												</div>
												{distance && (
													<div className="flex justify-between pt-2 border-t border-gray-200">
														<span>Distance:</span>
														<span className="font-bold text-blue-600">
															~{distance.toFixed(1)} km away
														</span>
													</div>
												)}
											</div>
										</div>

										{/* Action Buttons */}
										<div className="space-y-3">
											<div className="grid grid-cols-2 gap-3">
												<button
													onClick={() => getDirections(loc, "google")}
													type="button"
													className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm transform hover:scale-105 shadow-lg hover:shadow-xl"
													title={
														userLocation
															? "Get turn-by-turn directions"
															: "Open in Google Maps"
													}
												>
													📍 Google Maps
												</button>
												<button
													onClick={() => getDirections(loc, "apple")}
													type="button"
													className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium text-sm transform hover:scale-105 shadow-lg hover:shadow-xl"
													title={
														userLocation
															? "Get turn-by-turn directions"
															: "Open in Apple Maps"
													}
												>
													🍎 Apple Maps
												</button>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<button
													onClick={() => getDirections(loc, "manual")}
													type="button"
													className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium text-sm transform hover:scale-105 shadow-lg hover:shadow-xl"
													title="Search for this location"
												>
													🔍 Search Location
												</button>
												<button
													onClick={() =>
														copyToClipboard(
															`${loc.city}, ${loc.country}`,
															index,
														)
													}
													type="button"
													className={`transition-all duration-200 font-medium text-sm transform hover:scale-105 shadow-lg hover:shadow-xl py-3 px-4 rounded-xl ${
														copiedIndex === index
															? "bg-gradient-to-r from-green-500 to-green-600 text-white"
															: "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
													}`}
													title="Copy address to clipboard"
												>
													{copiedIndex === index
														? "✅ Copied!"
														: "📋 Copy Address"}
												</button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default StoreLocator;
