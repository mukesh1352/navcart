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
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);

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
					{ city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
					{ city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
					{ city: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
					{ city: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
					{ city: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
					{ city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
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

	const copyToClipboard = (text: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => alert("Address copied to clipboard!"))
			.catch(() => alert("Could not copy address. Please copy manually."));
	};

	const retryLocation = () => {
		setLocationError(null);
		setUserLocation(null);
		// Optionally trigger location fetch again:
		// getUserLocation();
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
				Store Locations
			</h2>

			{locationError && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-start">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-yellow-400 mt-0.5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-yellow-700 text-sm">{locationError}</p>
							</div>
						</div>
						<button
							type="button"
							onClick={retryLocation}
							className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-300 transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			)}

			{loading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span className="ml-3 text-gray-600">Loading store locations...</span>
				</div>
			) : error ? (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
					<p className="text-red-700 font-medium">Error: {error}</p>
				</div>
			) : locations.length === 0 ? (
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
					<p className="text-gray-600">No store locations found.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{locations.map((loc, index) => {
						const distance = userLocation
							? calculateDistance(userLocation.lat, userLocation.lng, loc.lat, loc.lng)
							: null;

						return (
							<div
								key={`${loc.city}-${loc.lat}-${loc.lng}`}
								className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h3 className="text-xl font-semibold text-gray-800 mb-1">{loc.city}</h3>
										<p className="text-gray-600 mb-3">{loc.country}</p>
										<div className="text-sm text-gray-500 mb-2">
											<p>Latitude: {loc.lat.toFixed(4)}</p>
											<p>Longitude: {loc.lng.toFixed(4)}</p>
											{distance && (
												<p className="text-blue-600 font-medium mt-1">
													~{distance.toFixed(1)} km away
												</p>
											)}
										</div>
									</div>
									<div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
										Store #{index + 1}
									</div>
								</div>
								<div className="mt-4 pt-4 border-t border-gray-100">
									<div className="flex gap-2 mb-2">
										<button
											onClick={() => getDirections(loc, "google")}
											type="button"
											className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
											title={userLocation ? "Get turn-by-turn directions" : "Open in Google Maps"}
										>
											📍 Google Maps
										</button>
										<button
											onClick={() => getDirections(loc, "apple")}
											type="button"
											className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
											title={userLocation ? "Get turn-by-turn directions" : "Open in Apple Maps"}
										>
											🍎 Apple Maps
										</button>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => getDirections(loc, "manual")}
											type="button"
											className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
											title="Search for this location"
										>
											🔍 Search Location
										</button>
										<button
											onClick={() => copyToClipboard(`${loc.city}, ${loc.country}`)}
											type="button"
											className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
											title="Copy address to clipboard"
										>
											📋 Copy Address
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default StoreLocator;
