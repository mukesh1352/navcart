import { useState } from "react";
import { motion } from "framer-motion";

export default function Search() {
	const [itemsInput, setItemsInput] = useState("");
	const [departments, setDepartments] = useState<string[]>([]);
	const [path, setPath] = useState<{ id: string; name: string }[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setDepartments([]);
		setPath([]);
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

			if (!res.ok) {
				setError(data.error || "Unexpected error occurred.");
			} else {
				setDepartments(data.departments || []);
				const pathData = (data.path || []).map((node: string) => ({
					id: crypto.randomUUID(),
					name: node,
				}));
				setPath(pathData);
			}
		} catch (_err) {
			setError("Failed to connect to backend.");
		}

		setLoading(false);
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

			{departments.length > 0 && (
				<div className="mt-8 max-w-2xl mx-auto">
					<h2 className="text-xl font-semibold mb-2">Matched Departments:</h2>
					<ul className="list-disc list-inside bg-white p-4 rounded shadow">
						{departments.map((dept) => (
							<li key={dept}>{dept}</li>
						))}
					</ul>
				</div>
			)}

			{path.length > 0 && (
				<div className="mt-12 max-w-4xl mx-auto">
					<h2 className="text-xl font-semibold mb-4 text-center">🗺️ Optimal Path Map</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-6 rounded shadow">
						{path.map((node, i) => (
							<motion.div
								key={node.id}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: i * 0.1 }}
								className={`text-center p-4 rounded-xl border-2 ${
									i === 0
										? "bg-yellow-200 border-yellow-400"
										: i === path.length - 1
										? "bg-red-200 border-red-400"
										: "bg-green-200 border-green-400"
								} shadow-md`}
							>
								<div className="text-xl font-bold">
									{i === 0 ? "🏁" : i === path.length - 1 ? "🏁" : "➡️"}
								</div>
								<div className="text-lg font-medium mt-1">{node.name}</div>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
