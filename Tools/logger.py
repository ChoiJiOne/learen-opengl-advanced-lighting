import logging
import sys
import os
from datetime import datetime

def init_logger(log_file_path: str = None):
    if not log_file_path:
        raise ValueError("Invalid log file path.")
    
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter("[%(asctime)s] [%(levelname)s] %(message)s")

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    if os.path.isdir(log_file_path) or log_file_path.endswith("/"):
        os.makedirs(log_file_path, exist_ok=True)
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        log_file_path = os.path.join(log_file_path, f"{timestamp}.log")
    else:
        os.makedirs(os.path.dirname(log_file_path), exist_ok=True)

    file_handler = logging.FileHandler(log_file_path, encoding="utf-8")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger