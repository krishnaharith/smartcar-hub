async function testUpdate() {
  try {
    const res = await fetch("http://localhost:5000/api/bookings/69b399d00d2a098a5fefb74c/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ trackingStatus: "Inspection Completed" })
    });
    
    if (!res.ok) {
      const err = await res.json();
      console.error("Update failed:", err);
    } else {
      const data = await res.json();
      console.log("Update success:", data);
    }
  } catch(err) {
    console.error("Fetch failed:", err);
  }
}

testUpdate();
