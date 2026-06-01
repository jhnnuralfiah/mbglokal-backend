const BASE_URL =
    "http://localhost:8080/api";

// ==========================
// TOAST NOTIFICATION
// ==========================

function showToast(message, type) {

    const toastContainer =
        document.getElementById(
            "toast"
        );

    if (!toastContainer) return;

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast ${type}`;

    toast.innerText =
        message;

    toastContainer.appendChild(
        toast
    );

    setTimeout(() => {

        toast.remove();

    }, 3000);
}

// ==========================
// LOGIN
// ==========================

async function login() {

    let username =
        document.getElementById(
            "username"
        ).value;

    let password =
        document.getElementById(
            "password"
        ).value;

    if (!username || !password) {

        showToast(
            "Username dan password wajib diisi!",
            "error"
        );

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        username: username,

                        password: password
                    })
                }
            );

        const data =
            await response.json();

        if (data.success) {

            showToast(
                "Login berhasil!",
                "success"
            );

            localStorage.setItem(
                "role",
                data.role
            );

            localStorage.setItem(
                "username",
                data.username
            );

            localStorage.setItem(
                "idUser",
                data.idUser
            );

            // REDIRECT ROLE

            if (data.role === "ADMIN") {

                setTimeout(() => {

                    window.location.href =
                        "admin-dashboard.html";

                }, 1200);
            }

            else if (
                data.role === "PETANI"
            ) {

                setTimeout(() => {

                    window.location.href =
                        "petani-dashboard.html";

                }, 1200);
            }

            else if (
                data.role === "SEKOLAH"
            ) {

                setTimeout(() => {

                    window.location.href =
                        "sekolah-dashboard.html";

                }, 1200);
            }
        }

        else {

            showToast(
                data.message,
                "error"
            );
        }

    }

    catch (error) {

        console.log(error);

        showToast(
            "Backend tidak terhubung!",
            "error"
        );
    }
}

// ==========================
// LOGOUT
// ==========================

function logout() {

    showToast(
        "Logout berhasil!",
        "success"
    );

    localStorage.removeItem(
        "role"
    );

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "idUser"
    );

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 1000);
}

// ==========================
// SHOW PAGE
// ==========================

function showPage(page) {

    let pages =
        document.querySelectorAll(
            ".page");

    pages.forEach(function (item) {

        item.classList.add(
            "hidden");
    });

    document.getElementById(
        page).classList.remove(
            "hidden");
}

// ==========================
// KOMODITAS API
// ==========================

async function loadKomoditas() {

    let body =
        document.getElementById(
            "komoditasBody");

    if (!body) return;

    try {

        const response =
            await fetch(
                `${BASE_URL}/komoditas`
            );

        const data =
            await response.json();

        body.innerHTML = "";

        data.forEach((item, i) => {

            body.innerHTML += `

            <tr>

                <td>${i + 1}</td>

                <td>${item.namaBahan}</td>

                <td>
                    ${item.stokSaatIni}
                    ${item.satuan || "kg"}
                </td>

                <td>

                    <button onclick="
                    hapusKomoditas(
                    ${item.idKomoditas}
                    )">

                        Hapus

                    </button>

                </td>

            </tr>

            `;
        });

        let total =
            document.getElementById(
                "totalKomoditas");

        if (total) {

            total.innerText =
                data.length;
        }

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal mengambil data komoditas"
        );
    }
}

function tambahKomoditas() {
    console.log("masuk tambah komoditas");

    let nama = document.getElementById("namaKomoditas").value;
    let stok = document.getElementById("stokKomoditas").value;

    if (!nama || !stok) {
        alert("Data belum lengkap");
        return;
    }

    fetch(`${BASE_URL}/komoditas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            namaBahan: nama,
            stokSaatIni: parseFloat(stok)
        })
    })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            loadKomoditas();
        })
        .catch(() => {
            alert("Gagal tambah komoditas");
        });
}

// ==========================
// HAPUS KOMODITAS
// ==========================

async function hapusKomoditas(id) {

    try {

        await fetch(
            `${BASE_URL}/komoditas/${id}`,
            {
                method: "DELETE"
            }
        );

        loadKomoditas();

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal menghapus komoditas"
        );
    }
}

// ==========================
// GUDANG MBG
// ==========================

let gudang =
    JSON.parse(
        localStorage.getItem(
            "gudang")) || [];

