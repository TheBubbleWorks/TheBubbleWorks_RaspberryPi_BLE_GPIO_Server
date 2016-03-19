# RaspberryPi BLE GPIO Server Demo
NodeJS &amp; 'bleno' based Demo of a Bluetooth LE GATT Server supporting remote Raspberry Pi GPIO control


Please see [INSTALL](INSTALL.md) for instructions on how to setup the system packages and install the software..

# Configuration

## Bluetooth Adapter

At the time of writing there is an open 

Because you need to use a USB Bluetooth LE dongle you will need to enable it and disable the Pi's built-in BLE device.

It's alos necessary to stop the bluez bluetooth daemon as there is a conflict with the a Bluez builtin GATT server.

 
```
sudo systemctl stop bluetooth
sudo hciconfig
```

The output of `hciconfig` may look like these cases:

Case 1: hci0 is the Pi's built-in BLE device:

```
hci1:	Type: BR/EDR  Bus: USB
	BD Address: 5C:F3:70:68:DB:AF  ACL MTU: 1021:8  SCO MTU: 64:1
	UP RUNNING 
	RX bytes:14252 acl:402 sco:0 events:1007 errors:0
	TX bytes:18778 acl:509 sco:0 commands:617 errors:0

hci0:	Type: BR/EDR  Bus: UART
	BD Address: B8:27:EB:0A:F7:8E  ACL MTU: 1021:8  SCO MTU: 64:1
	DOWN 
	RX bytes:12569 acl:58 sco:0 events:332 errors:0
	TX bytes:5563 acl:52 sco:0 commands:220 errors:0
```

Or may look like this:

Case 2: hci1 is the Pi's built-in BLE device:

```
hci1:	Type: BR/EDR  Bus: UART
	BD Address: B8:27:EB:0A:F7:8E  ACL MTU: 1021:8  SCO MTU: 64:1
	DOWN 
	RX bytes:1420 acl:0 sco:0 events:82 errors:0
	TX bytes:2294 acl:0 sco:0 commands:82 errors:0

hci0:	Type: BR/EDR  Bus: USB
	BD Address: 5C:F3:70:68:DB:AF  ACL MTU: 1021:8  SCO MTU: 64:1
	UP RUNNING 
	RX bytes:1274 acl:0 sco:0 events:78 errors:0
	TX bytes:2182 acl:0 sco:0 commands:78 errors:0
```


NOTE: choose the hci device that has `BUS: USB` it wont always be the same hci device id.


```
sudo hciconfig hci0 down
sudo hciconfig hci1 up
```

To simplyfiy thing the start script that shuts down all the adapters then start the USB ones.

Shut down all Bluetooth adapters;

```
hciconfig | grep hci| cut -d ':' -f 1 | xargs -I % sudo hciconfig %I down
```


Start the 'USB' type adapters only. If you have  than one connected it will start them all, you can specify which one at start-up (see below)

```
hciconfig | grep USB | cut -d ':' -f 1 | xargs -I % sudo hciconfig %I up
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
hci2:	Type: BR/EDR  Bus: USB
	BD Address: 00:1A:7D:DA:71:13  ACL MTU: 310:10  SCO MTU: 64:8
	UP RUNNING 
	RX bytes:2976 acl:0 sco:0 events:165 errors:0
	TX bytes:2051 acl:0 sco:0 commands:165 errors:0

hci1:	Type: BR/EDR  Bus: UART
	BD Address: B8:27:EB:0A:F7:8E  ACL MTU: 1021:8  SCO MTU: 64:1
	DOWN 
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
