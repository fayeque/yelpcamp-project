var express          = require("express"),
	PORT			= process.env.PORT||3000,
    app              = express(),
	twilio 			=  require('twilio')('AC7e437fe931c5e34834df385ac5c4a12c','ee8573663dde1b468be4990959f4d122'),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
	User			 = require("./models/user"),
	Shopkeeper		= require("./models/shopkeeper"),
	Notification	= require("./models/notification"),
	Usernotification	= require("./models/usernotification"),
	Product			 = require("./models/product"),
	request			=require("request");

const cheerio = require('cheerio');
// mongoose.connect("mongodb://localhost/local_market",  {useNewUrlParser: true});
mongoose.connect("mongodb+srv://localmkt:Fayeque123@cluster0-wl1fk.mongodb.net/test?retryWrites=true&w=majority",  {useNewUrlParser: true});
// mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex',true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Once again Rusty wins horriest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('user',new LocalStrategy(User.authenticate()));
passport.use('shopkeeper',new LocalStrategy(Shopkeeper.authenticate()));
// passport.authenticate('user')(req,res,function(){
// 	res.redirect('/front');
// });
// passport.authenticate('shopkeeper')(req,res,function(){
// 	res.redirect('/shopkeeperfront');
// });

passport.serializeUser(function(user,done){
	done(null,user);
});
passport.deserializeUser(function(user,done){
	if(user!=null){
	done(null,user);
	}
});

// passport.serializeUser(Shopkeeper.serializeUser());
// passport.deserializeUser(Shopkeeper.deserializeUser());



