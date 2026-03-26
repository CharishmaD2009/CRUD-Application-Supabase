require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


app.post("/users", async (req, res) => {
  const { name } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name }])
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});


app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});


app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from("users")
    .update({ name })
    .eq("id", id)
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});


app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json(error);
  res.json({ message: "User deleted" });
});



app.post("/orders", async (req, res) => {
  const { product, user_id } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .insert([{ product, user_id }])
    .select();

  if (error) return res.status(400).json(error);
  res.json(data);
});


app.get("/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      product,
      users ( id, name )
    `);

  if (error) return res.status(400).json(error);
  res.json(data);
});


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


app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json(error);
  res.json({ message: "Order deleted" });
});



app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});