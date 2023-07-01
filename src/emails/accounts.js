const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.API_KEY});

const sendWelcomeMail= async function(name, email){
	try{
		const msg= await mg.messages.create('sandboxdc690d9065b74aaebad59255933797bd.mailgun.org', {
			from: "Excited User <mailgun@sandboxdc690d9065b74aaebad59255933797bd.mailgun.org>",
			to: [email],
			subject: "Hello",
			text: "Welcome to TaskManager!",
			html: "<h1>Thank You, for signing up. We welcome you to our TaskManager.</h1>"
		});
		console.log(msg);
	}
	catch(error)
	{
		console.log(error);
	}
};

const sendGoodbyeMail= async function(name, email){
	try{
		const msg= await mg.messages.create('sandboxdc690d9065b74aaebad59255933797bd.mailgun.org', {
			from: "Excited User <mailgun@sandboxdc690d9065b74aaebad59255933797bd.mailgun.org>",
			to: [email],
			subject: "Hello",
			text: "Welcome to TaskManager!",
			html: "<h1>Your's TaskManger Membership has been cancelled. Thank You for using our service.</h1>"
		});
		console.log(msg);
	}
	catch(error)
	{
		console.log(error);
	}
}

module.exports={
	sendWelcomeMail,
	sendGoodbyeMail,
}