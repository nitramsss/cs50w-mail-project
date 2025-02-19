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

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox'){
    inbox();
  } else if (mailbox === 'sent'){
    // to do
  } else {
    // to do
  }

}

function inbox() {

  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    
    const emailsView = document.querySelector('#emails-view');  

    // if there are no inbox yet
    if (emails.length <= 0) {
      emailsView.innerHTML = '<h5>No messages yet.</h5>';
    } 

    // show all email
    emails.forEach(email => {

      const div = document.createElement('div');

      div.innerHTML = `<h6>${email.sender}</h6><p>${email.subject}</p><p>${email.timestamp}</p>`;
      
      div.style.display = "flex";
      div.style.flexWrap = "wrap";
      div.style.justifyContent = "space-between";

      emailsView.appendChild(div);
    });

  })
  .catch(error => console.error(`Error: ${error}`));
}


function sendMail (toRecipients, toSubject, toBody) {
    
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