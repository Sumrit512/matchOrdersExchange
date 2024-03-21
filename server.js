
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://sumrit:sumrit@cluster0.srpwvbq.mongodb.net/cex")
.then(() => console.log('connection successful'))
.catch((e) => console.log(e))

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

// const io = require("socket.io")(3006,
//      {
//     cors: {
//         origin : '*',
//         methods: ["GET", "POST"]
//     }
// }
// )





// io.use((socket, next) => {
//     const origin = socket.request.headers.origin;
//     console.log(`Connection attempt from origin: ${origin}`);
//     next(); // Allow the connection to proceed
//   });

const express = require("express");
const app = express()
const {createServer} = require("http")
const server = createServer(app);
const {Server} = require("socket.io")

const helmet = require("helmet");
const cors = require("cors");

const io = new Server(server, 
    // cors: {
    //   origin: `http://localhost:3001`
    // },
    { 
        cors:
        { 
            origin:['http://localhost:3001', "https://www.unicentralized.live/", "https://unicentralized.live/", "http://www.unicentralized.live/", "https://www.unicentralized.live", "http://www.unicentralized.live"],
         methods: ['GET','POST'], 
         credentials: true, 
         allowEIO3: true ,
         handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
              "Access-Control-Allow-Origin":['http://localhost:3001', "https://www.unicentralized.live/", "https://unicentralized.live/", "http://www.unicentralized.live/", "https://www.unicentralized.live", "http://www.unicentralized.live"],
              "Access-Control-Allow-Methods": "GET,POST",
              "Access-Control-Allow-Credentials": true
            });
            res.end();
          }
         
        }, 
         transport: ['websocket'] 
        ,
        
        }
);

app.get('/getDomain', async(req, res) => {
    try{
    
      
      console.log(req)
 
   
    
      return res.status(200).json(req.rawHeaders).end()
    } catch(e) {
      console.log(e)
      return res.status(500).end()
    }
  })



// id: "2",
// label: "trxusdt@ticker",
// createdAt: 'saddadsa',
// price: '56',
// change: '-9',
// volume: '46545',
// symbol: "TRX",
// name: "TRON",
// src: "/images/CryptoLogos/tron.png",
// link: "/TRX_USDT"


// A: "184.40000000"
// B: "208.22200000"
// C: 1709215346829
// E: 1709215346830
// F: 713859744
// L: 714580066
// O: 1709128946829
// P: "-0.992"
// Q: "4.74700000"
// a: "409.40000000"
// b: "409.30000000"
// c: "409.40000000"
// e: "24hrTicker"
// h: "427.30000000"
// l: "400.00000000"
// n: 720323
// o: "413.50000000"
// p: "-4.10000000"
// q: "619474647.08220000"
// s: "BNBUSDT"
// v: "1502422.91300000"
// w: "412.31709243"
// x:"413.50000000"

const tokenDataSchema = new mongoose.Schema({
    C: {   // previous timestamp
      type: Number,
      require: false
    },
    E: { // current timestamp
      type: Number,
      require: false,
    },
    P: { // percent change
      type: String,
      require: false
    },
    e:{
      type: String,
      default: "24hrTicker"
    },
    s:{ // trade symbol
      type: String,
      require: false
    },
    q:{ // 24hr volume usdt
      type: String,
      require: false
    },
    v:{ // 24hr current volume
      type: String,
      require: false
    },
    h:{ // 24hr high
      type: String,
      require: false
        },
    l:{ // 24hr low
      type: String,
      require: false
    },
    p:{ // change in usd
      type: String,
      require: false
    },
    o:{ // open price
      type: String,
      require: false
    },
    w : { // closing price
      type : String,
      require : false
    }, 
    x : { // current price
      type : String,
      require : false
    }, 
    t : { // total volume
        type: String,
        require : false
    },
    label : {
        type: String,
        require : false
    },
    c: { // current price
        type: String,
        require : false
    }
  })

  
  const tokenData = new mongoose.model("tokenData", tokenDataSchema)


