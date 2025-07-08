import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const Finder = () => {
  const [floor, setFloor] = useState("ground");
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [departments, setDepartments] = useState<Record<string, Department>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItemsAndDepartments = async () => {
      setLoading(true);
      setError("");
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
        setFilteredItems(itemsData);
        setDepartments(deptMap);
        setCollapsed({});
      } catch (err) {
        console.error(err);
        setError("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemsAndDepartments();
  }, [floor]);

  useEffect(() => {
    const searchTerm = itemName.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    setFilteredItems(filtered);
  }, [itemName, items]);

  const toggleCollapse = (deptId: string) => {
    setCollapsed((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const groupItemsByDepartment = (): GroupedItems => {
    return filteredItems.reduce((groups: GroupedItems, item) => {
      if (!groups[item.department_id]) groups[item.department_id] = [];
      groups[item.department_id].push(item);
      return groups;
    }, {});
  };

  const groupedItems = groupItemsByDepartment();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 rounded-xl shadow-md bg-white space-y-6">
     <div className="text-center space-y-3">
  <h2 className="text-3xl font-bold text-primary">🛒 Find Items by Floor & Department</h2>

  <div className="alert alert-info justify-center mx-auto max-w-md shadow-md">
    <span>
      Looking for multiple items?&nbsp;
      <a
        href="/multifinder"
        className="link link-hover link-secondary font-semibold"
      >
        Click here
      </a>
      .
    </span>
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block font-semibold">Search Item</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Soap, Biscuit..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          />
          {itemName && (
            <button
              onClick={() => setItemName("")}
              className="absolute right-2 top-[38px] text-gray-500"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div>
          <label className="block font-semibold">Select Floor</label>
          <select
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
          >
            <option value="ground">Ground Floor</option>
            <option value="first">First Floor</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center font-medium">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-500">
          No items found.
          <p className="text-sm mt-1">Try different keywords or clear the search.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([deptId, deptItems]) => {
            const isCollapsed = collapsed[deptId];
            return (
              <div key={deptId} className="border-t pt-4">
                <div
                  onClick={() => toggleCollapse(deptId)}
                  className="flex justify-between items-center cursor-pointer mb-2"
                >
                  <h3 className="text-xl font-semibold">
                    🏷 {departments[deptId]?.name || "Unknown Department"}
                  </h3>
                  {isCollapsed ? <ChevronDown /> : <ChevronUp />}
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-x-auto"
                    >
                      <div className="flex space-x-4 pb-2">
                        {deptItems.map((item) => (
                          <div
                            key={item.id}
                            className="min-w-[250px] flex-shrink-0 bg-white border rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
                          >
                            <h4 className="text-lg font-semibold mb-1">{item.name}</h4>
                            <p className="text-gray-600">Brand: {item.brand}</p>
                            <p className="text-gray-600">Price: ₹{item.price}</p>
                            <p className="text-gray-600">Unit: {item.unit}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Finder;
