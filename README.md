# ocr-hw
BME MSc III - Felhők hálózati szolgáltatásai laboratórium házi feladat

[![Actions Status](https://github.com/Szombatioi/ocr-hw/workflows/Test,%20build%20and%20release/badge.svg)](https://github.com/Szombatioi/ocr-hw/actions)

[Futtatható program linkje](https://github.com/Szombatioi/ocr-hw/releases/tag/latest)

## Lokális tesztelés
Adatbázis futtatása docker konténerként:
`docker run --name dev-ocr -e POSTGRES_USER=ocr -e POSTGRES_PASSWORD=ocr -e POSTGRES_DB=ocr_dev -p 5432:5432 -d postgres`

`.env` fájl feltöltése adatokkal:

OCR API kulcs beillesztése:
`OCR_API_KEY=...`

S3 Storage adatok:
```
S3_PROTOCOL=https
S3_PUBLIC_URL=...
S3_ENDPOINT=...
S3_PORT=443
S3_BUCKET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
```
