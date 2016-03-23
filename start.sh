echo --- Stopping bluetooth
echo
sudo systemctl stop bluetooth

echo --- Turning off ALL Bluetooth adatpers.
echo
hciconfig | grep hci| cut -d ':' -f 1 | xargs -I % sudo hciconfig %I down

echo --- Turing on 'USB bus type' Bluetooth adatpers only.
echo
hciconfig | grep USB | cut -d ':' -f 1 | xargs -I % sudo hciconfig %I up

echo --- Adadtper status:
echo
hciconfig

node main.js