// app.use(express.static(__dirname + "/public"))
// app.set("view engine","ejs");
app.use(async function(req,res,next){
	res.locals.currentShopkeeper = req.user;
	res.locals.currentUser = req.user;
	  // if(req.user) {
	  // try {
	  // let shopkeeper = await Shopkeeper.find({}).populate('notifications', null, { isRead: false }).exec();
	  // res.locals.notifications = Shopkeeper.notifications.reverse();
	  // } catch(err) {
	  // console.log(err.message);
	  // }
	  // }
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//routes
app.get("/",function(req,res){
	// Product.create({product_name:'Vu',product_price:4999},function(err,created){
	// 	if(err)
	// 		{
	// 			console.log(err)
	// 		}
	// 	else
	// 		{
	// 			console.log(created);
	// 		}
	// })
	if(req.user){
		User.findById(req.user._id,function(err,found){
			if(err){
				console.log(err);
			}
			else
				{
					res.render("front",{notification:found.notifications});
				}
		})
	}
	else
		{
	res.render("front");
		}
	
});
app.post("/twilio",function(req,res){
	twilio.messages.create({
	to: '+91 70312 55039',
	from: '+18134341159',
    body: 'This is the ship'
   },function(err,data){
		if(err)
		console.log(err);
		console.log(data);
		res.send("/");
			
	})
  // .then(message => console.log(message.sid));
})
app.get("/shopkeeper",function(req,res){
	// Product.create({product_name:'Vu',product_price:4999},function(err,created){
	// 	if(err)
	// 		{
	// 			console.log(err)
	// 		}
	// 	else
	// 		{
	// 			console.log(created);
	// 		}
	// })
			res.render("shopkeeper");
	
	
	
});
//signup routes
app.get("/register",function(req,res){
	res.render("register0.ejs",{message:req.flash("signup")});
})
app.get("/userregister",function(req,res){
	res.render("register.ejs");
});
app.get("/shopkeeperregister",function(req,res){
	res.render("shopkeeperregister.ejs");
})
app.post("/register",function(req,res){
	// var newUser=new User({username:req.body.username,mobile:req.body.mobile,email:req.body.email});
	var newUser=new User({username:req.body.username,name:req.body.name,email:req.body.email});
	// var userName=new User();
	// console.log(newUser);
	// console.log(User.findOne({username:"ronit"}).mobile);
	User.register(newUser,req.body.password,function(err,user){
	 	if(err)
			{
				console.log(err);
				req.flash("error",err.message);
				res.redirect("/register");
	 		}
	 	passport.authenticate("user")(req,res,function(){
			req.flash("success","Successfully registered and logged in");
	 		// res.redirect("/");
					Shopkeeper.find({},function(err,allSk){
			if(err)
				{
					console.log(err);
				}
			else
				{
					allSk.forEach(function(allsks){
						console.log(allsks._id);
						user.followers.push(allsks._id);
						console.log(user);
					})
					
					user.save();
					res.redirect("/");
				}
		});
	 	});
		// console.log(req.user);

	 });
	});
app.post("/shopkeeperregister",function(req,res){
	// var newUser=new User({username:req.body.username,mobile:req.body.mobile,email:req.body.email});
	var newUser=new Shopkeeper({username:req.body.username,name:req.body.name,email:req.body.email});
	// var userName=new User();
	// console.log(newUser);
	// console.log(User.findOne({username:"ronit"}).mobile);
	Shopkeeper.register(newUser,req.body.password,function(err,user){
	 	if(err)
			{
				console.log(err);
				req.flash("error",err.message);
				res.redirect("/register");
	 		}
	 	passport.authenticate("shopkeeper")(req,res,function(){
			// console.log(err.message);
			// req.flash("success","Successfully registered and logged in");
			console.log(req.user);
	 		res.redirect("/shopkeeperloggedin");
	 	});
	 });
	});
app.get("/login",function(req,res){
	res.render("login0.ejs");
})
app.get("/userlogin",function(req,res){
	res.render("loginform")
})
app.get("/shopkeeperlogin",function(req,res){
	res.render("shopkeeperlogin.ejs");
})
app.get("/error",function(req,res){
	req.flash("error","Mobile no. or password is incorrect")
		res.redirect("/login");
});
app.post("/login",passport.authenticate("user",
	{
		
		 successRedirect:"/",
	// req.flash("success","successfully logged in");
		failureRedirect:"/error"
	}),function(req,res){
});
app.get("/shopkeeperloggedin",function(req,res){
	Shopkeeper.findById(req.user._id,function(err,foundsh){
		if(err){
			console.log(err);
		}
		else
			{
				res.render("shopkeeper",{notifications:foundsh.notifications});
			}
	})
})
app.post("/shopkeeperlogin",passport.authenticate("shopkeeper",
	{
		
		 successRedirect:"/shopkeeperloggedin",
	// req.flash("success","successfully logged in");
		failureRedirect:"/shopkeeperlogin"
	}),function(req,res){
});




app.get("/search",function(req,res){
	var url=req.query.search;
		var n=url.search(/http/i)
		console.log(n);
	url=url.slice(n);
	var usernotificationid="";
	// url=url.replace(/\w{5}/,"");
		// console.log(regex);
	console.log(url);
	request(url,function(err,response,html){
		const $ = cheerio.load(html);
		const pr_name=$("._35KyD6");
		const pr_name_text=pr_name.text();
		const pr_price=$("._1vC4OE._3qQ9m1");
		const pr_price_text=pr_price.text();
		var pname ='"'+pr_name_text+'"';
		
		//var pname="Vu";
		console.log(pname);
		// console.log(typeof(pname));
		console.log(pr_name_text);
		User.findById(req.user._id).populate('followers').exec(function(err,user){
			if(err){
				console.log(err);
				res.redirect("back");
			}
			else{
				console.log(user);
		var usernotification={
		isAvailable:"",
		pprice:"",
		stock:"",
		}
		Usernotification.create(usernotification,function(err,creatednotify){
			if(err){
				console.log(err);
			}
			else
				{
					creatednotify.customer.id=req.user._id;
					creatednotify.customer.username=req.user.name;
					creatednotify.save();
					// user.notifications.push(creatednotify);
					// user.save();
					console.log(creatednotify);
					// usernotificationid=creatednotify._id;
					// console.log(usernotificationid);
		var newNotification = {
        username: req.user.name,
        prname:pr_name_text,
		prprice:pr_price_text,
		userid: req.user._id,
		usernotificationid:creatednotify._id
		}
		console.log(newNotification);
		// user.notifications.push(newNotification);
		for(const follower of user.followers){
			console.log(follower);
			Notification.create(newNotification,function(err,creatednoti){
				if(err){
					console.log(err);
				}
				else
					{
						console.log(creatednoti);
						follower.notifications.push(creatednoti);
						follower.save();
						console.log(creatednoti);
						
					}
			})
		}
				}
		});
		
				res.redirect("/");
			// console.log(follower.notification[0]);
			// 	console.log(follower.notification[0]);
			// res.flash("success","Your order sent to the shopkeepers");
			
			}
		});

var numbers=['+917797571993','+917903084194'];
for(var i=0;i<numbers.length;i++){
twilio.messages
      .create({
         from: 'whatsapp:+14155238886',
		 to: 'whatsapp:' + numbers[i],
         body: 'Hello there! You have just received a notification.Go to: https://fayeque123new-ozyeh.run.goorm.io/shopkeeper'
        }).then(message => console.log(message.sid));
}
// Promise.all(
//   numbers.map(number => {
//     return twilio.messages.create({
// 	from:'whatsapp:+14155238886',
//     to: number,
//     body: 'Hello there! You have just received a notification.Go to: https://fayeque123new-ozyeh.run.goorm.io/shopkeeper'
//     });
//   })
// )
//   .then(messages => {
//     console.log('Messages sent!');
//   })
//   .catch(err => console.error(err));		
		

		
		// Product.find({product_name:pname},function(err,success){
		// 	if(err)
		// 	{
		// 			console.log(err);
		// 		}
		// 	else
		// 		{
		// 			console.log(success);
		// 		}
		// });
		// res.render("searched.ejs",{prname:pr_name_text,prprice:pr_price_text});
	});
	
});
app.get("/shopkeepernotification",function(req,res){
	Shopkeeper.findById(req.user._id).populate('notifications').exec(function(err,shopkeeper){
		if(err)
			{
				console.log(err);
				res.redirect("back");
			}
		else{
			console.log(shopkeeper);
			res.render("shopkeepernotification",{notification:shopkeeper.notifications});
		}
	})
		
});


app.post("/user/:id/usernotificationid/:usernotificationid",function(req,res){
	var prprice=req.body.prprice;
	var stock=req.body.stock;
	var isAvailable="Yes";

	Usernotification.findById(req.params.usernotificationid,function(err,foundnotification){
		if(err){
			console.log(err)
		}
		else
			{
				foundnotification.isAvailable="Yes";
				foundnotification.pprice=prprice;
				foundnotification.stock=stock;
				foundnotification.shopkeeper.id=req.user._id;
				foundnotification.shopkeeper.username=req.user.name;
				// foundnotification.shopkeeper.username=req.user.name;
				foundnotification.save();
				console.log(foundnotification);
				// res.redirect("/shopkeeperloggedin");
	User.findById(req.params.id).populate("notifications").exec(function(err,updatinguser){
		if(err){
			console.log(err);
			// res.redirect("back");
		}
		else
			{
				updatinguser.notifications.push(foundnotification);
				updatinguser.save();
				console.log(updatinguser);
				res.redirect("/shopkeeperloggedin");
				// res.render("front",{notification:updatinguser.notifications});
			}
	})
	}
	});
});
app.get("/usernotification",function(req,res){
	User.findById(req.user._id).populate("notifications").exec(function(err,usernotification){
		if(err){
			console.log(err);
		}
		else
		{
				res.render("usernotification",{notification:usernotification.notifications});
		}
	})
})




app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out");
	res.redirect("/");
});
app.get("/shopkeeperlogout",function(req,res){
	req.logout();
	req.flash("success","logged you out");
	res.redirect("/shopkeeper");
});
// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "p");
// };
app.listen(PORT,function(req,res){
	console.log("local market server strated")
})