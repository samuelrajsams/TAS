### TAS System

#### Prerequisites

* Install [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html) and [Redis](https://redis.io/topics/quickstart) on your machines

#### Initialise the db

* Start Elasticsearch and Redis Server
* git clone https://gitlab.com/varunendra.mishra/TAS.git
* cd `TAS`
* `npm install`
* Run `./database/crud-index development`
*cd ~/elasticsearch-5.5.3/bin
*
* redis-server
* Run `./database/create-system-admin`
* cd `admin`
* Run `bin/admin-server development` for development environment
#### Task Allocation
* Go to analytics folder `cd Analytics`
* create Logs dir `mkdir Logs`
* Install dependencies `sudo pip install -r requirements.txt`
* Run `python user_task_allocation.py`

#### Tasks Indexing
* Create data folder in the root directory `mkdir TAS/data`
* Create sub folders task allocation `mkdir task-allocation/new`
* Create sub folders task allocation `mkdir task-allocation/completed`
* Save the task allocation csv into the new folder Go to folder `cd batch-processes/index-tasks-to-es`
* Run task indexing `bin/index-tasks development` indexing tasks into elasticsearch

#### Deploy updated code to production
* `cd TAS`
* `git pull`


