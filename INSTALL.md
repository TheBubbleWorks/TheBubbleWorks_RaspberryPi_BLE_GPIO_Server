

# Download

https://downloads.raspberrypi.org/raspbian/images/raspbian-2016-02-29/2016-02-26-raspbian-jessie.zip

# Pi Configure
sudo raspi-config 
(expand file system)



# Setup recent NodeJS
from: http://nodered.org/docs/hardware/raspberrypi#upgrading

`sudo apt-get update
sudo apt-get remove nodered nodejs nodejs-legacy npm
`


`curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
`

`sudo apt-get install -y nodejs build-essential python-dev python-rpi.gpio nodejs libudev-dev libusb-1.0-0.dev libcap2-bin
`

`sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
`
[REBOOT]




NOte:
If you want node red back:

sudo npm cache clean
sudo npm install -g --unsafe-perm  node-red


# Download and install Demo source


`git clone https://github.com/TheBubbleWorks/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server.git
cd TheBubbleWorks_RaspberryPi_BLE_GPIO_Server
npm install
`




# Setup Bluetooth Adapter
 
`sudo systemctl stop bluetooth
sudo hciconfig hci0 down
sudo hciconfig hci1 up
sudo hciconfig
`

The output of `hciconfi` may look like this:

`
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
`

OR this:

`
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
`



Running:


`npm start`

OR choose device:

`BLENO_HCI_DEVICE_ID=1 node main.js`


# Wiring:

LED to 27 and GND


# Testing

## Basic GPIO

Python based GPIO sanity check:
`python test/test_led.py`

NodeJS based GPIO sanity check:
`node test/test_led.js`


## BLE

Raw Testing usng LightBlue:


0031021b01
0031021b00


## Web Bluetooth Browser Demo:

Scroll down to the RasperryPi Demo on https://www.thebubbleworks.com/


# Example output 

`pi@raspberrypi:~/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server $ npm start

> bubble-rpi-gpio-server@0.0.1 start /home/pi/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server
> node main.js

on -> stateChange: poweredOn
on -> advertisingStart: success
on -> servicesSet, error?: undefined
on -> advertisingStart, error?: null
on -> stateAccept: 62:61:ec:2c:d4:4e
UARTTXCharacteristic - onWriteRequest: len = 5 value = 0031021b01
Set pin state pin = 27 State = 1
UARTTXCharacteristic - onWriteRequest: len = 5 value = 0031021b00
Set pin state pin = 27 State = 0
`