app.use(cors());
app.use(express.json())

app.post('/insert', async(req, res) => {
    try{
    
      const bodyData = await req.body;
    
      const data2 = await tokenData.insertMany([bodyData])
   
    
      return res.status(200).json("done").end()
    } catch(e) {
      console.log(e)
      return res.status(500).end()
    }
  })

  const updateAll = async () => {
   try {
     const allTokens = await prisma.tokens.findMany()

     const updateTokens = allTokens?.map(async (token) => {
        const updating = await prisma.tokens.update({
            where: {
              id :   token.id
            },
            data : {
                priceUrl: "set",
                withdrawable: true,
                depositable: true,
                type: "coin",
                blockchain: "set",
                balanceUrl: "set"
            }
        })
     })
   } catch(e) {
    console.log(e)
   }
  }
 
  app.get('/order', async(req,res) => {
    try {
      //  console.log(req)
      //  const allUsers = await prisma.order.findMany()
        
        updateAll()
    // const datbase = await orderData.find({})
    return res.status(200).json("hit").end()
    } catch(e) {
        console.log(e)
        return res.status(500)
    }
  })

io.on("connection", async (socket) => {
    
    console.log("a user connected")
    console.log(socket.request.headers.origin)
    socket.on("message", (message) => {
        console.log(message)
        io.emit("message", message)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
    const allToken = await tokenData.find({})
   
        
   allToken?.map((token) => {
    setInterval(() => {
        
        io.emit(`message:${token.label}`, token); // Customize event name and data
      }, 1000); // 1000 milliseconds = 1 second
   })


})

// console.log("hello")

const cron = require('node-cron');



const cryptoList = {
    bnb: "bnb"
}

const matchOrder = async () => {
    try{
        // console.log("initialzed")
      const allOrder = await prisma.order.findMany({
        where: {
            isCompleted : false,
            status: {
                in: ["pending", "partiallyFilled"]
            }
        }
      })

     

      let buyOrder = allOrder?.filter((order) => order.type === "buy")

      let sellOrder = allOrder?.filter((order) => order.type === "sell")

      let tradeBook = []

     

        let newBuyOrders = buyOrder.sort((a, b) => Number(b.quantity) - Number(a.quantity))
        let newSellorders = sellOrder.sort((a, b) => Number(b.quantity) - Number(a.quantity))
       
        let sellerLength = newSellorders.length
   

      for(let j=0; j<newBuyOrders.length; j++, sellerLength){
        let i =0;
        let currentTradingSymbolFirst = newBuyOrders[j].tradeSymbolFirst
        let currentTradingSymbolSecond = newBuyOrders[j].tradeSymbolSecond
        
        let newSellOrdersTemp = newSellorders.filter((order) => ((currentTradingSymbolFirst === order.tradeSymbolFirst) && (currentTradingSymbolSecond === order.tradeSymbolSecond)))
       
        // console.log(newSellOrdersTemp)
      
        
            while(i<newSellOrdersTemp.length){
               
                let bestBuyOrder = newBuyOrders[j]
                let bestSellOrder = newSellOrdersTemp[i]
             //  console.log("i am here" ,bestBuyOrder, bestSellOrder)
          if((Number(bestSellOrder.quantity) > 0) && (Number(bestBuyOrder.quantity) > 0)) {
            if(bestBuyOrder.userId !== bestSellOrder.userId){
                if(Number(bestBuyOrder.price) >= Number(bestSellOrder.price)){
                    
                    const tradeQuantity = Math.min(Number(bestBuyOrder.quantity), Number(bestSellOrder.quantity))
            
                    bestBuyOrder.quantity = ( Number(bestBuyOrder.quantity) - tradeQuantity).toString()
                     bestSellOrder.quantity = ( Number(bestSellOrder.quantity) - tradeQuantity).toString()
               
                    let trade 
                    if(tradeQuantity > 0)
                    trade = {
                        buyer: bestBuyOrder.userId,
                        seller: bestSellOrder.userId,
                        price: bestBuyOrder.price,
                        quantity: tradeQuantity
                    }

                   if(trade) {
                   
                  //   console.log('[ORDERS]',bestBuyOrder, bestSellOrder)
                    
          
                     const updateBuyOrder = await prisma.order.update({
                        where : {
                            id : bestBuyOrder.id,
                            type: "buy",
                            tradeSymbolFirst: bestBuyOrder.tradeSymbolFirst,
                            tradeSymbolSecond: bestBuyOrder.tradeSymbolSecond
                        },
                        data: { quantity: bestBuyOrder.quantity,  status: "partiallyFilled" }
                    })

                    const updateSellOrder = await prisma.order.update({
                      where : {
                        id: bestSellOrder.id,
                        type: "sell",
                        tradeSymbolFirst: bestBuyOrder.tradeSymbolFirst,
                        tradeSymbolSecond: bestBuyOrder.tradeSymbolSecond
                      }  ,
                      data: { quantity: bestSellOrder.quantity, status: "partiallyFilled"}
                    })

                    const fetchBuyerBalance = await prisma.spotWallet.findFirst({
                        where : {
                           userId: bestBuyOrder.userId,
                           symbol : bestBuyOrder.tradeSymbolFirst.toUpperCase()
                        }
                    })
                    const fetchSellerBalance = await prisma.spotWallet.findFirst({
                        where : {
                           userId: bestSellOrder.userId,
                           symbol : bestSellOrder.tradeSymbolSecond.toUpperCase()
                        }
                    })

                    console.log(fetchBuyerBalance.balance, fetchBuyerBalance.avgPrice, tradeQuantity, bestBuyOrder.price)

                    let buyerAvgPrice = ((Number(fetchBuyerBalance.balance) * Number(fetchBuyerBalance.avgPrice)) + (Number(tradeQuantity) + (Number(bestBuyOrder.price)))) / (Number(fetchBuyerBalance.balance) + Number(tradeQuantity))
                    buyerAvgPrice = buyerAvgPrice.toFixed(3)

                    console.log("total", buyerAvgPrice, i)

                    const updateBuyerBalance = await prisma.spotWallet.update({
                        where: {
                            userId: bestBuyOrder.userId,
                            id: fetchBuyerBalance.id
                        },
                        data: {
                            balance : (Number(fetchBuyerBalance?.balance) + Number(tradeQuantity)).toString(),
                            avgPrice : buyerAvgPrice
                            }
                    })

                    const updateSellerBalance = await prisma.spotWallet.update({
                        where: {
                            userId: bestSellOrder.userId,
                            id: fetchSellerBalance.id
                        },
                        data: {
                            balance : (Number(fetchSellerBalance?.balance) + (Number(tradeQuantity) * Number(bestBuyOrder.price))).toString()
                        }
                    })

                    }

                   
                    
                    

                    const tradeData = {
                        buyerId : bestBuyOrder.userId,
                        sellerId : bestSellOrder.userId,
                        price : bestBuyOrder.price,
                        value : (Number(bestBuyOrder.price) * Number(tradeQuantity)).toString(),
                        quantity : tradeQuantity.toString(),
                        tradeSymbolFirst : bestBuyOrder.tradeSymbolFirst,
                        tradeSymbolSecond : bestBuyOrder.tradeSymbolSecond,
                        status : "filled",
                        isCompleted : true
                    }
                    
                    const newTrade = await prisma.trades.create({
                    data: tradeData
                    }  )
                   console.log("[TRADE]")
                    // tradeBook.push(trade)
            
            
                    if(Number(bestBuyOrder.quantity) === 0){
                        const updateBuyOrderFinal = await prisma.order.update({
                            where : {
                                id: bestBuyOrder.id,
                                type: "buy",
                                tradeSymbolFirst: bestBuyOrder.tradeSymbolFirst,
                                tradeSymbolSecond: bestBuyOrder.tradeSymbolSecond
                            }  ,
                            data: { quantity: "0", isCompleted: true, status: "filled"}
                          })
                        newBuyOrders.shift()
                    }
            
                    if(Number(bestSellOrder.quantity) === 0) {
                        const updateSellOrderFinal = await prisma.order.update({
                            where : {
                                id: bestSellOrder.id,
                                type: "sell",
                                tradeSymbolFirst: bestBuyOrder.tradeSymbolFirst,
                                tradeSymbolSecond: bestBuyOrder.tradeSymbolSecond
                            }  ,
                            data: { quantity: "0", isCompleted: true, status: "filled"}
                          })
                        newSellorders.shift()
                    }
            
                }
            }
          }
                
                i++
            }
        

      
      }

     
        
   
      

//    console.log(" I am ")
    } catch(e){
        console.log(e)
    }
}

const buyOrders = [
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ7",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
        "value": "0.2133",
        "quantity": "0.01",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ8",
        "price": "214.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
       
        "quantity": "0.01",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ9",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
   
        "quantity": "5.001",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ10",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
        "quantity": "51",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ11",
        "price": "216.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
        "quantity": "0.001",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ12",
        "price": "214.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
        "quantity": "0.001",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ13",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "buy",
        "quantity": "1",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 

]
const sellOrders = [
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ0",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
        "value": "0.2133",
        "quantity": "0.01",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ1",
        "price": "214.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
       
        "quantity": "0.01",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ2",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
   
        "quantity": "4.001",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ3",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
        "quantity": "50",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ4",
        "price": "216.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
        "quantity": "0.001",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ5",
        "price": "214.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
        "quantity": "0.001",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 
    {
        "id": "6521170c618313cbf1c49d53",
        "userId": "user_2UhUNduDhz2i0uaVCoqKsfzsIZ6",
        "price": "213.300",
        "placedAt": "2023-10-07T08:30:04.960Z",
        "type": "sell",
        "quantity": "1",
        "tradeSymbolFirst": "bnb",
        "tradeSymbolSecond": "usdt",
        "status": "pending",
        "orderType": "market",
        "isCompleted": false
    }, 

]

const tradeBook = [

]

const matchOrderTest = () => {
  const newBuyOrders = buyOrders.sort((a, b) => Number(b.quantity) - Number(a.quantity))
  const newSellorders = sellOrders.sort((a, b) => Number(b.quantity) - Number(a.quantity))
let i =0;
while(newBuyOrders.length > 0 && newSellorders.length > 0){
    const bestBuyOrder = newBuyOrders[0]
    const bestSellOrder = newSellorders[0]

    if(Number(bestSellOrder.price) >= Number(bestBuyOrder.price)){
        const tradeQuantity = Math.min(Number(bestBuyOrder.quantity), Number(bestSellOrder.quantity))

        bestBuyOrder.quantity = ( Number(bestBuyOrder.quantity) - tradeQuantity).toString()
        bestSellOrder.quantity = ( Number(bestSellOrder.quantity) - tradeQuantity).toString()

        const trade = {
            buyer: bestBuyOrder.userId,
            seller: bestSellOrder.userId,
            price: bestBuyOrder.price,
            quantity: tradeQuantity
        }
        
     

        tradeBook.push(trade)


        if(Number(bestBuyOrder.quantity) === 0){
            newBuyOrders.shift()
        }

        if(Number(bestSellOrder.quantity) === 0) {
            newSellorders.shift()
        }

    }else{
        i++
        
    }
}

}
// matchOrder()

// Schedule the task to run every second
// cron.schedule('* * * * * *', task);
cron.schedule('* * * * * *', matchOrder);

server.listen(3006, () => {
    console.log(`server is listening`);
  });

