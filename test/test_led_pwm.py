import RPi.GPIO as GPIO
import time

LED_PIN = 23
PWM_FREQ = 40


try:
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    GPIO.setup(LED_PIN, GPIO.OUT)

    ledPwm = GPIO.PWM(LED_PIN, PWM_FREQ)
    ledPwm.start(0)


    for duty in range(0,100):
        ledPwm.ChangeDutyCycle(duty)
        time.sleep(0.1)


except KeyboardInterrupt:
    pass


GPIO.cleanup()


