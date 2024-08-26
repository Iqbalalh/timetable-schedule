Note:

- routing:
1. folder () tidak masuk kedalam route jadi gaada /backend atau /frontend
contoh: (backend) dan (fronted) ga bisa diakses /backend /frontend

2. folder [] adalah folder dynamic jadi folder yang ada ini nya namanya bisa berubah sesuai dengan route yang ingin diakses
contoh: [id], route nya bukan /api/id, tapi tergantung misal di passing id = 1, jadinya /api/1

3. folder yang gaada bracket itu static routing jadi bisa diakses dan gabisa diubah
contoh: /api/utils

4. page.js dipakai buat halaman yang akan diliat
contoh: /routing

5. route.js dipakai buat nulis api, jadi walaupun diketik url /api/classroom gabakal bisa dikasi tampilan, cuma bisa di hit api nya aja
contoh: /api/user gabakal ada tampilan

6. layout.js dipakai buat layout jadi semua yg jadi subfolder atau childrennya bakal kebawa

Penting:
1. sebisa mungkin semua styling pakai className diisi tailwind kecuali buat animasi aneh2
2. semua penulisan yang bukan tampilan pakai bahasa inggris camelCase
3. sebisa mungkin pakai antd buat mempercepat dev
4. fe konek ke be via hit api nanti ada var nya dibuat di utils
5. usahakan code readable
6. baca dokumentasi next 14, karena versi dibawahnya bakalan lumayan beda routingnya

