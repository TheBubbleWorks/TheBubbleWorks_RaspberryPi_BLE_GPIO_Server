# RaspberryPi BLE GPIO Server Demo

NodeJS &amp; 'bleno' based Demo of a Bluetooth LE GATT Server supporting remote Raspberry Pi GPIO control


Please see [INSTALL](INSTALL.md) for instructions on how to setup the system packages and install the software..

# Configuration

## Bluetooth Adapter

If you don't have a Pi 3 you will need to use a USB Bluetooth LE dongle.

It's currently necessary to stop the (bluez) `bluetoothd` daemon as there is a conflict between how bleno and the a Bluez builtin GATT server overlap.

 
```
sudo systemctl stop bluetooth
sudo hciconfig
```


# Start
Running:


```
npm start
```


If you have more than 1 adapter connected you can specify the device when starting, e.g. for hci1:

```
BLENO_HCI_DEVICE_ID=1 npm start
```


Note: Be aware that the server is only available on one adapter at a time.


# Wiring:

LED to 27 and GND


# Testing

## Basic GPIO

Python based GPIO sanity check:
```
python test/test_led.py
```

NodeJS based GPIO sanity check:
```
node test/test_led.js`
```

## BLE

Raw Testing usng LightBlue:

0031021b01
0031021b00


## Web Bluetooth Browser Demo:

Scroll down to the RasperryPi Demo on https://www.thebubbleworks.com/


# Example output 

```
pi@raspberrypi:~/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server $ npm start 
hci0:	Type: BR/EDR  Bus: UART
	BD Address: B8:27:EB:0A:F7:8E  ACL MTU: 1021:8  SCO MTU: 64:1
	UP
	RX bytes:2116 acl:0 sco:0 events:121 errors:0
	TX bytes:3052 acl:0 sco:0 commands:121 errors:0

on -> stateChange: poweredOn
on -> advertisingStart: success
on -> servicesSet, error?: undefined
on -> advertisingStart, error?: null
```


When you connect and send messages you will see something like:

```
on -> stateAccept: 62:61:ec:2c:d4:4e
UARTTXCharacteristic - onWriteRequest: len = 5 value = 0031021b01
Set pin state pin = 27 State = 1
UARTTXCharacteristic - onWriteRequest: len = 5 value = 0031021b00
Set pin state pin = 27 State = 0
```

---

#  LIve Demo


Open a demo in a Web Bluetooth enabled browser [here](https://www.thebubbleworks.com/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server/test/www/).