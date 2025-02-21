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
    // Get all received inbox
    mailBox('inbox');
  } else if (mailbox === 'sent'){
    // Get all sent inbox
    mailBox('sent');
  } else {
    // Get all archived inbox
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

      div.addEventListener('click', () => {
        // show div content 
        showEmail(email.id);

      });

      if (email.read) {
        div.style.backgroundColor = 'white';
      } else {
        div.style.backgroundColor = 'gray';
      }      
      
      // style the div
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.border = '1px solid black';
      div.style.marginBottom = '3px';

      // Show the sender, subject, and time in div
      div.innerHTML = `<h6>${email.sender}</h6><p>${email.subject}</p><p>${email.timestamp}</p>`;
      
      // Make it responsive
      div.style.display = "flex";
      div.style.flexWrap = "wrap";
      div.style.justifyContent = "space-between";

      // Append to html div
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
  .then(response => console.log(response.json()))
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
      // console.log(email);

      // Get all div to be used
      const fromUser = document.querySelector('#from-user');
      const toUser = document.querySelector('#to-user');
      const emailSubject = document.querySelector('#email-subject');
      const emailBody = document.querySelector('#email-body');

      // Style sender box
      fromUser.style.border = '1px solid black';
      fromUser.style.borderRadius = '5px';
      fromUser.style.padding = '10px';
      fromUser.style.marginBottom = '10px';
      fromUser.style.display = 'flex';
      fromUser.style.flexWrap = 'wrap';

      // Style receiver box
      toUser.style.border = '1px solid black';
      toUser.style.borderRadius = '5px';
      toUser.style.paddingLeft = '10px';
      toUser.style.paddingTop = '20px';
      toUser.style.paddingRight = '10px';
      toUser.style.paddingBottom = '5px';

      toUser.style.display = 'flex';
      toUser.style.flexWrap = 'wrap';
      toUser.style.flexDirection = 'column';
      toUser.style.lineHeight  =  '0.5';

      // Style subject box
      emailSubject.style.border = '1px solid black';
      emailSubject.style.borderRadius = '5px';
      emailSubject.style.padding = '10px';
      emailSubject.style.marginBottom = '10px';
      emailSubject.style.display = 'flex';
      emailSubject.style.flexWrap = 'wrap';

      // Style body box
      emailBody.style.border = '1px solid black';
      emailBody.style.borderRadius = '5px';
      emailBody.style.padding = '10px';
      emailBody.style.marginBottom = '10px';
      emailBody.style.display = 'flex';
      emailBody.style.flexWrap = 'wrap';

      // inserting contents
      fromUser.innerHTML = `${email.sender}`;

      toUser.innerHTML = '';

      // Insert each recipients inside the receivers' box
      const recipients = email.recipients;
      recipients.forEach(recipient => {

        const par = document.createElement('p');
        par.innerHTML = `${recipient}`

        toUser.append(par)        
      });

      emailSubject.innerHTML = `${email.subject}`;
      emailBody.innerHTML = `${email.body}`;


      // Archive and unarchive button
      const currentUser = document.querySelector('[data-current-user]');

      console.log(currentUser.dataset.currentUser)
      if (email.sender !== currentUser.dataset.currentUser) {
        const button = document.createElement('button');
        const divTarget = document.querySelector('#inbox-button');

        divTarget.innerHTML = '';

        button.style.borderRadius = '5px';
        button.style.backgroundClip = 'white';

        
        if (email.archive) {
          button.innerHTML = "Unarchive";
        } else {
          button.innerHTML = "Archive";
        }

        divTarget.appendChild(button);

        button.addEventListener('click', () => {

          if (email.archive) {
            console.log(email.archive)
            archiveUnarchive(email.id, 'false');
          } else {
            console.log(email.archive)
            archiveUnarchive(email.id, 'true');
          }
        })
      }

  });

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}


function archiveUnarchive(emailId, event) {
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    body: JSON.stringify({
      archive: Boolean(`${event}`)
    })
  })
}