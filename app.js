const express = require('express');
require("dotenv").config(); 
const connectDB = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const productModel= require("./model/stock");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RegisteredUser = require('./model/user');
const { authenticate, authorizeAdmin } = require("./middleware/auth");
const expenModel= require("./model/expenditure");
const Subscription = require('./model/Subscription');

const webpush = require('web-push');

const publicVapidKey = 'BBULwummH3X4WEhdMrEOoV4sxo0ew75IDNO4MYX2UOSDjqr6pToLNoZ-avme5F0Aq6lhrNnSzEqeZE5pTotc8bA';
const privateVapidKey = 'UL_bwXfi3UwdzPF8DhMeYBVcWtYynEFPg1Q6cS6Gu3Y';

webpush.setVapidDetails(
  'mailto:your@email.com',
  publicVapidKey,
  privateVapidKey
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
    let {pname,catagory,CurrentStock,limit,Sname}=req.body;

        await productModel.create({
        product:pname,
        catagory: catagory,
        curentStock: CurrentStock,
        minMaxStock: limit,
        supplier:Sname
    })
///////////////
    const payload = JSON.stringify({
    title: 'New Product Added',
    body: `Product "${pname}" was added, with stock of `
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
    /////////////
    const payload = JSON.stringify({
    title: 'New Product deleted',
    body: `Product was deleted.`
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



app.post("/add-stock/update",authenticate, async (req, res) => {
  try {
         const {productId,addQuantity}=req.body;
         const product = await productModel.findById(productId);
     if (!product) return res.status(404).send("Product not found");

     product.curentStock = parseInt(product.curentStock) + parseInt(addQuantity);
     await product.save();
    var aq=addQuantity;
    var pn=product.product;
   
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
   
  ///////
  const payload = JSON.stringify({
    title: `New stock added of ${pn}`,
    body: `stocks of  are added, Now total stock is ${aq} `
  });
   
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
  /////////
  res.redirect("/inventory");

});



app.post("/use-stock/update",authenticate, async (req, res) => {
   try {
          const {productIdUseStock,useQuantity}=req.body;
          const product = await productModel.findById(productIdUseStock);
      if (!product) return res.status(404).send("Product not found");

      product.curentStock = parseInt(product.curentStock) - parseInt(useQuantity);
      await product.save();

   
   } catch (err) {
     res.status(500).json({ error: "Update failed" });
   }
/////////
const payload = JSON.stringify({
    title: `New stock used of `,
    body: ` stocks are used. `
  });
  const subscriptions = await Subscription.find();
  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.error(err));
  });
//////////

  res.redirect("/inventory");

});



  
app.get("/expenditure",authenticate, async (req, res) => {
  try {
    const createdexpenses = await expenModel.find().sort({ lastUpdate: -1 });

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
      yearTotal: yearSum[0]?.total || 0
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
    lastUpdate:new Date,
    description,
    ResPerson,
    category,
   })
   
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


app.get("/login",(req,res)=>{
  res.render("LogIn",{error:null});
});

app.post("/login", async (req, res) => {
  const user = await RegisteredUser.findOne({ username: req.body.username });
  
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
   
  return res.render("LogIn",{error:"Invalid username or password"});


  const token = jwt.sign(
    { id:user._id, role: user.role,name:user.name },
    "Ambikesh@1234",
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
  res.render("Registration");
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



