@echo off
echo ===================================================
echo   KUR'AN ANLAM HARITASI - BASLATILIYOR 
echo ===================================================
echo.
echo 1. Backend Baslatiliyor...
start "Backend Server" cmd /k "cd backend && npm start"

echo 2. Frontend Baslatiliyor...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ===================================================
echo   BASARIYLA BASLATILDI!
echo ===================================================
echo.
echo Bilgisayardan su adrese gir:
echo   Local:   http://localhost:5173
echo.
echo Telefondan su adrese gir (IP degisebilir!):
ipconfig | findstr /i "IPv4"
echo   Port:    :5173
echo.
echo Pencereyi kapatabilirsiniz, sunucular arka planda calisiyor.
pause
