document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#inbox-view').style.display = 'none';

  
  document.querySelector('#compose-form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the recipients value, subject value, and body value
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Pass to sendMail function
    sendMail(recipients, subject, body);
    
  });

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#inbox-view').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox'){
    mailBox('inbox');
  } else if (mailbox === 'sent'){
    mailBox('sent');
  } else {
    mailBox('archive');
  }

}

function mailBox(event) {

  fetch(`/emails/${event}`)
  .then(response => response.json())
  .then(emails => {
    
    const emailsView = document.querySelector('#emails-view');  

    // if there are no inbox yet
    if (emails.length <= 0) {
      emailsView.innerHTML = '<h5>Empty</h5>';
    } 

    // show all email
    emails.forEach(email => {

      const div = document.createElement('div');

      if (email.read) {
        div.style.backgroundColor = 'white';
      } else {
        div.style.backgroundColor = 'gray';
      }

      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.border = '1px solid black';
      div.style.marginBottom = '3px';

      div.innerHTML = `<h6>${email.sender}</h6><p>${email.subject}</p><p>${email.timestamp}</p>`;
      
      div.style.display = "flex";
      div.style.flexWrap = "wrap";
      div.style.justifyContent = "space-between";

      div.addEventListener('click', () => {
        // show div content 
        showEmail(email.id);

        // make div.read = True
        // email.read = 'True';

      });

      emailsView.appendChild(div);
    });

  })
  .catch(error => console.error(`Error: ${error}`));
}


function sendMail(toRecipients, toSubject, toBody) {
    
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: `${toRecipients}`,
        subject: `${toSubject}`,
        body: `${toBody}`
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
  }); 
}


function showEmail(id) {
  
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#inbox-view').style.display = 'block';
  
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...

      const fromUser = document.querySelector('#from-user');
      const toUser = document.querySelector('#to-user');
      const emailSubject = document.querySelector('#email-subject');
      const emailBody = document.querySelector('#email-body');


      fromUser.style.border = '1px solid black';
      fromUser.style.borderRadius = '5px';
      fromUser.style.padding = '10px';
      fromUser.style.marginBottom = '10px';
      fromUser.style.display = 'flex';
      fromUser.style.flexWrap = 'wrap';

      toUser.style.border = '1px solid black';
      toUser.style.borderRadius = '5px';
      toUser.style.padding = '20px';
      toUser.style.display = 'flex';
      toUser.style.flexWrap = 'wrap';
      toUser.style.flexDirection = 'column';
      toUser.style.lineHeight  =  '0.5';

      emailSubject.style.border = '1px solid black';
      emailSubject.style.borderRadius = '5px';
      emailSubject.style.padding = '10px';
      emailSubject.style.marginBottom = '10px';
      emailSubject.style.display = 'flex';
      emailSubject.style.flexWrap = 'wrap';

      emailBody.style.border = '1px solid black';
      emailBody.style.borderRadius = '5px';
      emailBody.style.padding = '10px';
      emailBody.style.marginBottom = '10px';
      emailBody.style.display = 'flex';
      emailBody.style.flexWrap = 'wrap';

      // inserting contents
      fromUser.innerHTML = `${email.sender}`;

      const recipients = ["safdsadf", "sdfsafa", "adfasd"];
      recipients.forEach(recipient => {

        const par = document.createElement('p');
        par.innerHTML = `${recipient}`

        toUser.append(par)        
      });

      emailSubject.innerHTML = `${email.subject}`;
      emailBody.innerHTML = `${email.body}`;

  });
}