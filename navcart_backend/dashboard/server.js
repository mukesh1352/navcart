// server.js - Node.js Backend for Inventory Intelligence
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db';
let db;

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('inventory_db');
    
    // Initialize collections
    initializeCollections();
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Initialize collections with sample data
async function initializeCollections() {
  try {
    // Sample stores
    const stores = [
      { storeId: 'store_001', name: 'Downtown Market', location: { lat: 40.7128, lng: -74.0060 } },
      { storeId: 'store_002', name: 'Uptown Grocers', location: { lat: 40.7589, lng: -73.9851 } },
      { storeId: 'store_003', name: 'Westside Foods', location: { lat: 40.7505, lng: -73.9934 } }
    ];

    // Sample inventory data
    const inventory = [
      { storeId: 'store_001', itemId: 'item_001', name: 'Organic Bananas', inStock: true, quantity: 150, lastUpdated: new Date() },
      { storeId: 'store_001', itemId: 'item_002', name: 'Whole Milk', inStock: false, quantity: 0, lastUpdated: new Date() },
      { storeId: 'store_001', itemId: 'item_003', name: 'Bread Loaf', inStock: true, quantity: 45, lastUpdated: new Date() },
      { storeId: 'store_002', itemId: 'item_001', name: 'Organic Bananas', inStock: true, quantity: 200, lastUpdated: new Date() },
      { storeId: 'store_002', itemId: 'item_002', name: 'Whole Milk', inStock: true, quantity: 80, lastUpdated: new Date() },
      { storeId: 'store_003', itemId: 'item_001', name: 'Organic Bananas', inStock: false, quantity: 0, lastUpdated: new Date() }
    ];

    // Sample deals
    const deals = [
      { storeId: 'store_001', title: '50% Off Organic Produce', description: 'Fresh organic fruits and vegetables', validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { storeId: 'store_001', title: 'Buy 2 Get 1 Free Dairy', description: 'All dairy products included', validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
      { storeId: 'store_001', title: '$5 Off $50 Purchase', description: 'Minimum purchase required', validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { storeId: 'store_002', title: 'Weekend Special: 30% Off Bakery', description: 'Fresh baked goods', validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
    ];

    // Sample historical data for predictions
    const historicalData = [
      { storeId: 'store_001', itemId: 'item_002', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), quantity: 120, restockDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { storeId: 'store_001', itemId: 'item_002', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), quantity: 100, restockDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) }
    ];

    // Insert sample data
    await db.collection('stores').deleteMany({});
    await db.collection('inventory').deleteMany({});
    await db.collection('deals').deleteMany({});
    await db.collection('historical_inventory').deleteMany({});

    await db.collection('stores').insertMany(stores);
    await db.collection('inventory').insertMany(inventory);
    await db.collection('deals').insertMany(deals);
    await db.collection('historical_inventory').insertMany(historicalData);

    console.log('Sample data initialized');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// API Routes

// Get all stores
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await db.collection('stores').find({}).toArray();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory status for specific store and item
app.get('/python-service/inventory', async (req, res) => {
  try {
    const { storeId, itemId } = req.query;
    
    if (!storeId || !itemId) {
      return res.status(400).json({ error: 'storeId and itemId are required' });
    }

    const item = await db.collection('inventory').findOne({ storeId, itemId });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({
      inStock: item.inStock,
      quantity: item.quantity,
      itemName: item.name,
      lastUpdated: item.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all inventory for a store
app.get('/api/inventory/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const inventory = await db.collection('inventory').find({ storeId }).toArray();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deals for a store
app.get('/api/deals/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const deals = await db.collection('deals')
      .find({ storeId, validUntil: { $gte: new Date() } })
      .limit(3)
      .toArray();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restock prediction
app.get('/api/restock-prediction/:storeId/:itemId', async (req, res) => {
  try {
    const { storeId, itemId } = req.params;
    
    // Get current inventory
    const currentItem = await db.collection('inventory').findOne({ storeId, itemId });
    
    if (!currentItem || currentItem.inStock) {
      return res.json({ prediction: null, message: 'Item is currently in stock' });
    }

    // Get historical data for prediction
    const historicalData = await db.collection('historical_inventory')
      .find({ storeId, itemId })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    if (historicalData.length === 0) {
      return res.json({ prediction: null, message: 'Insufficient historical data' });
    }

    // Simple prediction algorithm: average time between restocks
    const restockIntervals = [];
    for (let i = 0; i < historicalData.length - 1; i++) {
      const interval = historicalData[i].restockDate - historicalData[i + 1].restockDate;
      restockIntervals.push(interval);
    }

    if (restockIntervals.length === 0) {
      return res.json({ prediction: null, message: 'Cannot predict restock time' });
    }

    const avgInterval = restockIntervals.reduce((a, b) => a + b, 0) / restockIntervals.length;
    const lastRestockDate = historicalData[0].restockDate;
    const predictedRestockDate = new Date(lastRestockDate.getTime() + avgInterval);

    res.json({
      prediction: predictedRestockDate,
      confidence: Math.min(95, 60 + (historicalData.length * 5)),
      message: `Predicted restock in ${Math.ceil((predictedRestockDate - new Date()) / (1000 * 60 * 60 * 24))} days`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to restock alerts
app.post('/api/restock-alerts/subscribe', async (req, res) => {
  try {
    const { email, storeId, itemId } = req.body;
    
    if (!email || !storeId || !itemId) {
      return res.status(400).json({ error: 'Email, storeId, and itemId are required' });
    }

    const subscription = {
      email,
      storeId,
      itemId,
      createdAt: new Date(),
      active: true
    };

    await db.collection('restock_subscriptions').insertOne(subscription);
    res.json({ message: 'Subscription created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory (simulates real-time updates)
app.put('/api/inventory/:storeId/:itemId', async (req, res) => {
  try {
    const { storeId, itemId } = req.params;
    const { quantity } = req.body;
    
    const result = await db.collection('inventory').updateOne(
      { storeId, itemId },
      { 
        $set: { 
          quantity: quantity,
          inStock: quantity > 0,
          lastUpdated: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Inventory updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cron job to scrape deals (simulated)
cron.schedule('0 6 * * 1', async () => {
  console.log('Running weekly deals scraper...');
  
  try {
    // Simulate scraping new deals
    const newDeals = [
      { storeId: 'store_001', title: 'Fresh Weekly Special', description: 'New weekly promotions', validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { storeId: 'store_002', title: 'Monday Madness', description: 'Start your week with savings', validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    ];

    await db.collection('deals').insertMany(newDeals);
    console.log('New deals added to database');
  } catch (error) {
    console.error('Error updating deals:', error);
  }
});

// Cron job to send restock alerts (simulated)
cron.schedule('0 */6 * * *', async () => {
  console.log('Checking for restock alerts...');
  
  try {
    // Get all active subscriptions for out-of-stock items
    const subscriptions = await db.collection('restock_subscriptions').find({ active: true }).toArray();
    
    for (const subscription of subscriptions) {
      const item = await db.collection('inventory').findOne({ 
        storeId: subscription.storeId, 
        itemId: subscription.itemId 
      });
      
      if (item && item.inStock) {
        console.log(`Sending restock alert to ${subscription.email} for ${item.name}`);
        
        // In a real application, you would send an email here
        // For now, we'll just log and deactivate the subscription
        await db.collection('restock_subscriptions').updateOne(
          { _id: subscription._id },
          { $set: { active: false, notifiedAt: new Date() } }
        );
      }
    }
  } catch (error) {
    console.error('Error processing restock alerts:', error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;