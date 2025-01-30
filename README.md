# COSC4353-Group30

## 1. Initial Thoughts
WIP

## 2. Development Methodology

**Agile** over DevOps and Waterfall

  - DevOps: A method of working based on two teams: development focuses on building code and testing, and operations does the work of implementation, operation, and monitoring. Although the two departments operate separately, both always communicate continuously. If there are errors, they will provide patches, and Operations will deploy them, forming a continuous loop. While this is extremely helpful with larger groups and complex projects, we have a simple task and a total of 4 members. This wouldn’t be necessary to produce the software requirements.

  - Agile: This methodology helps us to break projects into small tasks, and communication and interaction will take place more than processes and tools. This means we can always be in communication with each other and continue towards a specific goal, meet up, and then continue to another goal until we reach our final, completed software. Ultimately, we will be pursuing this methodology because, after every sprint and goal, we can continue our development after fixing any errors, questions, and concerns that TAs or the professor will have.

  - Waterfall: While we could choose this because we are technically receiving feedback on our project at the end of it, we will process errors and feedback in between assignments, so this wouldn’t apply to this software’s design and development. We will not be pursuing this methodology.

So, the development methodology we will be choosing is Agile. For the reasons stated above, we were able to weed out the ones that would necessarily help us with our group and project size. 

## 3. High-Level Design / Architecture

The main components of the front end are the login/register portal, admin dashboard, and general user dashboard. Each of these will call to the database (backend for frontend) in order to tackle the logic for each user experience, such as the desktop experience (whereas the mobile experience might look a little different). Each view will look different, but all will ultimatley serve the same goal for both admins and voluneteers. The administrators will be able to create/read/update/delete(CRUD) new events and update user’s information. General users will be able to view events and sign up for them, as well as update their profile. Admins will be able to see all users’s history and information, while a single user can only see their own history and information. The database will supply and receive data: events, users, notification requests, etc. When a user registers (and after the confirmation email is clicked and accepted), the backend will receive the user's information and hash (encrypted) the sensitive data. Their email, name, password, profile picture, events they are signing up for, and other information will be saved. Events will also be on this database, which is created by administrators and shown to all users. Events will not be deleted in order to present the history, track users, and send notifications. Users can be switched to admins by denoting whether the user in the database has permissions (through a boolean or such), thus simplifying the login and registration portal. The history of the user will be as easy as getting all events tied to a user and sending them to the front end to handle visualizing it to the user. Thus when a user signs up for an event we use an associative entity of some sort to tie the user and the event togehter, and thus we can show the history of a user/s. When events are created by the admins, they attach certain criteria to them such as location, urgency, skills needed, and topic(or you could say preferecnes tied to) of the event. Right now we beleive these will seperate associative entities like for example for a given availability like morning, or evening, we will have a user id attached to that. Going into more detail, we will also have associative entitys in the same manner for preferences and skills, like a user says he likes gardening events, we then create a associative entity tieing that user to the preference of "Gardening", he will again be tied with the user id. Same thing will be true for skills. As for location, then we are thinking right now of just have the location of a user in the user entity itself has a varhcar attribute of some sort. Then a matching event with the location will be shown to him in the client. As for the urgency of a specific event than we beleive that this should be presented to the user when he views the event and the user can decide if he can attend it or not. As for notifications then we beleive that when a specific event is coming up (for ex. in 1 hour) we send a notification to all regiustered users of the event. Also, when the user signs up for an event we should also send him a notification that he is registered for this event. This is a very high level view and in no way repersents our final product, but this somthing that we are just thinking of. 

Frontend-wise, we will have a few routes (possibly more or less)
  - /admin
  - /dashboard
  - /login
  - /register
  - /profile

When registering, the user will be prompted to input their email, username, and password. After an email is sent and confirmed by the user, the profile page will be shown where the user can edit their information (profile picture, name, etc). Then, they will have access and be directed to the volunteering dashboard, where they can view and sign up for different events. They will be able to view their history by also going to their profile, where the front end will handle showing the user all the events they have attended. When logging in, a general user will be directed to the dashboard page, while an admin will be directed to the admin page. We are right now still debating if we should be able to create admins from our website, or we create admins manually and assign them a username and passoword. This is somthing we may need clarification on in the future. 

**Third-party services or APIs we plan to integrate:**
	
  -	SMTP (for emails): Mailersend


![Diagram](https://github.com/grapejuices/COSC4353-Group30/blob/master/COSC4353.drawio.svg)

## Group Members

| Group Member Name   | What is your contribution?                       | Discussion Notes |
|---------------------|--------------------------------------------------|------------------|
| Talha A Mohammed    | Setting up plan and Github + Proofreading of A1  |                  |
| Jonathan I Margolis | Part 1                                           |                  |
| Quoc Hung Pham      | Part 2                                           |                  |
| Mateus D Smith      | Part 3                                           |                  |