function loadGudang() {

    let body =
        document.getElementById(
            "gudangBody");

    if (!body) return;

    body.innerHTML = "";

    gudang.forEach((item, i) => {

        body.innerHTML += `

        <tr>

            <td>${i + 1}</td>

            <td>${item.nama}</td>

            <td>${item.stok} kg</td>

        </tr>

        `;
    });

    let total =
        document.getElementById(
            "totalGudang");

    if (total) {

        total.innerText =
            gudang.length;
    }
}

function tambahGudang(
    komoditas,
    jumlah
) {

    let ditemukan =
        gudang.find(item =>
            item.nama === komoditas);

    if (ditemukan) {

        ditemukan.stok =
            parseInt(
                ditemukan.stok)
            +
            parseInt(jumlah);
    }

    else {

        gudang.push({

            nama: komoditas,
            stok: parseInt(jumlah)

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

async function loadPaket() {

    let body =
        document.getElementById(
            "paketBody"
        );

    if (!body) return;

    try {
        const response =
            await fetch(
                `${BASE_URL}/paket-menu`
            );

        const data =
            await response.json();

        body.innerHTML = "";

        data.forEach((item, i) => {

            body.innerHTML += `

            <tr>

                <td>${i + 1}</td>

                <td>${item.namaMenu}</td>

                <td>${item.deskripsiGizi}</td>

                <td>

                    <button onclick="
                    hapusPaket(
                    ${item.idMenu}
                    )">

                        Hapus

                    </button>

                </td>

            </tr>

            `;
        });

        document.getElementById(
            "totalPaket"
        ).innerText = data.length;

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal memuat data paket menu"
        );
    }
}

async function tambahPaket() {

    let nama =
        document.getElementById(
            "namaPaket"
        ).value;

    let deskripsi =
        document.getElementById(
            "isiPaket"
        ).value;

    if (!nama || !deskripsi) {

        alert(
            "Data belum lengkap"
        );

        return;
    }

    try {

        await fetch(
            `${BASE_URL}/paket-menu`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    namaMenu: nama,

                    deskripsiGizi:
                        deskripsi
                })
            }
        );

        loadPaket();

        document.getElementById(
            "namaPaket"
        ).value = "";

        document.getElementById(
            "isiPaket"
        ).value = "";

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal menambah paket"
        );
    }
}

async function hapusPaket(id) {

    try {

        await fetch(
            `${BASE_URL}/paket-menu/${id}`,
            {
                method: "DELETE"
            }
        );

        loadPaket();

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal menghapus paket"
        );
    }
}

// ==========================
// DISTRIBUSI
// ==========================

async function loadDistribusi() {

    let body =
        document.getElementById(
            "distribusiBody");

    if (!body) return;

    try {
        const response =
            await fetch(
                `${BASE_URL}/distribusi`);

        const data =
            await response.json();

        body.innerHTML = "";

        data.forEach((item, i) => {

            body.innerHTML += `

            <tr>

                <td>${i + 1}</td>

                <td>
                    ${item.paketMenu?.namaMenu || "-"}
                </td>

                <td>
                    ${item.penerimaManfaat?.namaInstansi || "-"}
                </td>

                <td>
                    ${item.tanggalKirim}
                </td>

                <td>
                    ${item.jumlahPorsiDikirim}
                </td>

                <td>

                    <select onchange="
                    updateDistribusi(
                    ${item.idDistribusi},
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
                    hapusDistribusi(
                    ${item.idDistribusi}
                    )">

                        Hapus

                    </button>

                </td>

            </tr>
            `;
        });

        document.getElementById(
            "totalDistribusi"
        ).innerText = data.length;

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal memuat distribusi");
    }
}


// ==========================
// TAMBAH DISTRIBUSI
// ==========================

