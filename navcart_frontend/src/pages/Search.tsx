import { useState } from "react";

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
			<h1 className="text-3xl font-bold mb-6 text-center">
				🛒 NavCart Path Finder
			</h1>

			<form onSubmit={handleSubmit} className="max-w-md mx-auto">
				<input
					type="text"
					value={itemsInput}
					onChange={(e) => setItemsInput(e.target.value)}
					placeholder="Enter items (comma separated)"
					className="w-full p-3 border rounded mb-4"
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
				<div className="mt-8 max-w-2xl mx-auto">
					<h2 className="text-xl font-semibold mb-2">Optimal Path:</h2>
					<div className="bg-white p-4 rounded shadow flex flex-wrap gap-2">
						{path.map((node, i) => (
							<div
								key={node.id}
								className="px-3 py-1 rounded-full bg-green-200 text-green-900 text-sm font-medium"
							>
								{i === 0 ? "🏁 " : ""}
								{node.name}
								{i === path.length - 1 ? " 🏁" : ""}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
