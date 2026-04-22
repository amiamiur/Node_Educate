async function login(){
    const password = document.getElementById('password').value;
    const login = document.getElementById('login').value;

    const res = await fetch("/api/login", {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify({password:password, login:login}),
    });

    const data = await res.json();

    if(data.status === "success"){
        window.location.href="/dashboard";
    }
    if(data.status === "error"){
        window.location.href="/error";
    }
}

async function register() {
    const password = document.getElementById('password').value;
    const login = document.getElementById('login').value;

    const res = await fetch("/api/register",  {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify({password, login}),
    });

    const data = await res.json();

    if(data.status === "success"){
        console.log("Saves Success");
        window.location.href="/dashboard";
    }
    if(data.status === "error"){
        window.location.href="/error";
    }
}