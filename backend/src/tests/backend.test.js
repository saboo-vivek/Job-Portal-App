const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const mongoose = require("mongoose");
const app = require("../app");

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}/api`;
      console.log(`Test server running at ${baseUrl}`);
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  console.log("Disconnected Mongoose and closed test server.");
});

test("Health check endpoint returns status OK", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, "OK");
});

test("Public Demo Seeker can authenticate successfully", async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.seeker@jobexecutive.com",
      password: "Demo@12345",
      role: "SEEKER",
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token, "Token should be present in response");
  assert.equal(data.user.role, "SEEKER");
  assert.equal(data.user.email, "demo.seeker@jobexecutive.com");
});

test("Public Demo Employer can authenticate successfully", async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.employer@jobexecutive.com",
      password: "Demo@12345",
      role: "EMPLOYER",
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.user.role, "EMPLOYER");
});

test("Public Demo Administrator can authenticate successfully", async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.admin@jobexecutive.com",
      password: "Demo@12345",
      role: "ADMIN",
    }),
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.user.role, "ADMIN");
});

test("Invalid credentials are correctly rejected with 400", async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.seeker@jobexecutive.com",
      password: "WrongPassword!999",
      role: "SEEKER",
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.msg, "Incorrect password");
});

test("Role mismatch is rejected with 403", async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.seeker@jobexecutive.com",
      password: "Demo@12345",
      role: "ADMIN", // Deliberate mismatch
    }),
  });

  assert.equal(res.status, 403);
  const data = await res.json();
  assert.ok(data.msg.includes("does not match"));
});

test("Public job exploration returns seeded jobs (count >= 35)", async () => {
  const res = await fetch(`${baseUrl}/job`);
  assert.equal(res.status, 200);
  const jobs = await res.json();
  assert.ok(Array.isArray(jobs), "Jobs should be an array");
  assert.ok(jobs.length >= 35, `Expected >= 35 jobs, found ${jobs.length}`);

  // Test populated fields
  const firstJob = jobs[0];
  assert.ok(firstJob.title);
  assert.ok(firstJob.employerId);
  assert.ok(firstJob.employerId.name, "Employer name should be populated");
});

test("Job keyword search returns relevant results", async () => {
  const res = await fetch(`${baseUrl}/job?q=React`);
  assert.equal(res.status, 200);
  const jobs = await res.json();
  assert.ok(jobs.length > 0);
  assert.ok(jobs.every((j) => j.title.toLowerCase().includes("react")));
});

test("Job location filter returns relevant results", async () => {
  const res = await fetch(`${baseUrl}/job?location=Bengaluru`);
  assert.equal(res.status, 200);
  const jobs = await res.json();
  assert.ok(jobs.length > 0);
  assert.ok(jobs.every((j) => j.location.toLowerCase().includes("bengaluru")));
});

test("Demo seeker cannot change shared demo password or email", async () => {
  // Login first to get token
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.seeker@jobexecutive.com",
      password: "Demo@12345",
      role: "SEEKER",
    }),
  });
  const { token } = await loginRes.json();

  // Attempt to change password
  const updateRes = await fetch(`${baseUrl}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password: "HackedPassword123!",
    }),
  });

  assert.equal(updateRes.status, 403);
  const updateData = await updateRes.json();
  assert.ok(updateData.msg.includes("Demo accounts are public and shared"));
});

test("Demo admin cannot delete core demo accounts", async () => {
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.admin@jobexecutive.com",
      password: "Demo@12345",
      role: "ADMIN",
    }),
  });
  const { token } = await loginRes.json();

  // Find demo seeker id
  const seekersRes = await fetch(`${baseUrl}/admin/seekers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const seekers = await seekersRes.json();
  const demoSeeker = seekers.find((s) => s.email === "demo.seeker@jobexecutive.com");

  assert.ok(demoSeeker, "Demo seeker must exist");

  // Attempt to delete demo seeker
  const deleteRes = await fetch(`${baseUrl}/admin/users/${demoSeeker._id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  assert.equal(deleteRes.status, 403);
  const deleteData = await deleteRes.json();
  assert.ok(deleteData.msg.includes("cannot be deleted"));
});

test("Blog operations: reactions bug fix verified without TypeError crash", async () => {
  // Login as seeker
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "demo.seeker@jobexecutive.com",
      password: "Demo@12345",
      role: "SEEKER",
    }),
  });
  const { token } = await loginRes.json();

  // Create a blog post first
  const createBlogRes = await fetch(`${baseUrl}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Test Engineering Blog Post",
      content: "This is a comprehensive test blog post to verify reaction and comment mechanics.",
    }),
  });

  assert.equal(createBlogRes.status, 201);
  const blog = await createBlogRes.json();
  assert.ok(blog._id);

  // Add reaction
  const reactRes = await fetch(`${baseUrl}/blogs/${blog._id}/react`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type: "like" }),
  });
  assert.equal(reactRes.status, 200);

  // Remove reaction (Bug test: previously crashed with TypeError)
  const removeRes = await fetch(`${baseUrl}/blogs/${blog._id}/react`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  assert.equal(removeRes.status, 200, "Reaction removal should return 200 OK without server crash");

  // Cleanup: delete test blog post
  await fetch(`${baseUrl}/blogs/${blog._id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
});
