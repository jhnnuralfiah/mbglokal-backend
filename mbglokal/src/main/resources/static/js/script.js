// ==========================
// LOGIN
// ==========================

function login(){

    let username =
    document.getElementById(
    "username").value;

    let password =
    document.getElementById(
    "password").value;

    if(username === "admin"
    && password === "123"){

        localStorage.setItem(
        "role",
        "admin");

        window.location.href =
        "admin-dashboard.html";
    }

    else if(username === "petani"
    && password === "123"){

        localStorage.setItem(
        "role",
        "petani");

        window.location.href =
        "petani-dashboard.html";
    }

    else if(username === "sekolah"
    && password === "123"){

        localStorage.setItem(
        "role",
        "sekolah");

        window.location.href =
        "sekolah-dashboard.html";
    }

    else{

        document.getElementById(
        "error").innerHTML =
        "Username atau Password Salah!";
    }
}

// ==========================
// LOGOUT
// ==========================

function logout(){

    localStorage.removeItem(
    "role");

    window.location.href =
    "login.html";
}

// ==========================
// SHOW PAGE
// ==========================

function showPage(page){

    let pages =
    document.querySelectorAll(
    ".page");

    pages.forEach(function(item){

        item.classList.add(
        "hidden");
    });

    document.getElementById(
    page).classList.remove(
    "hidden");
}

// ==========================
// KOMODITAS
// ==========================

let komoditas =
JSON.parse(
localStorage.getItem(
"komoditas")) || [];

function tambahKomoditas(){

    let nama =
    document.getElementById(
    "namaKomoditas").value;

    let stok =
    document.getElementById(
    "stokKomoditas").value;

    if(!nama || !stok){
        return;
    }

    komoditas.push({

        nama,
        stok

    });

    localStorage.setItem(

        "komoditas",

        JSON.stringify(
        komoditas)

    );

    loadKomoditas();

    document.getElementById(
    "namaKomoditas").value = "";

    document.getElementById(
    "stokKomoditas").value = "";
}

function loadKomoditas(){

    let body =
    document.getElementById(
    "komoditasBody");

    if(!body) return;

    body.innerHTML = "";

    komoditas.forEach((item,i)=>{

        body.innerHTML += `

        <tr>

            <td>${i+1}</td>

            <td>${item.nama}</td>

            <td>${item.stok} kg</td>

            <td>

                <button onclick="
                editKomoditas(${i})
                ">

                    Edit

                </button>

                <button onclick="
                hapusKomoditas(${i})
                ">

                    Hapus

                </button>

            </td>

        </tr>

        `;
    });

    let total =
    document.getElementById(
    "totalKomoditas");

    if(total){

        total.innerText =
        komoditas.length;
    }
}

function editKomoditas(index){

    let namaBaru =
    prompt(
    "Edit Nama Komoditas",
    komoditas[index].nama
    );

    let stokBaru =
    prompt(
    "Edit Stok",
    komoditas[index].stok
    );

    if(namaBaru && stokBaru){

        komoditas[index].nama =
        namaBaru;

        komoditas[index].stok =
        stokBaru;

        localStorage.setItem(

            "komoditas",

            JSON.stringify(
            komoditas)

        );

        loadKomoditas();
    }
}

function hapusKomoditas(index){

    komoditas.splice(index,1);

    localStorage.setItem(

        "komoditas",

        JSON.stringify(
        komoditas)

    );

    loadKomoditas();
}

// ==========================
// GUDANG MBG
// ==========================

let gudang =
JSON.parse(
localStorage.getItem(
"gudang")) || [];

function loadGudang(){

    let body =
    document.getElementById(
    "gudangBody");

    if(!body) return;

    body.innerHTML = "";

    gudang.forEach((item,i)=>{

        body.innerHTML += `

        <tr>

            <td>${i+1}</td>

            <td>${item.nama}</td>

            <td>${item.stok} kg</td>

        </tr>

        `;
    });

    let total =
    document.getElementById(
    "totalGudang");

    if(total){

        total.innerText =
        gudang.length;
    }
}

