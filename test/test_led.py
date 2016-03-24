import os
import RPi.GPIO as GPIO
import time

LED_PIN = 23
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

for x in range(1,5):
    GPIO.output(LED_PIN,1)
    time.sleep(0.5)
    GPIO.output(LED_PIN,0)
    time.sleep(0.5)

GPIO.cleanup()


