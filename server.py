from flask import Flask
from flask_socketio import SocketIO, emit
import atexit

import random

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger


app = Flask(__name__)
app.config['SECRET_KEY'] = "eco-test"
socketio = SocketIO(app)

sample_elevation = [20] * 10
sample_speed = [80] * 10
rnd = random.Random()


@app.route("/")
def index():
    return app.send_static_file('index.html')


def update():
    print("Update sent")

    sample_elevation.append(rnd.randint(20, 25))
    if len(sample_elevation) > 10:
        sample_elevation.pop(0)

    sample_speed.append(rnd.randint(
        sample_speed[-1] - 10, sample_speed[-1] + 10))
    if len(sample_speed) > 10:
        sample_speed.pop(0)

    socketio.emit('updateElevation', sample_elevation)
    socketio.emit('updateSpeed', sample_speed)


if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.start()
    scheduler.add_job(
        func=update,
        trigger=IntervalTrigger(seconds=5),
        id='update_job',
        name='Updates',
        replace_existing=True)
    atexit.register(lambda: scheduler.shutdown())
    socketio.run(app, use_reloader=False)
