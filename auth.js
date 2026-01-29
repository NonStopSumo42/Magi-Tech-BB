const PASSWORD = "E7WQ1tdxSqI?si=Gd3AuRLxgT87CeGa";

const accounts = {
  "Pr0j3ctB": {
    publicName: "B",
    ui: "real-ui"
  },
  "Pr0j3ctA": {
    ui: "secret-ui"
  }
};

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (accounts[user] && pass === PASSWORD) {
    sessionStorage.setItem("user", user);
    window.location.href = "terminal.html";
  } else {
    alert("ACCESS DENIED");
  }
}
