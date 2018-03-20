__auther__ = "Satish Reddy"
__version__ = "0.1RC"

import logging
from datetime import datetime
import os
log_path = os.path.dirname(__file__) + "/Logs/"

def createLogger(log_type='DEBUG'):
    """
    Method to create logger object and return.
    """

    file_name = datetime.strftime(datetime.now(), "%Y%m%d")
    file_name = str(log_type) + "_"+ file_name + ".log"
    log_name = file_name
    file_name = logging.FileHandler(log_path + file_name)
    formatter = logging.Formatter("%(asctime)s : [%(filename)s %(funcName)s %(lineno)s] %(levelname)s - %(message)s")
    file_name.setFormatter(formatter)

    logger = logging.getLogger(log_name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(file_name)

    return logger


if __name__ == '__main__':
    debug_log = createLogger(log_type = "debug")
    error_log = createLogger(log_type = "error")
    debug_log.info("Testing the logging functionality")
    try:
        print testing_value
    except:
        error_log.exception("Error Printing the unknow value")
