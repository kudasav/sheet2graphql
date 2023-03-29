from .schedule import Scheduler
from .models import *

def delete_files():
    pass

def start_scheduler():
    scheduler = Scheduler()
    scheduler.every(1).minutes.do(delete_files)
    scheduler.run_continuously()