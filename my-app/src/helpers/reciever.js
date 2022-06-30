import AWS from "aws-sdk"

AWS.config.update({
  'region': 'us-west-2',
  'secretAccessKey': process.env.REACT_APP_API_KEY_SECRET,
  'accessKeyId': process.env.REACT_APP_API_KEY
})
// ENDS HERE
const LATEST_ITEM = "LatestHash"
const CWAData = "CWAData"
const DEBUG = false
const GENERAL_ATTRIBUTES = ["Hash", "Year", "CommitDate"]
//@TODO: make this auto update
const N_METRIC = 2 //number of metrics
const N_TIMESTAMPS = 3 // number of timestamps per metric
//CALCULATED CONST
// 1 commit is # kb, so to make max 1MB batches our batches should be 
const ONE_MB = 1000 //KB
const BASE_PACKET_SIZE = 0.057 // KB per packet with no timstamp or metric
const TIMESTAMP_SIZE = 0.026 // KB per timestamp
const METRIC_SIZE = 0.154 //KB per metric with no timestamps
const PACKET_SIZE = (BASE_PACKET_SIZE + N_METRIC * (METRIC_SIZE + N_TIMESTAMPS * TIMESTAMP_SIZE))
const BATCH_SIZE = parseInt(ONE_MB / PACKET_SIZE)
//------------------------
class Receiver {
  constructor(DataBaseName) {
    this.cacheClear()
    this.dyanamoClient = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    this.DataBaseName = DataBaseName
    this.CWAData = null
    this.latestItem = null
    let cacheLatestItem = this.cacheGetLatestItem()
    if (cacheLatestItem != undefined) {
      this.CWAData = this.cacheGetAllData()
      this.latestItem = cacheLatestItem
    }
  }

  //update
  async update() {
    console.log("updating")
    // check the latest hash from cache
    let dynamoLatestItem = (await this.getLatestItem())
    let DynamoHash = dynamoLatestItem["Hash"]
    // ask dynamo what is the lastest hash it received 
    let cacheLatestItem = this.cacheGetLatestItem()//["Hash"].S //rename to lastest hash
    let cacheLatestHash = ""
    if (cacheLatestItem == undefined) {
      console.log("NO cache found")
      // no cache found, pull every thing and set
      this.CWAData = await this.getAllItems()
      console.log(this.CWAData)

      this.latestItem = dynamoLatestItem
      this.cacheSaveData()
      return
    } else {
      cacheLatestHash = cacheLatestItem["Hash"]
      this.CWAData = this.cacheGetAllData()
    }
    if (DynamoHash == cacheLatestHash) {
      console.log("synced") // synced up
    } else if (parseInt(dynamoLatestItem["CommitDate"]) >= parseInt(cacheLatestItem["CommitDate"])) {
      /// if hashes dont match call getBatchItem with local hash and update local hash with new data
      console.log("not synced")
      var newItems = await this.getBatchItem(cacheLatestItem["CommitDate"], dynamoLatestItem["CommitDate"])
      console.log(this.CWAData, newItems)
      this.CWAData.push.apply(this.CWAData, newItems)
      this.latestItem = newItems[newItems.length - 1]
      // console.log(this.latestItem)
      this.cacheSaveData()
    }

  }

