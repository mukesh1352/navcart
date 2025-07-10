import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Package, 
  Clock, 
  DollarSign, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Store,
  BarChart3
} from 'lucide-react';

// TypeScript interfaces
interface Store {
  storeId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface InventoryItem {
  storeId: string;
  itemId: string;
  name: string;
  inStock: boolean;
  quantity: number;
  lastUpdated: string;
}

interface Deal {
  storeId: string;
  title: string;
  description: string;
  validUntil: string;
}

interface RestockPrediction {
  prediction: string | null;
  confidence: number;
  message: string;
}

interface ApiError {
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
}

// Custom hooks for better state management
const useApi = (baseUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const apiCall = useCallback(async (endpoint: string, options?: RequestInit) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError({ message: errorMessage, type: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return { apiCall, loading, error, setError };
};

// Alert component for better user feedback
const Alert: React.FC<{ alert: ApiError; onClose: () => void }> = ({ alert, onClose }) => {
  const icons = {
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${colors[alert.type]} animate-in slide-in-from-top-2 duration-300`}>
      {icons[alert.type]}
      <span className="flex-1">{alert.message}</span>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

// Enhanced stock badge with better styling
const StockBadge: React.FC<{ inStock: boolean; quantity: number }> = ({ inStock, quantity }) => {
  const getStatusColor = () => {
    if (!inStock) return 'bg-red-100 text-red-800 border-red-200';
    if (quantity < 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusText = () => {
    if (!inStock) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${inStock ? (quantity < 10 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-red-500'}`} />
      {getStatusText()}
    </span>
  );
};

// Loading spinner component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-blue-500 border-t-transparent ${sizeClasses[size]}`} />
    </div>
  );
};

// Enhanced inventory card with better UX
const InventoryCard: React.FC<{ 
  item: InventoryItem; 
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onSubscribeToRestock: (itemId: string, email: string) => void;
  onGetPrediction: (itemId: string) => Promise<RestockPrediction | null>;
}> = ({ item, onUpdateQuantity, onSubscribeToRestock, onGetPrediction }) => {
  const [showPrediction, setShowPrediction] = useState(false);
  const [prediction, setPrediction] = useState<RestockPrediction | null>(null);
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);

  const handlePredictionClick = async () => {
    if (!item.inStock && !showPrediction) {
      setPredictionLoading(true);
      try {
        const predictionData = await onGetPrediction(item.itemId);
        setPrediction(predictionData);
        setShowPrediction(true);
      } catch (error) {
        console.error('Error getting prediction:', error);
      } finally {
        setPredictionLoading(false);
      }
    } else {
      setShowPrediction(!showPrediction);
    }
  };

  const handleUpdateQuantity = () => {
    const qty = parseInt(quantity);
    if (!isNaN(qty) && qty >= 0) {
      onUpdateQuantity(item.itemId, qty);
      setQuantity('');
    }
  };

