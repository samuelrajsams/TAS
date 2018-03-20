__auther__ = "Satish Reddy"
__version__ = "0.1RC"

from config import user_api, user_api_page_size, levels_api, campaigns_api, user_history_api, user_credits_api, \
    user_data_file
from config import debug_log, error_log
import requests as rq
import json
import pandas as pd
from pdb import set_trace as trace
import random
import copy
from datetime import datetime


headers={"accept": "application/json",  "cache-control": "no-cache", "content-type": "application/json", "postman-token": "48c76a4c-51a0-3ad6-4b52-f874a9daa469", "x-pas-token": "7c09a84e86338059a5"}

#TODO: use the new API for getting user information, store it locally in a file, see of the file exists
#else take from the API
def getUserInfo(URL, params = None):
    """
    This method is used to get the user list and info from API End point
    Input : {
            <URL> : End point location
            <params> : Optional input parameters
            }
    """
    # print "inside getUserInfo", params
    if not params:
        try:
            resp = rq.post(URL)
            debug_log.debug("The response from User list api : %s"%resp.text)
            data = json.loads(resp.text)
            if type(data) is dict and data.get('Message'):
                debug_log.debug("There is an error response : ")
                debug_log.debug("%s"%str(data))
                return {"Error":True, "Message":"There is an error from End point"}
            df = pd.DataFrame(data)
        except:
            error_log.exception("There is an error fetching the user list from API")
    elif "pagination" in params:
        try:
            page_size = 20
            # "https://example.com/{0}".format( first_id )
            URL_with_pagniation = URL + "?pageSize=" + str(params["page_size"])
            resp = rq.get(URL_with_pagniation)
            debug_log.debug("The response from User list api : %s"%resp.text)
            data = json.loads(resp.text)
            if type(data) is dict and data.get('Message'):
                debug_log.debug("There is an error response : ")
                debug_log.debug("%s"%str(data))
                return {"Error":True, "Message":"There is an error from End point"}
            pagination_info = data['pagn']
            user_data = data['userdata']
            df = pd.DataFrame(user_data)
            df.to_csv(user_data_file, mode='w', header=True)
            for i in range(2,pagination_info['totalPages']):
                URL_with_pagniation_page_num = URL_with_pagniation + "&pageNumber=%s" %i
                resp = rq.get(URL_with_pagniation_page_num)
                debug_log.debug("Retrieving data from page: %s" % i)
                data = json.loads(resp.text)
                if type(data) is dict and data.get('Message'):
                    debug_log.debug("There is an error response : ")
                    debug_log.debug("%s" % str(data))
                    return {"Error": True, "Message": "There is an error from End point"}
                user_data = data['userdata']
                df_temp = pd.DataFrame(user_data)
                df_temp.to_csv(user_data_file, mode='a', header=False)
        except Exception as e:
            print 'inside exception',e
            raise
    # print df
    return df

def getLevels(URL, params = None):
    """
    This method is used to get the levels info from API End point
    Input : {
            <URL> : End point location
            <params> : Optional input parameters
            }
    """
    if not params:
        try:
            resp = rq.get(URL, headers = headers)
            debug_log.debug("The response from Level information api : %s"%resp.text)
            data = json.loads(resp.text)
            if type(data) is dict and data.get('message'):
                debug_log.debug("There is an error response : ")
                debug_log.debug("%s"%str(data))
                return {"Error":True, "Message":data.get('message')}
            level_df = pd.DataFrame(data['data'])
            level_df['level_limit'] = level_df.next_level_eligibility_criteria.apply(lambda x:x['min_credits'])
            level_df['level'] = level_df.level_id.apply(lambda x:x.split('-')[1])
        except:
            error_log.exception("There is an error fetching the level information")
    level_df = level_df[['_id', 'package_id', 'level', 'level_limit']]
    return level_df



