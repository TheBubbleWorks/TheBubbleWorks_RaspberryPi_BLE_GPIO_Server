#!/bin/bash


BUS_TYPE=${1:-USB}

echo --- Stopping bluetooth
echo
sudo systemctl stop bluetooth

echo --- Turning off ALL Bluetooth adatpers.
echo
hciconfig | grep hci| cut -d ':' -f 1 | xargs -I % sudo hciconfig %I down

echo --- Turing on $BUS_TYPE bus type Bluetooth adatpers only.
echo
hciconfig | grep $BUS_TYPE | cut -d ':' -f 1 | xargs -I % sudo hciconfig %I up

echo --- Adadtper status:
echo
hciconfig

node main.js

