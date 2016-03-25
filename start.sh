#!/bin/bash

echo --- Stopping bluetooth
echo
sudo systemctl stop bluetooth

echo --- Turning off ALL Bluetooth adatpers.
echo
hciconfig | grep hci| cut -d ':' -f 1 | xargs -I % sudo hciconfig %I down

echo --- Turing on ALL Bluetooth adatpers.
echo
hciconfig | grep hci | cut -d ':' -f 1 | xargs -I % sudo hciconfig %I up

echo --- Adadtper status:
echo
hciconfig

node main.js