def getCampaigns(URL, params = None):
    """
    This method is used to get the campaigns/tasks info from API End point
    Input : {
            <URL> : End point location
            <params> : Optional input parameters
            }
    """
    if not params:
        try:
            resp = rq.get(URL, headers = headers)
            debug_log.debug("The response from campaign list api : %s"%resp.text)
            data = json.loads(resp.text)
            if type(data) is dict and data.get('message'):
                debug_log.debug("There is an error response : ")
                debug_log.debug("%s"%str(data))
                return {"Error":True, "Message":data.get('message')}
            camp_df = pd.DataFrame(data['data'])
            camp_df['level'] = camp_df.level_id.apply(lambda x:x.split('-')[1])
        except:
            error_log.exception("There is an error fetching the available campaigns")
    camp_df = camp_df[['_id', 'task_category_brand_uid', 'package_id', 'level', 'user_credits', 'campaign_priority']]
    return camp_df



def getUserHistory(URL, params = None):
    """
    This method is used to get the User History info from API End point
    Input : {
            <URL> : End point location
            <params> : Optional input parameters, user_ids
            }
    """
    try:
        if params:
            resp = rq.get(URL, data = params, headers = headers)
            debug_log.debug("The response from user history api : %s"%resp.text)
            data = json.loads(resp.text)
            if type(data) is dict and data.get('message'):
                debug_log.debug("There is an error response : ")
                debug_log.debug("%s"%str(data))
                return {"Error":True, "Message":data.get('message')}
            hist_df = pd.DataFrame(data['data'])
    except:
        error_log.exception("There is an error fetching the User History from API") 
    return hist_df 


def getUserCredits(URL, params = None):
    """
    This method is used to get the User Credits info from API End point
    Input : {
            <URL> : End point location
            <params> : Optional input parameters, user_ids
            }
    """
    try:
        if params:
            resp = rq.post(URL, data = json.dumps({"accounts":params}), headers = headers)
            debug_log.debug("The response from user history api : %s"%resp.text)
            data = json.loads(resp.text)
            if type(data) is dict and data.get('message'):
                debug_log.debug("There is an error response : ")
                debug_log.debug("%s"%str(data))
                return {"Error":True, "Message":data.get('message')}
            creds_df = pd.DataFrame(data['data'])
    except:
        error_log.exception("There is an error fetching the User History from API") 
    return creds_df 


def userPoints(Package = 1, Level = 1, Difficulty = 1):
    """
    Given package, level of the user this method will return the points user gets by completing the task assigned to him. This method makes the task independent of the package/level but on the user's package and his current level. Points EQ. = ( Alpha*(User_Package) + Beta*(User's_Level)) * (1 + Gamma * Difficulty)
    Input : {
            <Package> : Package user has purchased
            <Level> : User's current level
            }

    """
    points =  (Alpha * Package + Beta * Level) * (1 + Gamma * Difficulty)
    return points

"""

def assignTasks(row, levels = {}, campaigns = []):
    try:
        creds_to_level = (levels.get(row['Level']) - row['credits'])
        possible_camps = [i for i in campaigns if i not in row['campaigns']]
        random.shuffle(possible_camps)
        assigned = []
        for task in possible_camps:
            assigned.append(task)
            creds_to_level = creds_to_level - user_creds[campaigns.index(task)]
            if creds_to_level <= 0:break
    except:
        error_log.exception("Error while checking for possible # of tasks, assigning new tasks")
    return assigned
"""


def applyTask(df, tasks = {}, level_pts = 0, user_history = None):
    """
    For every package, level users, assign tasks based on priority
    """
    priority = tasks[tasks['campaign_priority'] == 2]
    normal = tasks[tasks['campaign_priority'] != 2]
    t_list = []
    uid_list = []
    creds_to_level = level_pts - df['credits']
    # First assign all the tasks that are priority
    for i, task in priority.iterrows():
        task_creds = int(task['user_credits'])
        task_id = task['task_category_brand_uid']
        if creds_to_level <= 0:
           break 
        elif task_id not in user_history: 
            t_list.append(str(task['_id']))
            uid_list.append(task_id)
            creds_to_level = creds_to_level -  task_creds
    # Assign the normal priority tasks based on credits to cross level for the user
    for i, task in normal.iterrows():
        task_creds = int(task['user_credits'])
        task_id = task['task_category_brand_uid']
        if creds_to_level <= 0:
           break 
        elif task_id not in user_history: 
            t_list.append(str(task['_id']))
            uid_list.append(task_id)
            creds_to_level = creds_to_level -  task_creds
    return t_list, uid_list

