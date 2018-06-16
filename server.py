from flask import Flask
from flask_socketio import SocketIO, emit
import atexit

import random

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger


app = Flask(__name__)
app.config['SECRET_KEY'] = "eco-test"
socketio = SocketIO(app)
test = [1]
rnd = random.Random()

@app.route("/")
def index():
    return app.send_static_file('index.html')

def update():
    print("Update sent")
    test.append(rnd.randint(0, 8))
    socketio.emit('updateElevation', test)
    socketio.emit('updateSpeed', test)

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