
download:

https://downloads.raspberrypi.org/raspbian/images/raspbian-2016-02-29/2016-02-26-raspbian-jessie.zip

(sudo raspi-config expand file system)

sudo rpi-update f406502f5628d32e6ca5dadac34ff7ca59f8e27f

from: http://nodered.org/docs/hardware/raspberrypi#upgrading

sudo apt-get remove nodered nodejs nodejs-legacy npm
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
apt-get install nodejs
sudo apt-get install -y build-essential python-dev python-rpi.gpio nodejs libudev-dev libusb-1.0-0.dev libcap2-bin
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
[REBOOT]





If you want node red back:

sudo npm cache clean
sudo npm install -g --unsafe-perm  node-red


Setup Bluetooth Adapter


sudo systemctl stop bluetooth
sudo hciconfig hci0 down
sudo hciconfig hci1 up
sudo hciconfig

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



Install 

npm install

Running:


node main.js


BLENO_HCI_DEVICE_ID=1 node main.js


Testing

Raw Testing usng LightBlue:

Wiring:


Bluetooth
0031021b01
0031021b00


Browser Demo:

Scroll down to the RasperryPi Demo on https://www.thebubbleworks.com/