def assign_tasks(users, levels, camps, hist):
    """
    Subset the users, campaign for each package, level and then assign tasks using applyTask method
    """
    hist_dict = {row['user_id']:row['user_history'] for i, row in hist.iterrows()}
    assign_list = []
    for i, user in users.iterrows():
        user_history = hist_dict.get(user['user_id']) or []
        package = 'p' + str(user['Package'])
        level = 'l' + str(user['Level'])
        possible_tasks = camps[(camps['package_id'] == package) & (camps['level'] == level)]
        level_pts = levels[(levels['package_id'] == package) & (levels['level'] == level)].level_limit.values
        if len(level_pts) ==0:
            assign_list.append([])
            continue
        level_pts = level_pts[0]
        resp, uid_list = applyTask(user, tasks = possible_tasks, level_pts = level_pts, user_history = user_history)
        user_history.extend(uid_list)
        assign_list.append(resp)
        hist_dict[user['user_id']] = user_history
    users['assigned'] = assign_list
    # print "returning  assign_tasks"
    return users


def taskMain():
    """
    This method will allot tasks to users based on the following criteria.
    1. Allot task which is not alloted to user in the past, given that the task can be done only once from one user device.
    2. Allot as many task from that perticular level as long as user just crosses the level with points earned.
    
    ####### Future Scope
    3. Task prioritization based on profit to company, task completion time etc.
    4. User behavioural analysis and assign task based on performance.
    5. User segmentation, to better assign tasks for users based on user interests (can be pulled from social media)
    6. ML based optimization of revenue/profit etc.
    """
    try:
        print "Fetching the User List from MB API"
        users_df = getUserInfo(user_api,{"pagination":"1", "page_size":user_api_page_size})
        print "Fetching the Level's information"
        levels_df = getLevels(levels_api)
        print "Fetching the Campaign's information"
        camp_df = getCampaigns(campaigns_api)
        hist_params = {"user_ids":list(set([str(i) for i in users_df.UserId.values]))}
        print "Fetching the User History information"
        hist_df = getUserHistory(user_history_api, params = json.dumps(hist_params))
        hist_df['user_history'] = hist_df.task_category_brands.apply(lambda x:[i['task_category_brand_uid'] for i in x])
        print "Fetching Users Credits balance"
        creds_input = [{"user_id":row['UserId'], "account_id":row['AccountId']} for i, row in users_df.iterrows()]
        user_creds = getUserCredits(user_credits_api, params = creds_input)
        users_df = users_df.merge(user_creds, how = 'left', left_on = ['UserId', 'AccountId'], right_on = ['user_id', 'account_id']) 
        print "Allotting the Tasks to users"
        resp = assign_tasks(users_df, levels_df, camp_df, hist_df)
        df = resp[['user_id','AccountId', 'Package', 'Level', 'assigned']]
        alloted_tasks = []
        print "alloted_tasks",alloted_tasks
        for i, row in df.iterrows():
            rowd = row.to_dict()
            assign = tuple(rowd['assigned'])
            for task in assign:
                rowd['assigned'] = task
                alloted_tasks.append(copy.deepcopy(rowd))
        df_final = pd.DataFrame(alloted_tasks)
        df_final = df_final.drop_duplicates(['user_id', 'assigned'])
        df_final = df_final[['user_id', 'AccountId', 'Package', 'Level', 'assigned']]
        df_final['Task_Allotted_Time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return df_final
    except Exception as e:
        print 'error in main thread', e
        error_log.exception("There is some error in assigning the tasks to users")
        return "There is an error alloting tasks.\n Check Logs/ERROR_%s.log for details"%datetime.now().strftime('%Y%m%d')

if __name__ == '__main__':
    df = taskMain()
    if isinstance(df, str):
        print df
    else:
        FName = "Output/TA_%s.csv"%datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        df.to_csv(FName, index = False, header = True)
        print "Successfully generated csv with task mapping to users"
