const express = require('express');
require("dotenv").config(); 
const connectDB = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const productModel= require("./model/stock");
const stockHistoryModel= require("./model/stock-history");
const addStockHistoryModel = require("./model/addStockHistory");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RegisteredUser = require('./model/user');
const { authenticate, authorizeAdmin } = require("./middleware/auth");
const expenModel= require("./model/expenditure");
const Subscription = require('./model/Subscription');
const teamModel =require("./model/team")
const paymentModel =require("./model/payment")
const installationModel =require("./model/installation-hist");
const incomeModel =require("./model/income");



const webpush = require('web-push');



webpush.setVapidDetails(
  'mailto:your@email.com',
 process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

connectDB();

const bodyParser = require('body-parser');
app.use(bodyParser.json());



const path = require('path');
app.use(cookieParser());

app.set("view engine", "ejs")
app.use(express.json());


app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'Public')))


app.get("/", function(req,res){
    res.render("index");
});

app.get("/dashboard",authenticate, function(req,res){
    res.render("Dashboard",{user:req.user});
});


app.get("/inventory",authenticate,async function(req,res){
    const createdproducts = await productModel.find();
    res.render("inventory",{products:createdproducts,user:req.user});
});

app.post("/create",authenticate, async function(req,res){
    let {pname,catagory,CurrentStock,Sname,dateIn}=req.body;

        await productModel.create({
        product:pname,
        lastUpdate:dateIn,
        catagory: catagory,
        curentStock: CurrentStock,
        supplier:Sname
    })
///////////////
    const payload = JSON.stringify({
    title: 'New Product Added',
    body: `Product "${pname}" was added, with stock of ${CurrentStock} supplied by ${Sname}`
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  ///////////////
    res.redirect("/inventory")

 });







app.post("/delete/:id",authenticate,authorizeAdmin, async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct=await productModel.findByIdAndDelete(productId);
    res.redirect("/inventory"); 
   

  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});



app.post("/add-stock/update",authenticate, async (req, res) => {
  try {
         const {productId,addQuantity,addProductName,addDate,note}=req.body;
         
         
           let vt=await addStockHistoryModel.create({
    productName:addProductName,
    productId,
    lastUpdate:addDate,
    numberOfStock:addQuantity,
    reference: note,
   })

           

         const product = await productModel.findById(productId);
     if (!product) return res.status(404).send("Product not found");

     product.curentStock = parseInt(product.curentStock) + parseInt(addQuantity);
     await product.save();
    var aq=addQuantity;
    var pn=product.product;
    var cs =product.curentStock
    var addD=addDate
    var nt=note
   
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
  ///////
  const payload = JSON.stringify({
    title: `${aq} new stocks are added into ${pn}`,
    body: `On ${addD} amount of ${aq} stocks are added to ${pn} now current stocks in ${pn} are ${cs} and other details: ${nt}`
  });
   
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  /////////
  res.redirect("/inventory");

});






 app.get("/addstock-history/:productId",authenticate,async function(req,res){

     const productId1 = req.params.productId;
     
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const startDate = req.query.start ? new Date(req.query.start) : null;
  const endDate = req.query.end ? new Date(req.query.end) : null;

  const query = { productId:productId1 };

  if (startDate && endDate) {
    query.lastUpdate = { $gte: startDate, $lte: endDate };
  }

  try {
    const total = await addStockHistoryModel.countDocuments(query);

    const addStockHistory = await addStockHistoryModel.find(query)
      .sort({ lastUpdate: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.render("addstockHistory", {
      addstocks: addStockHistory,
      user: req.user,
      productId1,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      startDate: req.query.start || '',
      endDate: req.query.end || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching payment history");
  }
    
});




app.post("/use-stock/update",authenticate, async (req, res) => {
   try {
          const {productIdUseStock,useQuantity,productName,date,note}=req.body;

           let lt=await stockHistoryModel.create({
    productName,
    productId:productIdUseStock,
    lastUpdate:date,
    numberOfStock:useQuantity,
    reference: note,
   })




          const product = await productModel.findById(productIdUseStock);
      if (!product) return res.status(404).send("Product not found");

      product.curentStock = parseInt(product.curentStock) - parseInt(useQuantity);
      await product.save();

      var uq =useQuantity
      var pn = productName
      var dt = date
      var nte = note

   
   } catch (err) {
     res.status(500).json({ error: "Update failed" });
   }


/////////
const payload = JSON.stringify({
    title: `${uq} stocks are used from ${pn} `,
    body: ` Amount of ${uq} are used on ${dt} from ${pn} additional notes are: ${nte} `
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
//////////

  res.redirect("/inventory");

});





 app.get("/stock-history/:productId",authenticate,async function(req,res){

     const productId = req.params.productId;
     
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const startDate = req.query.start ? new Date(req.query.start) : null;
  const endDate = req.query.end ? new Date(req.query.end) : null;

  const query = { productId };

  if (startDate && endDate) {
    query.lastUpdate = { $gte: startDate, $lte: endDate };
  }

  try {
    const total = await stockHistoryModel.countDocuments(query);

    const teamStockHistory = await stockHistoryModel.find(query)
      .sort({ lastUpdate: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.render("stockHistory", {
      stocks: teamStockHistory,
      user: req.user,
      productId,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      startDate: req.query.start || '',
      endDate: req.query.end || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching payment history");
  }
    
});




  
app.get("/expenditure",authenticate, async (req, res) => {
  try {
   // const createdexpenses = await expenModel.find().sort({ lastUpdate: -1 });

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const startDate = req.query.start ? new Date(req.query.start) : null;
  const endDate = req.query.end ? new Date(req.query.end) : null;

  const query = {};

  // Only apply date filter if user submitted it
  if (startDate && endDate) {
    query.lastUpdate = { $gte: startDate, $lte: endDate };
  }


    const total = await expenModel.countDocuments(query);
    const createdexpenses = await expenModel.find(query)
      .sort({ lastUpdate: -1 }) // show most recent first
      .skip(skip)
      .limit(limit);





    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60000;

    const nowIST = new Date(now.getTime() + IST_OFFSET);

    // Start of today (IST → UTC)
    const startOfDayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
    const startOfDayUTC = new Date(startOfDayIST.getTime() - IST_OFFSET);

    // Start of week (7 days including today)
    const startOfWeekIST = new Date(startOfDayIST);
    startOfWeekIST.setDate(startOfWeekIST.getDate() - 6);
    const startOfWeekUTC = new Date(startOfWeekIST.getTime() - IST_OFFSET);

    // Start of year
    const startOfYearIST = new Date(nowIST.getFullYear(), 0, 1);
    const startOfYearUTC = new Date(startOfYearIST.getTime() - IST_OFFSET);

    // Aggregations
    const [todaySum, weekSum, yearSum] = await Promise.all([
      expenModel.aggregate([
        { $match: { lastUpdate: { $gte: startOfDayUTC } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      expenModel.aggregate([
        { $match: { lastUpdate: { $gte: startOfWeekUTC } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      expenModel.aggregate([
        { $match: { lastUpdate: { $gte: startOfYearUTC } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    res.render("Expenditure", {
      expenses:createdexpenses,
      user:req.user,
      todayTotal: todaySum[0]?.total || 0,
      weekTotal: weekSum[0]?.total || 0,
      yearTotal: yearSum[0]?.total || 0,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      startDate: req.query.start || '',
      endDate: req.query.end || ''
    });
  } catch (error) {
    console.error("Error loading expenditures:", error);
    res.status(500).send("Something went wrong");
  }
});


 app.post("/add-expenditure",authenticate, async function(req,res){
    let {amount,lastUpdate,category,ResPerson,description}=req.body;

    await expenModel.create({
    amount,
    lastUpdate,
    description,
    ResPerson,
    category,
   })

   ///////////////
    const payload = JSON.stringify({
    title: `New ₹${amount} Expense added `,
    body: `Amount of ₹${amount} are spent for ${category} on ${lastUpdate} ,responsible person ${ResPerson}...other details: ${description} `
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  ///////////////
   
    res.redirect("/expenditure");

 });


 app.post("/deleteExpense/:id",authenticate,authorizeAdmin, async (req, res) => {
  const expenseId = req.params.id;

  try {
    await expenModel.findByIdAndDelete(expenseId);
    res.redirect("/expenditure"); // Refresh the page with updated data
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});


app.get("/income",authenticate, async (req, res) => {
  try {
   // const createdexpenses = await expenModel.find().sort({ lastUpdate: -1 });

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const startDate = req.query.start ? new Date(req.query.start) : null;
  const endDate = req.query.end ? new Date(req.query.end) : null;

  const query = {};

  // Only apply date filter if user submitted it
  if (startDate && endDate) {
    query.lastUpdate = { $gte: startDate, $lte: endDate };
  }


    const total = await incomeModel.countDocuments(query);
    const createdincome = await incomeModel.find(query)
      .sort({ lastUpdate: -1 }) // show most recent first
      .skip(skip)
      .limit(limit);

    res.render("income", {
      incomes:createdincome,
      user:req.user,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      startDate: req.query.start || '',
      endDate: req.query.end || ''
    });
  } catch (error) {
    console.error("Error loading expenditures:", error);
    res.status(500).send("Something went wrong");
  }
});


 app.post("/add-income",authenticate, async function(req,res){
    let {amount,lastUpdate,paymentType,remark}=req.body;

    let it= await incomeModel.create({
    amount,
    lastUpdate,
    remark,
    paymentType
   })

   ///////////////
    const payload = JSON.stringify({
    // title: `New ₹${amount} Income added `,
    // body: `Amount of ₹${amount} are added in income on ${lastUpdate}...other details: ${remark} `
    title: `Income Feature added Succesfully`,
    body: `Income feature added by Ambikesh Verma Succesfully checkOut for use`
  });
   const subscriptions = await Subscription.find();
  subscriptions.forEach( async sub => {
   webpush.sendNotification(sub, payload)
  .then(response => {
    console.log("Notification sent successfully");
  })
  .catch(async err => {
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log("Subscription is expired or no longer valid. Removing...");
       await Subscription.deleteOne({ endpoint: sub.endpoint });
      // remove subscription from DB using subscription.endpoint
    } else {
      console.error("Push error:", err);
    }
  });
  });
  ///////////////
  
   
    res.redirect("/income");

 });


  app.post("/deleteincome/:id",authenticate,authorizeAdmin, async (req, res) => {
  const incomeId = req.params.id;

  try {
    await incomeModel.findByIdAndDelete(incomeId);
    res.redirect("/income"); // Refresh the page with updated data
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});



app.get("/labour",authenticate,async function(req,res){
    const createdTeam = await teamModel.find();
    res.render("teams",{teams:createdTeam,user:req.user});
});




app.post("/add-team",authenticate, async function(req,res){
    let {teamName,totalInstallation,amount,balance}=req.body;

    await teamModel.create({
   teamName,
   totalInstallation,
   amount,
   balance
   })

    ///////////////
    const payload = JSON.stringify({
    title: `New team added ${teamName}`,
    body: `${teamName} have ${totalInstallation} total installation and total amount of ₹${amount} already paid Symtrack`
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  ///////////////
   
    res.redirect("/labour");

 });


 app.post("/deleteteam/:teamid",authenticate,authorizeAdmin, async (req, res) => {
  const teamId = req.params.teamid;

  try {
    const deletedteam=await teamModel.findByIdAndDelete(teamId);
    res.redirect("/labour"); 
    /////////////
    const payload = JSON.stringify({
    title: 'New team deleted',
    body: `Team was deleted.`
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
////////////

  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});





 app.post("/add-payment",authenticate, async function(req,res){
    let {teamName,addPayment,reference,teamIdPay,dateP}=req.body;

    let pt=await paymentModel.create({
      teamName,
      lastUpdate:dateP,
      reference,
      amount:addPayment
   })

   const result = await teamModel.findById(teamIdPay);
   result.balance = parseInt(result.balance) - parseInt(addPayment);
   await result.save();

     ///////////////
    const payload = JSON.stringify({
    title: `₹${addPayment} paid to ${teamName}`,
    body: `Amount of ₹${addPayment} are paid to ${teamName} on ${dateP} Reference: ${reference}`
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  ///////////////


    res.redirect("/labour");

 });


 app.get("/payment-history/:teamName",authenticate,async function(req,res){

     const teamName = req.params.teamName;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const startDate = req.query.start ? new Date(req.query.start) : null;
  const endDate = req.query.end ? new Date(req.query.end) : null;

  const query = { teamName };

  if (startDate && endDate) {
    query.lastUpdate = { $gte: startDate, $lte: endDate };
  }

  try {
    const total = await paymentModel.countDocuments(query);

    const teamPaymentHistory = await paymentModel.find(query)
      .sort({ lastUpdate: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.render("payment", {
      payments: teamPaymentHistory,
      user: req.user,
      teamName,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      startDate: req.query.start || '',
      endDate: req.query.end || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching payment history");
  }
    
});


app.post("/add-installation",authenticate, async function(req,res){
    let {teamName,installationNum,rate,brand,address,reference,teamId,dateI}=req.body;

    let ct=await installationModel.create({
      teamName,
   brand,
   address,
   reference,
   lastUpdate:dateI
   })


   const findTeam= await teamModel.findById(teamId)
    findTeam.totalInstallation = parseInt(findTeam.totalInstallation) + parseInt(installationNum);
    findTeam.amount = parseInt(findTeam.amount) + (parseInt(installationNum)*parseInt(rate));
    findTeam.balance = parseInt(findTeam.balance) + (parseInt(installationNum)*parseInt(rate));
      await findTeam.save();

        ///////////////
    const payload = JSON.stringify({
    title: `${installationNum} new installation added to ${teamName}`,
    body: `${brand} setup added by team ${teamName} at ${address} at ${dateI} on rate of ${rate} reference: ${reference}`
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  ///////////////
   


    res.redirect("/labour");
    
 });



 app.get("/installation-history/:teamName",authenticate,async function(req,res){

     const teamName = req.params.teamName;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const startDate = req.query.start ? new Date(req.query.start) : null;
  const endDate = req.query.end ? new Date(req.query.end) : null;

  const query = { teamName };

  if (startDate && endDate) {
    query.lastUpdate = { $gte: startDate, $lte: endDate };
  }

  try {
    const total = await installationModel.countDocuments(query);

    const teamInstallationHistory = await installationModel.find(query)
      .sort({ lastUpdate: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.render("installation", {
      installations: teamInstallationHistory,
      user: req.user,
      teamName,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      startDate: req.query.start || '',
      endDate: req.query.end || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching payment history");
  }
    
});



app.get("/login",(req,res)=>{
  res.render("LogIn",{error:null});
});

app.post("/login", async (req, res) => {
  const user = await RegisteredUser.findOne({ username: req.body.username });
  
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
   
  return res.render("LogIn",{error:"Invalid username or password"});


  const token = jwt.sign(
    { id:user._id, role: user.role,name:user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token);
  res.redirect("/dashboard");
});


app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});



app.get("/registration",(req,res)=>{
  //res.render("Registration")
  res.send("Something Went wrong")
});

app.post("/register", async (req, res) => {
  let {name,email,role,password}=req.body;
    await RegisteredUser.create({
    name:name,
    username:email,
    password:password,
    role:role
  })
  res.redirect("/login");
});


app.post('/subscribe', async (req, res) => {
  const subscription = req.body;

  // Check if subscription already exists
  const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
  if (!exists) {
    await Subscription.create(subscription);
  }

  res.status(201).json({});
  console.log('Subscription saved to database.');
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);


});



