@echo off

cd client
start cmd /k npm run dev

timeout /t 10000 /nobreak  >nul  REM Wait for 10 seconds (adjust as needed)

cd ../server
start cmd /k npm start


cd ..
start cmd /k code .

timeout /t 10000 /nobreak  >nul  REM Wait for 10 seconds (adjust as needed)


"C:\Program Files\Google\Chrome\Application\chrome_proxy.exe" --profile-directory=Default --app-id=idemibpphagihbobmgmaojhjfidlfpdl