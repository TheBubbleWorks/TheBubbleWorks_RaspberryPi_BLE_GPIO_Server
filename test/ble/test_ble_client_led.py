#!/usr/bin/env python2
#
# Description: Low level example of sending BLE messages to a GATT Service
#
#
#-----------------------------------------------------------------------------------------------------------------------

import array
import uuid
import time
import Adafruit_BluefruitLE

#import logging
#logging.basicConfig(level=logging.DEBUG)

# Define service and characteristic UUIDs used by the HM-11 module.

UART_SERVICE_UUID = uuid.UUID('6E400001-B5A3-F393-E0A9-E50E24DCCA9E'.lower())
TX_CHAR_UUID      = uuid.UUID('6E400002-B5A3-F393-E0A9-E50E24DCCA9E'.lower())
RX_CHAR_UUID      = uuid.UUID('6E400003-B5A3-F393-E0A9-E50E24DCCA9E'.lower())

ble = Adafruit_BluefruitLE.get_provider()

def main():
    ble.clear_cached_data()
    adapter = ble.get_default_adapter()
    adapter.power_on()
    print('Using adapter: {0}'.format(adapter.name))
    ble.disconnect_devices([UART_SERVICE_UUID])

    print('Searching for device...')
    try:
        adapter.start_scan()
        device = ble.find_device(service_uuids=[UART_SERVICE_UUID])
        if device is None:
            raise RuntimeError('Failed to find device!')
    finally:
        adapter.stop_scan()

    print('Connecting to device...')
    device.connect()  # Will time out after 60 seconds, specify timeout_sec parameter

    try:
        print('Discovering services...')
        device.discover([UART_SERVICE_UUID], [TX_CHAR_UUID, RX_CHAR_UUID])

        uart = device.find_service(UART_SERVICE_UUID)
        rx = uart.find_characteristic(RX_CHAR_UUID)
        tx = uart.find_characteristic(TX_CHAR_UUID)


        print('Sending messages to device...')

# Everything above this line is boilerplate.
#-----------------------------------------------------------------------------------------------------------------------
# The meat...

    #
    # In Summary: [Magic, FunctionCode, MotorASpeed, MotorBSpeed]
    #
    #   Magic is always 0x00
    #   FunctionCode 0x31 for 'RPi GPIO'
    #   see: https://github.com/TheBubbleWorks/TheBubbleWorks_BLE_UART_Protocol_Register.git

        for x in range(1, 5):
            print('LED On')
            tx.write_value(array.array('B', [0x00, 0x31,  0x02, 0x17, 0x01]))
            time.sleep(1)

            print('LED Off')
            tx.write_value(array.array('B', [0x00, 0x31,  0x02, 0x17, 0x00]))
            time.sleep(1)



#-----------------------------------------------------------------------------------------------------------------------
# Everything below this line is boilerplate.

    finally:
        device.disconnect()


ble.initialize()
ble.run_mainloop_with(main)