  //get latest item
  async getLatestItem() {
    //add secondary index 
    const params = {
      // Set the projection expression, which are the attributes that you want.
      TableName: this.DataBaseName,
      Limit: 1,
      KeyConditions: {
        "Year": {
          ComparisonOperator: "EQ",
          AttributeValueList: [{ N: "2022" }]
        }
      },
      ScanIndexForward: false,

    };
    var retData = (await this.dyanamoClient.query(params).promise())
    if (DEBUG) {
      console.log(`getLatestItem: Item: ${retData.Items[0]["Hash"]["S"]}, Count: ${retData.Count}, ScannedCount:${retData.ScannedCount}`)
    }
    var cleanData = AWS.DynamoDB.Converter.unmarshall(retData.Items[0])
    return cleanData
    // return this.latestItem
  }
  // get all
  async getAllItems() {
    const params = {
      // Set the projection expression, which are the attributes that you want.
      TableName: this.DataBaseName,
      KeyConditions: {
        "Year": {
          ComparisonOperator: "EQ",
          AttributeValueList: [{ N: "2022" }]
        }
      },

    };
    var retData = (await this.dyanamoClient.query(params).promise())
    if (DEBUG) {
      console.log(`getAllItem: Item: ${retData.Items}, Count: ${retData.Count}, ScannedCount:${retData.ScannedCount}`)
    }
    var cleanData = this.formatData(retData.Items)
    return cleanData
  }
  // get a batch of items
  /*
  lastHash : the last hash i have cached
  */
  async getBatchItem(cacheHashDate, dynamoHashDate) {
    console.log("Getting batch item", cacheHashDate, dynamoHashDate, cacheHashDate < dynamoHashDate)
    // will use scan because getBatchItem requires me to know both hash and 
    var params = {
      TableName: this.DataBaseName,
      KeyConditions: {
        "Year": {
          ComparisonOperator: "EQ",
          AttributeValueList: [{ N: "2022" }]
        },
        "CommitDate": {
          ComparisonOperator: "BETWEEN",
          AttributeValueList: [
            { "N": cacheHashDate },
            { "N": dynamoHashDate }
          ]
        }
      },

    }
    // var dateDiff= dynamoHashDate - cacheHashDate //date works because each hash has a distinct dat
    var retData = []
    var dynamoHashDateInt = parseInt(dynamoHashDate)
    var cacheHashDateInt = parseInt(cacheHashDate)
    var upperBound = 0
    var i = 0;
    console.log(BATCH_SIZE)
    // var packet =  (await  this.dyanamoClient.query(params).promise()).Items
    while (upperBound < dynamoHashDateInt) { //get data in 1mb packets
      var lowerBound = cacheHashDateInt + (i * BATCH_SIZE)
      upperBound = cacheHashDateInt + (i + 1) * (BATCH_SIZE)
      params.KeyConditions.CommitDate.AttributeValueList[0].N = lowerBound.toString()//0 idx is start, 1 is end
      params.KeyConditions.CommitDate.AttributeValueList[1].N = upperBound.toString()
      var packet = (await this.dyanamoClient.query(params).promise()).Items
      if (DEBUG) {
        console.log(`Running Batch: (${lowerBound}->${upperBound}): Size:${retData}, ${packet}`)
      }
      retData = retData.concat(packet)
      i++
    }
    var cleanData = this.formatData(retData)
    return cleanData
  }
  formatData(data) {
    //@TODO make this more efficient
    //assume it is a list
    var formattedData = {}
    data.forEach((item) => {
      var cleanData = AWS.DynamoDB.Converter.unmarshall(item)
      Object.keys(cleanData).forEach((attribute) => {
        if (GENERAL_ATTRIBUTES.includes(attribute)) {
          return //ignore
        }
        if(formattedData[attribute] == undefined){
          formattedData[attribute] = []
        }
        var newStructure = cleanData[attribute]
        GENERAL_ATTRIBUTES.forEach((generalAttribute)=>{
          newStructure[generalAttribute] = cleanData[generalAttribute]
        })
        formattedData[attribute].push(newStructure)
        
      })
      return
    })
    // console.log("Formmated Data:",formattedData)
    return formattedData

  }
  cacheClear() {
    localStorage.clear()
  }
  cacheGetAllData() {
    return JSON.parse(localStorage.getItem(CWAData))
  }
  cacheGetLatestItem() {
    return JSON.parse(localStorage.getItem(LATEST_ITEM))
  }
  cacheSaveData() {
    localStorage.setItem(LATEST_ITEM, JSON.stringify(this.latestItem))
    localStorage.setItem(CWAData, JSON.stringify(this.CWAData))

    if (DEBUG) {
      console.log(` CACHE SAVE DATA: \n Latest: ${this.cacheGetLatestItem()}
        \nALL: ${localStorage.getItem(CWAData).length}
        
        `)
    }
  }
}


export default Receiver


