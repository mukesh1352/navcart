import { useState } from "react";
import { motion } from "framer-motion";

interface ItemDepartment {
	item: string;
	department: string;
}

export default function Search() {
	const [itemsInput, setItemsInput] = useState("");
	const [allDepartments, setAllDepartments] = useState<string[]>([]);
	const [path, setPath] = useState<string[]>([]);
	const [itemDepartments, setItemDepartments] = useState<ItemDepartment[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setAllDepartments([]);
		setPath([]);
		setItemDepartments([]);
		setLoading(true);

		const items = itemsInput
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);

		if (items.length === 0) {
			setError("Please enter at least one item.");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("http://localhost:3000/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ items }),
			});

			const data = await res.json();
			console.log("Response data from backend:", data);

			if (!res.ok) {
				setError(data.error || "Unexpected error occurred.");
			} else {
				setAllDepartments(data.allDepartments || data.departments || []);
				setPath(data.path || []);
				setItemDepartments(data.itemDepartments || []);
			}
		} catch (_err) {
			setError("Failed to connect to backend.");
		}

		setLoading(false);
	};

	const getColorClass = (dept: string) => {
		if (dept === path[0]) return "bg-yellow-200 border-yellow-500";
		if (dept === path[path.length - 1]) return "bg-red-200 border-red-500";
		if (path.includes(dept)) return "bg-green-200 border-green-500";
		return "bg-gray-200 border-gray-400 text-gray-600";
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
				🛒 NavCart Path Finder
			</h1>

			<form onSubmit={handleSubmit} className="max-w-md mx-auto">
				<input
					type="text"
					value={itemsInput}
					onChange={(e) => setItemsInput(e.target.value)}
					placeholder="Enter items (comma separated)"
					className="w-full p-3 border rounded mb-4 shadow-sm"
				/>
				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
				>
					{loading ? "Finding Path..." : "Get Optimal Path"}
				</button>
			</form>

			{error && <div className="text-red-600 text-center mt-4">{error}</div>}

			{itemDepartments.length > 0 && (
				<div className="max-w-xl mx-auto mt-10">
					<h2 className="text-lg font-semibold mb-3 text-center">
						🧾 Item-to-Department Mapping
					</h2>
					<ul className="bg-white p-4 rounded shadow divide-y divide-gray-200">
						{itemDepartments.map(({ item, department }) => (
							<li
								key={`${item}-${department}`}
								className="py-2 flex justify-between"
							>
								<span className="font-medium text-gray-700">{item}</span>
								<span className="text-blue-600">{department}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{allDepartments.length > 0 && (
				<div className="mt-12 max-w-6xl mx-auto">
					<h2 className="text-xl font-semibold mb-4 text-center">
						🗺️ Full Store Map (Optimal Path Highlighted)
					</h2>

					{/* 🧭 Legend */}
					<div className="flex justify-center flex-wrap gap-4 mb-6 text-sm font-medium">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded" />
							<span>Start</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-green-200 border border-green-500 rounded" />
							<span>In Path</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-red-200 border border-red-500 rounded" />
							<span>End</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded" />
							<span>Not in Path</span>
						</div>
					</div>

					{/* 🧱 Store Layout Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white p-6 rounded shadow">
						{allDepartments.map((dept) => (
							<motion.div
								key={dept}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
								className={`text-center p-4 rounded-xl border-2 shadow-sm font-medium ${getColorClass(dept)}`}
							>
								{dept}
							</motion.div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
