const fileHandler = require('../utils/fileHandler');

// GET all data for a file
exports.getAll = async (req, res) => {
  try {
    const data = await fileHandler.readJson(req.params.file);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: "File not found" });
  }
};

// --- NEW LOGIN FUNCTION ---
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminData = await fileHandler.readJson('admin'); // Reads admin.json

    const user = adminData.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // In a more advanced version, you would generate a JWT token here
      res.json({ 
        success: true, 
        message: "Login successful", 
        token: "tenachin_secret_session_key", // This matches what the frontend looks for
        user: { username: user.username, role: user.role }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Auth system error" });
  }
};

// POST - Add new item
exports.addItem = async (req, res) => {
  try {
    const fileName = req.params.file;
    const db = await fileHandler.readJson(fileName);
    
    // Find the array key (e.g., 'roles' or 'services')
    const key = Object.keys(db).find(k => Array.isArray(db[k]));
    const newItem = { id: Date.now(), ...req.body };
    
    if (key) {
      db[key].push(newItem);
      await fileHandler.writeJson(fileName, db);
      res.status(201).json(newItem);
    } else {
      res.status(400).json({ message: "No array found in JSON to add to." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT - Update item OR Bulk Update File
exports.updateItem = async (req, res) => {
  try {
    const { file, id } = req.params;
    const db = await fileHandler.readJson(file);

    // CASE 1: BULK UPDATE (No ID provided in URL)
    // This handles your "Save All Roles" or "Update About Section"
    if (!id) {
      // If the incoming body has the key (like { roles: [...] }), save it directly
      await fileHandler.writeJson(file, req.body);
      return res.json({ message: "Section synchronized successfully" });
    }

    // CASE 2: SINGLE ITEM UPDATE (ID is provided)
    const key = Object.keys(db).find(k => Array.isArray(db[k]));
    if (!key) return res.status(400).json({ message: "Not an array-based file" });

    const index = db[key].findIndex(item => item.id == id);
    if (index === -1) return res.status(404).json({ message: "Item not found" });

    db[key][index] = { ...db[key][index], ...req.body };
    await fileHandler.writeJson(file, db);
    res.json(db[key][index]);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Remove item
exports.deleteItem = async (req, res) => {
  try {
    const { file, id } = req.params;
    const db = await fileHandler.readJson(file);
    const key = Object.keys(db).find(k => Array.isArray(db[k]));
    
    if (key) {
      db[key] = db[key].filter(item => item.id != id);
      await fileHandler.writeJson(file, db);
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(400).json({ message: "Delete only supported for array-based files." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};