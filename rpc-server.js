const { RetoolRPC } = require("retoolrpc");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const rpc = new RetoolRPC({
  apiToken: process.env.RETOOL_API_TOKEN,
  host: "https://zetaglobalcustomerengineeringintern.retool.com",
  resourceId: "c119387c-d579-4c2d-b59b-9d1710d7504b",
  environmentName: "production",
  pollingIntervalMs: 1000,
  pollingTimeoutMs: 30000,
  logLevel: "info",
});


// ================= USERS =================

// Get all users
rpc.register({
  name: "getUsers",
  arguments: {},
  implementation: async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  },
});

// Create user
rpc.register({
  name: "createUser",
  arguments: {
    name: { type: "string", required: true },
    age: { type: "number", required: true },
  },
  implementation: async ({ name, age }) => {
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, age }])
      .select();
    if (error) throw error;
    return data;
  },
});

// Update user
rpc.register({
  name: "updateUser",
  arguments: {
    id: { type: "number", required: true },
    name: { type: "string", required: true },
    age: { type: "number", required: true },
  },
  implementation: async ({ id, name, age }) => {
    const { data, error } = await supabase
      .from("users")
      .update({ name, age })
      .eq("id", id)
      .select();
    if (error) throw error;
    return data;
  },
});

// Delete user
rpc.register({
  name: "deleteUser",
  arguments: {
    id: { type: "number", required: true },
  },
  implementation: async ({ id }) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return { message: "User deleted" };
  },
});


// ================= ORDERS =================

// Get orders with user details
rpc.register({
  name: "getOrders",
  arguments: {},
  implementation: async () => {
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
    if (error) throw error;
    return data;
  },
});

// Create order
rpc.register({
  name: "createOrder",
  arguments: {
    product: { type: "string", required: true },
    user_id: { type: "number", required: true },
  },
  implementation: async ({ product, user_id }) => {
    const { data, error } = await supabase
      .from("orders")
      .insert([{ product, user_id }])
      .select();
    if (error) throw error;
    return data;
  },
});

// Update order
rpc.register({
  name: "updateOrder",
  arguments: {
    id: { type: "number", required: true },
    product: { type: "string", required: true },
  },
  implementation: async ({ id, product }) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ product })
      .eq("id", id)
      .select();
    if (error) throw error;
    return data;
  },
});

// Delete order
rpc.register({
  name: "deleteOrder",
  arguments: {
    id: { type: "number", required: true },
  },
  implementation: async ({ id }) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;
    return { message: "Order deleted" };
  },
});


rpc.listen();