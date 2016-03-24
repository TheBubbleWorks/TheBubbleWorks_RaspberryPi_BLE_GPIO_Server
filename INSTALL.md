These install instructions guide you thru setting up the system packages and the demo source code.

By starting with the same Raspbian image (linked below) and then by following the instructions on this page you should have a setup that as identical to mine. (Depending on your Bluetooth LE dongle)



# Pre-requisites

* Raspian Jessie 
* Chrome 49+ on ChromeOS, Android or Linux, for the most up to date info  [see the support matrix](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md).
* Bluetooth LE dongle, if your not running on a Pi 3  

The demo was developed using:

* [Belkin USB 4.0 Bluetooth Adapter](http://www.amazon.co.uk/gp/product/B009IQB3US)
* Raspberry Pi 3 (also tested on a Pi 2)


### Working

* [Belkin USB 4.0 Bluetooth Adapter](http://www.amazon.co.uk/gp/product/B009IQB3US)
* [Inateck Wireless Bluetooth 4.0](http://www.amazon.co.uk/dp/B00F0CG0N4)

### Not Working

* TBC

### Not yet tested

* [Rocketek Bluetooth 4.0 ](http://www.amazon.co.uk/gp/product/B00H8O8CMO?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [Racksoy Professional Bluetooth CSR 4.0 ](http://www.amazon.co.uk/gp/product/B00KNPTHS8?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [EasyAcc Bluetooth 4.0 ](http://www.amazon.co.uk/gp/product/B00VHUM06Y?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [Inateck Bluetooth 4.0 ](http://www.amazon.co.uk/gp/product/B00MTBZY4A?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [Inateck Wireless Bluetooth 4.0 Adapter](http://www.amazon.co.uk/gp/product/B00F0CG0N4?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [ORICO BTA-402 USB Bluetooth 4.0](http://www.amazon.co.uk/gp/product/B00K5TJP02?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [ORICO USB Bluetooth Adapter](http://www.amazon.co.uk/gp/product/B00ESBRTMO?psc=1&redirect=true&ref_=oh_aui_search_detailpage)
* [Plugable USB Bluetooth 4.0 ](http://www.amazon.co.uk/gp/product/B009ZIILLI?psc=1&redirect=true&ref_=oh_aui_search_detailpage)




* * *
# Download

https://downloads.raspberrypi.org/raspbian/images/raspbian-2016-02-29/2016-02-26-raspbian-jessie.zip

# Pi Configure
```
sudo raspi-config 
```

- Expand the file system
- Reboot


# NodeJS

The version of NodeJS shipped on the Raspbian image is too old.  The following 
from: http://nodered.org/docs/hardware/raspberrypi#upgrading

```
sudo apt-get update
sudo apt-get remove nodered nodejs nodejs-legacy npm
```

```
curl -sL https://deb.nodesource.com/setup_5.x | sudo bash -

sudo apt-get install -y nodejs build-essential python-dev python-rpi.gpio nodejs libudev-dev libusb-1.0-0.dev libcap2-bin

sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

[REBOOT]




Note, if you want node red back:

```
sudo npm cache clean
sudo npm install -g --unsafe-perm  node-red
```

#  Demo source


```
git clone https://github.com/TheBubbleWorks/TheBubbleWorks_RaspberryPi_BLE_GPIO_Server.git
cd TheBubbleWorks_RaspberryPi_BLE_GPIO_Server
npm install
```

You will probbaly see some harmless warnings as shown below, you can ignore these:
```
npm WARN package.json battery-service@0.1.0 No repository field.
npm WARN package.json battery-service@0.1.0 No license field.
npm WARN optional dep failed, continuing xpc-connection@0.1.4
```