async function tambahDistribusi() {

    const idMenu =
        document.getElementById(
            "idMenuDistribusi").value;

    const idPenerima =
        document.getElementById(
            "idPenerimaDistribusi").value;

    const tanggal =
        document.getElementById(
            "tanggalDistribusi").value;

    const jumlahPorsi =
        document.getElementById(
            "jumlahPorsi").value;

    const status =
        document.getElementById(
            "statusDistribusi").value;

    if (
        !idMenu ||
        !idPenerima ||
        !tanggal ||
        !jumlahPorsi ||
        !status
    ) {

        alert("Data belum lengkap");
        return;
    }

    const dataDistribusi = {

        paketMenu: {
            idMenu: parseInt(idMenu)
        },

        penerimaManfaat: {
            idUser: parseInt(idPenerima)
        },

        tanggalKirim: tanggal,

        jumlahPorsiDikirim:
            parseInt(jumlahPorsi),

        status: status
    };

    try {
        console.log(dataDistribusi);
        const response =
            await fetch(
                `${BASE_URL}/distribusi`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        dataDistribusi)
                });

        if (!response.ok) {

            const errorText =
                await response.text();

            console.log(errorText);

            alert(errorText);

            return;
        }

        loadDistribusi();

        document.getElementById(
            "idMenuDistribusi").value = "";

        document.getElementById(
            "idPenerimaDistribusi").value = "";

        document.getElementById(
            "tanggalDistribusi").value = "";

        document.getElementById(
            "jumlahPorsi").value = "";

        document.getElementById(
            "statusDistribusi").value = "";

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal tambah distribusi");
    }
}


// ==========================
// UPDATE STATUS
// ==========================

async function updateDistribusi(
    id,
    status
) {

    try {

        await fetch(
            `${BASE_URL}/distribusi/${id}/status?status=${status}`,
            {
                method: "PUT"
            });

        loadDistribusi();

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal update status");
    }
}


// ==========================
// HAPUS
// ==========================

async function hapusDistribusi(id) {

    try {

        await fetch(
            `${BASE_URL}/distribusi/${id}`,
            {
                method: "DELETE"
            });

        loadDistribusi();

    }

    catch (error) {

        console.log(error);

        alert(
            "Gagal hapus distribusi");
    }
}

// ==========================
// PESANAN PETANI
// ==========================

let pesanan =
    JSON.parse(
        localStorage.getItem(
            "pesanan")) || [];

function tambahPesanan() {

    let petani =
        document.getElementById(
            "namaPetani").value;

    let komoditas =
        document.getElementById(
            "komoditasPesanan").value;

    let jumlah =
        document.getElementById(
            "jumlahPesanan").value;

    if (!petani ||
        !komoditas ||
        !jumlah) {

        return;
    }

    pesanan.push({

        petani,
        komoditas,
        jumlah,
        status: "Menunggu"

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

function loadPesanan() {

    let body =
        document.getElementById(
            "pesananBody");

    if (!body) return;

    body.innerHTML = "";

    pesanan.forEach((item, i) => {

        body.innerHTML += `

        <tr>

            <td>${i + 1}</td>

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

function loadKomentar() {

    let body =
        document.getElementById(
            "komentarBody");

    if (!body) return;

    body.innerHTML = "";

    komentar.forEach((item, i) => {

        body.innerHTML += `

        <tr>

            <td>${i + 1}</td>

            <td>${item.sekolah}</td>

            <td>${item.isi}</td>

        </tr>

        `;
    });
}

// ==========================
// LOAD DROPDOWN PAKET MENU
// ==========================

async function loadDropdownPaket() {

    const select =
        document.getElementById(
            "idMenuDistribusi"
        );

    if (!select) return;

    try {

        const response =
            await fetch(
                `${BASE_URL}/paket-menu`
            );

        const data =
            await response.json();

        console.log(data);

        select.innerHTML = `

            <option value="">
                Pilih Paket Menu
            </option>

        `;

        data.forEach(item => {

            select.innerHTML += `

                <option value="${item.idMenu}">

                    ${item.namaMenu}

                </option>

            `;
        });

    }

    catch (error) {

        console.log(error);
    }
}

// ==========================
// LOAD DROPDOWN PENERIMA
// ==========================

async function loadDropdownPenerima() {

    const select =
        document.getElementById(
            "idPenerimaDistribusi"
        );

    if (!select) return;

    try {

        const response =
            await fetch(
                `${BASE_URL}/penerima-manfaat`
            );

        const data =
            await response.json();

        select.innerHTML = `

            <option value="">
                Pilih Penerima
            </option>

        `;

        data.forEach(item => {

            if (
                item.role === "SEKOLAH"
            ) {

                select.innerHTML += `

                    <option value="${item.idUser}">
                        ${item.namaInstansi}
                    </option>

                `;
            }
        });

    }

    catch (error) {

        console.log(error);
    }
}

// ==========================
// AUTO LOAD
// ==========================

window.onload = function () {

    loadKomoditas();

    loadGudang();

    loadPaket();

    loadDistribusi();

    loadPesanan();

    loadKomentar();

    loadDropdownPaket();

    loadDropdownPenerima();
}