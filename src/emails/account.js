const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendwelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'meshaelshahid47@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get alomg with the app.`
    })
    
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'meshaelshahid47@gmail.com',
        subject: 'Unsubscribed from app',
        text: `We are sorry to see you go, ${name}. Let us know what we could have done to keep you on board.`
    })
}

module.exports = {
    sendwelcomeEmail,
    sendCancellationEmail
}