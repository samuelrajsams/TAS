__auther__ = "Satish Reddy"
__version__ = "0.1RC"

### This file contains all the configuration parameters used by the analytics project
from logger import createLogger

# user_api = "https://api.magicbuckshk.com/api/userinfoList"
user_api = "http://testapi.magicbuckspro.com/api/userinfoList"
  # https://testapi.magicbuckspro.com/api/userinformationlist?&pageNumber=1&pageSize=10
user_api_page_size=20

levels_api = "http://13.127.206.64:9909/api/v1/levels"

campaigns_api = "http://13.127.206.64:9909/api/v1/campaigns"

user_history_api = "http://13.127.206.64:9909/api/v1/users/history"

user_credits_api = "https://testapi.magicbuckspro.com/api/v1/accounts/credits"

# Points user gets per task by being in Package
Alpha = 2
# Points user gets per task by being in Level
Beta = 1
#Points for Task Difficulty
Gamma = 0.5

user_data_file = "./input/users.csv"

# Creating the debug and error Logs
debug_log = createLogger(log_type = "DEBUG")
error_log = createLogger(log_type = "ERROR")
