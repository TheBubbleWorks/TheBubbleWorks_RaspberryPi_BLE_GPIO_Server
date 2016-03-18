import os
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(27, GPIO.OUT)

for x in range(1,5):
    GPIO.output(27,1)
    time.sleep(0.5)
    GPIO.output(27,0)
    time.sleep(0.5)

GPIO.cleanup()


