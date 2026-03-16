const makeReq = async () => {
  const res = await fetch("http://localhost:5000/api/users/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: "Admin Fetch 3", email: "admin3@labhante.com", password: "pwd", role: "admin", adminCode: "981245"
    })
  });
  console.log(await res.json());
};
makeReq();
