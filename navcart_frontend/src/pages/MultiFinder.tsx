import { useEffect, useState } from "react";

type Item = {
  id: string;
  name: string;
  brand: string;
  price: number;
  unit: string;
  department_id: string;
};

type Department = {
  id: string;
  name: string;
  floor: string;
};

type GroupedItems = {
  [departmentId: string]: Item[];
};

const MultiItemFinder = () => {
  const [floor, setFloor] = useState("ground");
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [departments, setDepartments] = useState<Record<string, Department>>({});
  const [results, setResults] = useState<GroupedItems>({});
  const [notFound, setNotFound] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItemsAndDepartments = async () => {
      setLoading(true);
      try {
        const [itemsRes, groupedRes] = await Promise.all([
          fetch(`https://navcart-go.onrender.com/items?floor=${floor}`),
          fetch(`https://navcart-go.onrender.com/grouped-items?floor=${floor}`)
        ]);

        if (!itemsRes.ok || !groupedRes.ok) throw new Error("Failed to fetch data");

        const itemsData: Item[] = await itemsRes.json();
        const groupedData: Record<string, Item[]> = await groupedRes.json();

        const deptMap: Record<string, Department> = {};
        for (const [deptName, deptItems] of Object.entries(groupedData)) {
          if (deptItems.length > 0) {
            const deptId = deptItems[0].department_id;
            deptMap[deptId] = { id: deptId, name: deptName, floor };
          }
        }

        setItems(itemsData);
        setDepartments(deptMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemsAndDepartments();
  }, [floor]);

  const handleSearch = () => {
    const keywords = inputText
      .split(",")
      .map((word) => word.trim().toLowerCase())
      .filter((w) => w !== "");

    const matched: GroupedItems = {};
    const notFoundItems: string[] = [];

    keywords.forEach((keyword) => {
      const matches = items.filter((item) =>
        item.name.toLowerCase().includes(keyword)
      );

      if (matches.length === 0) {
        notFoundItems.push(keyword);
      } else {
        matches.forEach((item) => {
          if (!matched[item.department_id]) {
            matched[item.department_id] = [];
          }
          matched[item.department_id].push(item);
        });
      }
    });

    setResults(matched);
    setNotFound(notFoundItems);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-xl shadow bg-white space-y-6">
      <h2 className="text-2xl font-bold text-center">🧾 Multi-Item Department Finder</h2>

      <div className="space-y-4">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter item names, separated by commas (e.g., Soap, Biscuit, Shampoo)"
          className="w-full p-3 border rounded-md resize-none"
        />

        <div className="flex justify-between items-center gap-4">
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-40 px-3 py-2 border rounded-md"
          >
            <option value="ground">Ground Floor</option>
            <option value="first">First Floor</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            🔍 Find Departments
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Loading items...</p>}

      <div className="space-y-6">
        {Object.entries(results).map(([deptId, deptItems]) => (
          <div key={deptId}>
            <h3 className="text-xl font-semibold mb-2">
              🏷 Department: {departments[deptId]?.name || "Unknown"}
            </h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {deptItems.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[250px] bg-white border rounded-lg shadow p-4"
                >
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                  <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-600">Unit: {item.unit}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {notFound.length > 0 && (
          <div className="text-red-600 mt-4">
             Not Found: {notFound.map((word, i) => (
              <span key={i} className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-2">
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiItemFinder;