function tambahGudang(
komoditas,
jumlah
){

    let ditemukan =
    gudang.find(item =>
    item.nama === komoditas);

    if(ditemukan){

        ditemukan.stok =
        parseInt(
        ditemukan.stok)
        +
        parseInt(jumlah);
    }

    else{

        gudang.push({

            nama:komoditas,
            stok:parseInt(jumlah)

        });
    }

    localStorage.setItem(

        "gudang",

        JSON.stringify(
        gudang)

    );

    loadGudang();
}

// ==========================
// PAKET MENU
// ==========================

let paket =
JSON.parse(
localStorage.getItem(
"paket")) || [];

function tambahPaket(){

    let nama =
    document.getElementById(
    "namaPaket").value;

    let isi =
    document.getElementById(
    "isiPaket").value;

    let stok =
    document.getElementById(
    "stokPaket").value;

    if(!nama || !isi || !stok){
        return;
    }

    paket.push({

        nama,
        isi,
        stok:parseInt(stok) || 0

    });

    localStorage.setItem(

        "paket",

        JSON.stringify(
        paket)

    );

    loadPaket();

    document.getElementById(
    "namaPaket").value = "";

    document.getElementById(
    "isiPaket").value = "";

    document.getElementById(
    "stokPaket").value = "";
}

function loadPaket(){

    let body =
    document.getElementById(
    "paketBody");

    if(!body) return;

    body.innerHTML = "";

    paket.forEach((item,i)=>{

        body.innerHTML += `

        <tr>

            <td>${i+1}</td>

            <td>${item.nama}</td>

            <td>${item.isi}</td>

            <td>${item.stok}</td>

            <td>

                <button onclick="
                editPaket(${i})
                ">

                    Edit

                </button>

                <button onclick="
                hapusPaket(${i})
                ">

                    Hapus

                </button>

            </td>

        </tr>

        `;
    });
}

function editPaket(index){

    let namaBaru =
    prompt(
    "Edit Nama Paket",
    paket[index].nama
    );

    let isiBaru =
    prompt(
    "Edit Isi Paket",
    paket[index].isi
    );

    let stokBaru =
    prompt(
    "Edit Stok",
    paket[index].stok
    );

    if(namaBaru &&
       isiBaru &&
       stokBaru){

        paket[index].nama =
        namaBaru;

        paket[index].isi =
        isiBaru;

        paket[index].stok =
        parseInt(stokBaru);

        localStorage.setItem(

            "paket",

            JSON.stringify(
            paket)

        );

        loadPaket();
    }
}

function hapusPaket(index){

    paket.splice(index,1);

    localStorage.setItem(

        "paket",

        JSON.stringify(
        paket)

    );

    loadPaket();
}

// ==========================
// DISTRIBUSI
// ==========================

let distribusi =
JSON.parse(
localStorage.getItem(
"distribusi")) || [];

function tambahDistribusi(){

    let paketMenu =
    document.getElementById(
    "paketDistribusi").value;

    let sekolah =
    document.getElementById(
    "tujuanSekolah").value;

    let jumlahPaket =
    parseInt(
    document.getElementById(
    "jumlahPaket").value);

    let status =
    document.getElementById(
    "statusDistribusi").value;

    let cariPaket =
    paket.find(item =>
    item.nama === paketMenu);

    if(!cariPaket){

        alert(
        "Paket tidak ditemukan"
        );

        return;
    }

    if(cariPaket.stok <
       jumlahPaket){

        alert(
        "Stok paket tidak cukup"
        );

        return;
    }

    cariPaket.stok -=
    jumlahPaket;

    distribusi.push({

        paket:paketMenu,
        sekolah,
        jumlahPaket,
        jumlahPorsi:
        jumlahPaket,
        status

    });

    localStorage.setItem(

        "paket",

        JSON.stringify(
        paket)

    );

    localStorage.setItem(

        "distribusi",

        JSON.stringify(
        distribusi)

    );

    loadPaket();

    loadDistribusi();

    document.getElementById(
    "paketDistribusi").value = "";

    document.getElementById(
    "tujuanSekolah").value = "";

    document.getElementById(
    "jumlahPaket").value = "";

    document.getElementById(
    "statusDistribusi").value = "";
}

