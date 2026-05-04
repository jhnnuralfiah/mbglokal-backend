// AMBIL DATA DARI LOCAL STORAGE
let dataDistribusi = JSON.parse(localStorage.getItem("data")) || [];

// TAMBAH DATA
function tambahData() {
    let menu = document.getElementById("menu").value;
    let bahan = document.getElementById("bahan").value;
    let penerima = document.getElementById("penerima").value;
    let porsi = document.getElementById("porsi").value;
    let status = document.getElementById("status").value;

    if (!menu || !bahan || !penerima || !porsi) {
        alert("Isi semua field!");
        return;
    }

    let dataBaru = {
        menu,
        bahan,
        penerima,
        porsi,
        status
    };

    dataDistribusi.push(dataBaru);

    // simpan ke localStorage
    localStorage.setItem("data", JSON.stringify(dataDistribusi));

    loadData();
}

// LOAD DATA
function loadData() {
    let body = document.getElementById("data-body");
    if (!body) return;

    body.innerHTML = "";

    dataDistribusi.forEach((item, i) => {
        body.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.menu}</td>
                <td>${item.bahan}</td>
                <td>${item.penerima}</td>
                <td>${item.porsi}</td>
                <td>${item.status}</td>
            </tr>
        `;
    });

    let total = document.getElementById("totalData");
    if (total) total.innerText = dataDistribusi.length;
}

// AUTO LOAD
window.onload = function () {
    if (!location.href.includes("login.html")) {
        if (localStorage.getItem("login") !== "true") {
            location.href = "login.html";
        }
    }

    loadData();
};