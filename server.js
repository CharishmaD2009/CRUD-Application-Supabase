require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Home route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


// ---------------- USERS APIs ----------------

// Create user
app.post("/users", async (req, res) => {
  const { name, age } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, age }])
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Get all users
app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Update user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  const { data, error } = await supabase
    .from("users")
    .update({ name, age })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json(error);
  res.json({ message: "User deleted" });
});


// ---------------- ORDERS APIs ----------------

// Create order
app.post("/orders", async (req, res) => {
  const { product, user_id } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .insert([{ product, user_id }])
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Get all orders with user details
app.get("/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      product,
      user_id,
      users (
        id,
        name,
        age
      )
    `);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Update order
app.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { product } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .update({ product })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Delete order
app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json(error);
  res.json({ message: "Order deleted" });
});


// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});