function loadDistribusi(){

    let body =
    document.getElementById(
    "distribusiBody");

    if(!body) return;

    body.innerHTML = "";

    distribusi.forEach((item,i)=>{

        body.innerHTML += `

        <tr>

            <td>${i+1}</td>

            <td>${item.paket}</td>

            <td>${item.sekolah}</td>

            <td>${item.jumlahPorsi}</td>

            <td>

                <select onchange="
                updateDistribusi(
                ${i},
                this.value
                )">

                    <option value="Proses"
                    ${item.status === "Proses"
                    ? "selected" : ""}>

                        Proses

                    </option>

                    <option value="Dikirim"
                    ${item.status === "Dikirim"
                    ? "selected" : ""}>

                        Dikirim

                    </option>

                    <option value="Selesai"
                    ${item.status === "Selesai"
                    ? "selected" : ""}>

                        Selesai

                    </option>

                </select>

            </td>

            <td>

                <button onclick="
                hapusDistribusi(${i})
                ">

                    Hapus

                </button>

            </td>

        </tr>

        `;
    });

    let total =
    document.getElementById(
    "totalDistribusi");

    if(total){

        total.innerText =
        distribusi.length;
    }
}

function updateDistribusi(index,status){

    distribusi[index].status =
    status;

    localStorage.setItem(

        "distribusi",

        JSON.stringify(
        distribusi)

    );

    loadDistribusi();
}

function hapusDistribusi(index){

    distribusi.splice(index,1);

    localStorage.setItem(

        "distribusi",

        JSON.stringify(
        distribusi)

    );

    loadDistribusi();
}

// ==========================
// PESANAN PETANI
// ==========================

let pesanan =
JSON.parse(
localStorage.getItem(
"pesanan")) || [];

function tambahPesanan(){

    let petani =
    document.getElementById(
    "namaPetani").value;

    let komoditas =
    document.getElementById(
    "komoditasPesanan").value;

    let jumlah =
    document.getElementById(
    "jumlahPesanan").value;

    if(!petani ||
       !komoditas ||
       !jumlah){

        return;
    }

    pesanan.push({

        petani,
        komoditas,
        jumlah,
        status:"Menunggu"

    });

    localStorage.setItem(

        "pesanan",

        JSON.stringify(
        pesanan)

    );

    loadPesanan();

    document.getElementById(
    "namaPetani").value = "";

    document.getElementById(
    "komoditasPesanan").value = "";

    document.getElementById(
    "jumlahPesanan").value = "";
}

function loadPesanan(){

    let body =
    document.getElementById(
    "pesananBody");

    if(!body) return;

    body.innerHTML = "";

    pesanan.forEach((item,i)=>{

        body.innerHTML += `

        <tr>

            <td>${i+1}</td>

            <td>${item.petani}</td>

            <td>${item.komoditas}</td>

            <td>${item.jumlah} kg</td>

            <td>${item.status}</td>

        </tr>

        `;
    });
}

// ==========================
// KOMENTAR
// ==========================

let komentar =
JSON.parse(
localStorage.getItem(
"komentar")) || [];

function loadKomentar(){

    let body =
    document.getElementById(
    "komentarBody");

    if(!body) return;

    body.innerHTML = "";

    komentar.forEach((item,i)=>{

        body.innerHTML += `

        <tr>

            <td>${i+1}</td>

            <td>${item.sekolah}</td>

            <td>${item.isi}</td>

        </tr>

        `;
    });
}

// ==========================
// AUTO LOAD
// ==========================

window.onload = function(){

    loadKomoditas();

    loadGudang();

    loadPaket();

    loadDistribusi();

    loadPesanan();

    loadKomentar();
}