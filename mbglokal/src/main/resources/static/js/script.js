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

        showToast(
            "Gagal mengambil data komoditas",
            "error"
        );
    }
}

function tambahKomoditas() {
    console.log("masuk tambah komoditas");

    let nama = document.getElementById("namaKomoditas").value;
    let stok = document.getElementById("stokKomoditas").value;

    if (!nama || !stok) {
        showToast(
            "Data komoditas belum lengkap",
            "error"
        );
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

            showToast(
                "Komoditas berhasil ditambahkan",
                "success"
            );

            loadKomoditas();

            document.getElementById(
                "namaKomoditas"
            ).value = "";

            document.getElementById(
                "stokKomoditas"
            ).value = "";
        })
        .catch(() => {

            showToast(
                "Gagal tambah komoditas",
                "error"
            );
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

        showToast(
            "Komoditas berhasil dihapus",
            "success"
        );

        loadKomoditas();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal menghapus komoditas",
            "error"
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

        showToast(
            "Gagal memuat data paket menu",
            "error"
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

        showToast(
            "Data paket menu belum lengkap",
            "error"
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

        showToast(
            "Paket menu berhasil ditambahkan",
            "success"
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

        showToast(
            "Gagal menambah paket",
            "error"
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

        showToast(
            "Paket menu berhasil dihapus",
            "success"
        );

        loadPaket();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal menghapus paket",
            "error"
        );
    }
}

// ==========================
// DISTRIBUSI
// ==========================

async function loadDistribusi() {

    let body =
        document.getElementById("distribusiBody");

    if (!body) return;

    const role = localStorage.getItem("role");
    const idUser = localStorage.getItem("idUser");

    let url = `${BASE_URL}/distribusi`;

    // kalau sekolah → filter user
    if (role === "SEKOLAH") {
        url = `${BASE_URL}/distribusi/user/${idUser}`;
    }

    try {

        const response = await fetch(url);
        const data = await response.json();

        body.innerHTML = "";

        data.forEach((item, i) => {

            body.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.paketMenu?.namaMenu || "-"}</td>
                    <td>${item.penerimaManfaat?.namaInstansi || "-"}</td>
                    <td>${item.tanggalKirim}</td>
                    <td>${item.jumlahPorsiDikirim}</td>
                    <td>${item.status}</td>
                    <td>
                        <button onclick="hapusDistribusi(${item.idDistribusi})">
                            Hapus
                        </button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("totalDistribusi").innerText = data.length;

    } catch (error) {
        console.log(error);
        showToast("Gagal memuat distribusi", "error");
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

        showToast(
            "Data distribusi belum lengkap",
            "error"
        );
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

        const data =
            await response.json();

        // JIKA GAGAL DARI BACKEND
        if (data.success === false) {

            showToast(
                data.message,
                "error"
            );

            return;
        }

        // JIKA SUKSES
        showToast(
            "Distribusi berhasil ditambahkan",
            "success"
        );

        loadDistribusi();

        loadKomoditas();

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

        showToast(
            "Gagal tambah distribusi",
            "error"
        );
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

        showToast(
            "Status distribusi berhasil diperbarui",
            "success"
        );

        loadDistribusi();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal tambah update distribusi ",
            "error"
        );
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

        showToast(
            "Distribusi berhasil dihapus",
            "success"
        );

        loadDistribusi();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal hapus distribusi",
            "error"
        );
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
// LOAD DROPDOWN DETAIL MENU
// ==========================

async function loadDropdownDetailMenu() {


    // DROPDOWN PAKET MENU

    const paketSelect =
        document.getElementById(
            "idPaketDetail"
        );

    // DROPDOWN KOMODITAS

    const komoditasSelect =
        document.getElementById(
            "idKomoditasDetail"
        );

    if (!paketSelect || !komoditasSelect)
        return;

    try {

        // ==========================
        // LOAD PAKET MENU
        // ==========================

        const paketResponse =
            await fetch(
                `${BASE_URL}/paket-menu`
            );

        const paketData =
            await paketResponse.json();

        paketSelect.innerHTML = `

        <option value="">
            Pilih Paket Menu
        </option>

    `;

        paketData.forEach(item => {

            paketSelect.innerHTML += `

            <option value="${item.idMenu}">

                ${item.namaMenu}

            </option>

        `;
        });

        // ==========================
        // LOAD KOMODITAS
        // ==========================

        const komoditasResponse =
            await fetch(
                `${BASE_URL}/komoditas`
            );

        const komoditasData =
            await komoditasResponse.json();

        komoditasSelect.innerHTML = `

        <option value="">
            Pilih Komoditas
        </option>

    `;

        komoditasData.forEach(item => {

            komoditasSelect.innerHTML += `

            <option value="${item.idKomoditas}">

                ${item.namaBahan}

            </option>

        `;
        });

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal load dropdown detail menu",
            "error"
        );
    }


}

// ==========================
// LOAD DETAIL MENU
// ==========================

async function loadDetailMenu() {


    const body =
        document.getElementById(
            "detailMenuBody"
        );

    if (!body) return;

    try {

        const response =
            await fetch(
                `${BASE_URL}/detail-menu`
            );

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
                    ${item.komoditas?.namaBahan || "-"}
                </td>

                <td>
                    ${item.jumlahKebutuhanPerPorsi}
                </td>

                <td>

                    <button onclick="
                        hapusDetailMenu(
                            ${item.idDetail}
                        )">

                        Hapus

                    </button>

                </td>

            </tr>

        `;
        });

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal load detail menu",
            "error"
        );
    }


}

// ==========================
// TAMBAH DETAIL MENU
// ==========================

async function tambahDetailMenu() {

    const idMenu =
        document.getElementById(
            "idPaketDetail"
        ).value;

    const idKomoditas =
        document.getElementById(
            "idKomoditasDetail"
        ).value;

    const jumlah =
        document.getElementById(
            "jumlahKebutuhan"
        ).value;

    if (
        !idMenu ||
        !idKomoditas ||
        !jumlah
    ) {

        showToast(
            "Data belum lengkap",
            "error"
        );

        return;
    }

    const dataDetail = {

        paketMenu: {
            idMenu: parseInt(idMenu)
        },

        komoditas: {
            idKomoditas:
                parseInt(idKomoditas)
        },

        jumlahKebutuhanPerPorsi:
            parseFloat(jumlah)
    };

    try {

        const response =
            await fetch(
                `${BASE_URL}/detail-menu`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        dataDetail
                    )
                }
            );

        if (!response.ok) {

            showToast(
                "Gagal tambah detail menu",
                "error"
            );

            return;
        }

        showToast(
            "Detail menu berhasil ditambahkan",
            "success"
        );

        loadDetailMenu();

        document.getElementById(
            "idPaketDetail"
        ).value = "";

        document.getElementById(
            "idKomoditasDetail"
        ).value = "";

        document.getElementById(
            "jumlahKebutuhan"
        ).value = "";

    }

    catch (error) {

        console.log(error);

        showToast(
            "Terjadi kesalahan",
            "error"
        );
    }


}

// ==========================
// HAPUS DETAIL MENU
// ==========================

async function hapusDetailMenu(id) {


    try {

        await fetch(
            `${BASE_URL}/detail-menu/${id}`,
            {
                method: "DELETE"
            }
        );

        showToast(
            "Detail menu berhasil dihapus",
            "success"
        );

        loadDetailMenu();

    }

    catch (error) {

        console.log(error);

        showToast(
            "Gagal hapus detail menu",
            "error"
        );
    }


}

async function loadDashboardPreview() {

    const body =
        document.getElementById("dashboardDistribusiPreview");

    if (!body) return;

    try {

        const res =
            await fetch(`${BASE_URL}/distribusi`);

        const data =
            await res.json();

        body.innerHTML = "";

        // ambil 5 data terbaru saja biar ringkas
        data.slice(0, 5).forEach(item => {

            body.innerHTML += `
                <tr>
                    <td>${item.paketMenu?.namaMenu || "-"}</td>
                    <td>${item.penerimaManfaat?.namaInstansi || "-"}</td>
                    <td>${item.jumlahPorsiDikirim}</td>
                    <td>${item.status}</td>
                </tr>
            `;
        });

    } catch (error) {

        console.log(error);

        showToast("Gagal load dashboard preview", "error");
    }
}

async function loadKomoditasPetani() {

    const body = document.getElementById("komoditasBody");
    if (!body) return;

    const idUser = localStorage.getItem("idUser");

    try {
        const response = await fetch(`${BASE_URL}/komoditas`);
        const data = await response.json();

        // FILTER (kalau backend belum support user)
        const filtered = data.filter(item =>
            item.petani?.idUser == idUser || item.petani == null
        );

        body.innerHTML = "";

        filtered.forEach((item, i) => {
            body.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${item.namaBahan}</td>
                    <td>${item.stokSaatIni} ${item.satuan || "kg"}</td>
                </tr>
            `;
        });

        document.getElementById("totalKomoditas").innerText = filtered.length;

    } catch (error) {
        console.log(error);
        showToast("Gagal load stok petani", "error");
    }
}

async function loadPermintaan() {

    const body = document.getElementById("permintaanBody");
    if (!body) return;

    // sementara dummy dulu
    const data = [
        { komoditas: "Beras", jumlah: 10, status: "Menunggu" },
        { komoditas: "Sayur", jumlah: 5, status: "Disetujui" }
    ];

    body.innerHTML = "";

    data.forEach((item, i) => {
        body.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.komoditas}</td>
                <td>${item.jumlah}</td>
                <td>${item.status}</td>
            </tr>
        `;
    });

    document.getElementById("totalPermintaan").innerText = data.length;
}

async function loadDashboardPetani() {

    const idUser = localStorage.getItem("idUser");

    try {
        const response = await fetch(`${BASE_URL}/komoditas`);
        const data = await response.json();

        const mine = data.filter(item =>
            item.petani?.idUser == idUser || item.petani == null
        );

        // total
        document.getElementById("totalKomoditas").innerText = mine.length;

        // stok menipis (<= 10 kg)
        const lowStock = mine.filter(item => item.stokSaatIni <= 10);
        document.getElementById("stokMenipis").innerText = lowStock.length;

        // stok terendah
        if (mine.length > 0) {
            const lowest = mine.reduce((a, b) =>
                a.stokSaatIni < b.stokSaatIni ? a : b
            );

            document.getElementById("stokTerendah").innerText =
                `${lowest.namaBahan} (${lowest.stokSaatIni} ${lowest.satuan || "kg"})`;
        }

    } catch (error) {
        console.log(error);
        showToast("Gagal load dashboard petani", "error");
    }

    // dummy permintaan dulu
    const permintaan = 2; // nanti dari API beneran
    document.getElementById("totalPermintaan").innerText = permintaan;
}

async function loadDashboardSekolah() {

    const idUser = localStorage.getItem("idUser");

    try {
        const response = await fetch(`${BASE_URL}/distribusi`);
        const data = await response.json();

        // filter hanya untuk sekolah login
        const mine = data.filter(item =>
            item.penerimaManfaat?.idUser == idUser
        );

        document.getElementById("totalDistribusi").innerText = mine.length;

        const proses = mine.filter(d => d.status === "Proses").length;
        const selesai = mine.filter(d => d.status === "Selesai").length;

        document.getElementById("prosesDistribusi").innerText = proses;
        document.getElementById("selesaiDistribusi").innerText = selesai;

        // status terbaru
        if (mine.length > 0) {
            const latest = mine[mine.length - 1];

            document.getElementById("statusTerbaru").innerText =
                `${latest.paketMenu?.namaMenu || "-"} - ${latest.status}`;
        }

    } catch (error) {
        console.log(error);
        showToast("Gagal load dashboard sekolah", "error");
    }
}

async function register() {

    const role = document.getElementById("role").value;
    const username = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    if (!role || !username || !password) {
        showToast("Data belum lengkap", "error");
        return;
    }

    let data = {
        username,
        password,
        role
    };

    if (role === "PETANI") {
        data.namaPetani = document.getElementById("namaPetani")?.value;
    }

    if (role === "SEKOLAH") {
        data.namaInstansi = document.getElementById("namaInstansi")?.value;
    }

    try {

        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            showToast(result.message, "error");
            return;
        }

        showToast("Register berhasil", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);

    } catch (err) {
        console.log(err);
        showToast("Server error", "error");
    }
}

function renderRegisterForm() {

    const role = document.getElementById("role").value;
    const form = document.getElementById("dynamicForm");

    form.innerHTML = "";

    if (role === "ADMIN") {

        form.innerHTML = `
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
        `;
    }

    else if (role === "PETANI") {

        form.innerHTML = `
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <input type="text" id="namaPetani" placeholder="Nama Petani">
        `;
    }

    else if (role === "SEKOLAH") {

        form.innerHTML = `
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <input type="text" id="namaInstansi" placeholder="Nama Sekolah">
        `;
    }
}

// ==========================
// AUTO LOAD
// ==========================

window.onload = function () {
    showPage("dashboard");

    const role = localStorage.getItem("role");

    if (role === "PETANI") {
        loadDashboardPetani();
        loadKomoditasPetani();
        loadPermintaan();
    }

    loadDashboardSekolah();

    loadDashboardPreview();

    loadDetailMenu();

    loadDropdownDetailMenu();

    loadKomoditas();

    loadGudang();

    loadPaket();

    loadDistribusi();

    loadPesanan();

    loadKomentar();

    loadDropdownPaket();

    loadDropdownPenerima();
}