  const handleSubscribe = () => {
    if (email.trim()) {
      onSubscribeToRestock(item.itemId, email);
      setEmail('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
          <StockBadge inStock={item.inStock} quantity={item.quantity} />
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>Quantity: <span className="font-medium text-gray-900">{item.quantity}</span></span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date(item.lastUpdated).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="New quantity"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
          />
          <button
            onClick={handleUpdateQuantity}
            disabled={!quantity}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Update
          </button>
        </div>

        {!item.inStock && (
          <button
            onClick={handlePredictionClick}
            disabled={predictionLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {predictionLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                {showPrediction ? 'Hide Prediction' : 'Get Restock Prediction'}
              </>
            )}
          </button>
        )}

        {showPrediction && prediction && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-purple-900 mb-2">Restock Prediction</div>
            <div className="text-sm text-purple-700 mb-2">{prediction.message}</div>
            {prediction.confidence > 0 && (
              <div className="text-sm text-purple-600 mb-3">
                Confidence: {prediction.confidence}%
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email for alerts"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSubscribe}
                disabled={!email.trim()}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced store card component
const StoreCard: React.FC<{ store: Store; onSelect: (storeId: string) => void; isSelected: boolean }> = ({ 
  store, 
  onSelect, 
  isSelected 
}) => {
  const [storeData, setStoreData] = useState<{
    inventory: InventoryItem[];
    deals: Deal[];
    prediction: RestockPrediction | null;
  } | null>(null);

  const { apiCall, loading } = useApi('https://navcart-dashboard.onrender.com/');

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const [inventory, deals] = await Promise.all([
          apiCall(`/api/inventory/${store.storeId}`),
          apiCall(`/api/deals/${store.storeId}`)
        ]);

        const outOfStockItem = inventory.find((item: InventoryItem) => !item.inStock);
        let prediction = null;
        
        if (outOfStockItem) {
          try {
            prediction = await apiCall(`/api/restock-prediction/${store.storeId}/${outOfStockItem.itemId}`);
          } catch (error) {
            console.error('Error fetching prediction:', error);
          }
        }

        setStoreData({ inventory, deals, prediction });
      } catch (error) {
        console.error('Error loading store data:', error);
      }
    };

    loadStoreData();
  }, [store.storeId, apiCall]);

  const inStockCount = storeData?.inventory.filter(item => item.inStock).length || 0;
  const totalItems = storeData?.inventory.length || 0;

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(store.storeId)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Store className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{store.location.lat.toFixed(4)}, {store.location.lng.toFixed(4)}</span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner size="sm" />
        ) : storeData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Stock Status</span>
              <span className="text-sm text-gray-600">{inStockCount}/{totalItems} in stock</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalItems ? (inStockCount / totalItems) * 100 : 0}%` }}
              />
            </div>

            {storeData.deals.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Active Deals</span>
                </div>
                <div className="text-xs text-yellow-700">
                  {storeData.deals.length} deal{storeData.deals.length !== 1 ? 's' : ''} available
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Main dashboard component
const InventoryDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [alerts, setAlerts] = useState<ApiError[]>([]);

  const { apiCall, loading, error, setError } = useApi('https://navcart-dashboard.onrender.com');

  const addAlert = useCallback((message: string, type: ApiError['type'] = 'info') => {
    const newAlert = { message, type };
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const removeAlert = useCallback((index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Fetch stores on mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await apiCall('/api/stores');
        setStores(data);
        if (data.length > 0) {
          setSelectedStore(data[0].storeId);
        }
      } catch (error) {
        addAlert('Failed to load stores', 'error');
      }
    };

    fetchStores();
  }, [apiCall, addAlert]);

  // Fetch inventory and deals when store changes
  useEffect(() => {
    if (selectedStore) {
      fetchStoreData(selectedStore);
    }
  }, [selectedStore]);

  // Show API errors as alerts
  useEffect(() => {
    if (error) {
      addAlert(error.message, error.type);
      setError(null);
    }
  }, [error, addAlert, setError]);

  const fetchStoreData = async (storeId: string) => {
    try {
      const [inventoryData, dealsData] = await Promise.all([
        apiCall(`/api/inventory/${storeId}`),
        apiCall(`/api/deals/${storeId}`)
      ]);
      setInventory(inventoryData);
      setDeals(dealsData);
    } catch (error) {
      addAlert('Failed to load store data', 'error');
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await apiCall(`/api/inventory/${selectedStore}/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      
      addAlert('Inventory updated successfully!', 'success');
      fetchStoreData(selectedStore);
    } catch (error) {
      addAlert('Failed to update inventory', 'error');
    }
  };

  const handleSubscribeToRestock = async (itemId: string, email: string) => {
    try {
      await apiCall('/api/restock-alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, storeId: selectedStore, itemId })
      });
      
      addAlert('Successfully subscribed to restock alerts!', 'success');
    } catch (error) {
      addAlert('Failed to subscribe to alerts', 'error');
    }
  };

  const handleGetPrediction = async (itemId: string): Promise<RestockPrediction | null> => {
    try {
      return await apiCall(`/api/restock-prediction/${selectedStore}/${itemId}`);
    } catch (error) {
      addAlert('Failed to get restock prediction', 'error');
      return null;
    }
  };

  const getStockStatistics = () => {
    const inStock = inventory.filter(item => item.inStock).length;
    const lowStock = inventory.filter(item => item.inStock && item.quantity < 10).length;
    const outOfStock = inventory.filter(item => !item.inStock).length;
    
    return { inStock, lowStock, outOfStock, total: inventory.length };
  };

  const stats = getStockStatistics();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Intelligence Dashboard</h1>
          <p className="text-gray-600">Monitor stock levels, track deals, and get predictive insights</p>
        </div>

        {/* Alerts */}
        <div className="fixed top-4 right-4 space-y-2 z-50 w-80">
          {alerts.map((alert, index) => (
            <Alert key={index} alert={alert} onClose={() => removeAlert(index)} />
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Store Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Store Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.storeId}
                store={store}
                onSelect={setSelectedStore}
                isSelected={selectedStore === store.storeId}
              />
            ))}
          </div>
        </div>

        {/* Current Deals */}
        {deals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2" />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <DollarSign className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{deal.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{deal.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Valid until: {new Date(deal.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Inventory Status</h2>
            <button
              onClick={() => selectedStore && fetchStoreData(selectedStore)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.map((item) => (
                <InventoryCard
                  key={item.itemId}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onSubscribeToRestock={handleSubscribeToRestock}
                  onGetPrediction={handleGetPrediction}
                />
              ))}
            </div>
          )}
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm text-blue-600 font-mono">
                GET /python-service/inventory?storeId=X&itemId=Y
              </code>
              <p className="text-sm text-gray-600 mt-2">
                Returns real-time stock status with inStock: true/false
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm text-blue-600 font-mono">
                GET /api/deals/:storeId
              </code>
              <p className="text-sm text-gray-600 mt-2">
                Returns top 3 current deals for the store
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <code className="text-sm text-blue-600 font-mono">
                GET /api/restock-prediction/:storeId/:itemId
              </code>
              <p className="text-sm text-gray-600 mt-2">
                Returns predictive restock alerts based on historical data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;