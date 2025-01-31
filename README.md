# COSC4353-Group30

## 1. Initial Thoughts
**Consider user experience: How will users (volunteers and administrators) interact with the application?**

In our application, we will have two levels of users: volunteers and admins. When a volunteer signs up, after user registration through the email confirmation, the volunteer will be prompted to complete their profile, setting their location, skills, preferences, and lastly, their availability (for ex., morning, afternoon, and evening). Then, from that page, the volunteer will be able to find events based on their completed profile. They will be able to sign up for these events. Once the user signs up they will receive a notification as a confirmation of their signing up for the event. If any changes occur to the event, the signed-up volunteer will receive a notification for this; they may also receive a notification as a reminder, let's say, an hour before the event. The volunteer can also view/update their profile to change their preferences and other profile fields. They may also view his history of events attended.
As for the admin, the admin may sign up as a regular user, but they will need to request admin access for them to be able to view the admin dashboard. Once they have admin access, they will be able to view the current events that have been created, including all the details needed such as location, skills required, etc. The admin will be able to execute a full array of CRUD operations on the events. So when they create the event, they will be able to make them with their necessary location, skills needed, and other important details. The admin will also have full access to all the users and their necessary data such as their volunteer history, skills, and preferences. Again, they will have a full array of CRUD operations on the users(volunteers). Keep in mind that volunteers will only be able to view/edit their own profile, not view the profiles of other volunteers. Admins will also be able to send out necessary notifications based on updates on a particular event to all the registered volunteers for the specific event. Once again, this is a rough discussion and is in no way final.

**Identify the key functionalities: What are the essential features the application must have?**

The most important functions I belelive are, first and formost, proper user authentication so only registered users can sign up and modify/view the data in the database for their own profile. Secondly, we must have appropriate user authentication based on the particular role of the user, so volunteers should not be able to access the admin portal. Extending on that point, volunteers should not be able to view the data that only admins are supposed to see, like all user data or all events data. Users should not be able to edit specific data, such as events, other user profiles, etc. Another important function we need is the ability to create events and enable proper tags to be attached to these events, such as location, preferences, skills needed, etc. Based on this, we have to be able to filter all these events according to the user's profile. This is a must, and this is the meat of the dish. Another important feature we need is a system in which a user can sign up for an event, and they will receive notifications in relation to the event/s they are signed up for via email. 

**Technology stack: What technologies might you use for front-end, back-end, database, and other components?**

We are considering using a React Vite frontend, TailwindCSS & ShadCN components for the styling; this makes our frontend development simple and lightweight so that we can focus on the rest of the application. For the backend, which will be using an API that connects the database data to the front end, and for that we are thinking about using a Django backend. For the database, we are considering using a lightweight, easy-to-implement database like SQLite. We hope this app will be easy to maintain and develop but will have powerful functionality given the tech stack we are using. 
 
## 2. Development Methodology

**Agile** over DevOps and Waterfall

  - DevOps: A method of working based on two teams: development focuses on building code and testing, and operations does the work of implementation, operation, and monitoring. Although the two departments operate separately, both always communicate continuously. If there are errors, they will provide patches, and Operations will deploy them, forming a continuous loop. While this is extremely helpful with larger groups and complex projects, we have a simple task and a total of 4 members. This wouldn’t be necessary to produce the software requirements.

  - Agile: This methodology helps us to break projects into small tasks, and communication and interaction will take place more than processes and tools. This means we can always be in communication with each other and continue towards a specific goal, meet up, and then continue to another goal until we reach our final, completed software. Ultimately, we will be pursuing this methodology because, after every sprint and goal, we can continue our development after fixing any errors, questions, and concerns that TAs or the professor will have.

  - Waterfall: While we could choose this because we are technically receiving feedback on our project at the end of it, we will process errors and feedback in between assignments, so this wouldn’t apply to this software’s design and development. We will not be pursuing this methodology.

So, the development methodology we will be choosing is Agile. For the reasons stated above, we were able to weed out the ones that would necessarily help us with our group and project size. 

## 3. High-Level Design / Architecture

The main components of the front end are the login/register portal, admin dashboard, and general user dashboard. Each of these will call to the database (backend for frontend) in order to tackle the logic for each user experience, such as the desktop experience (whereas the mobile experience might look a little different). Each view will look different, but all will ultimately serve the same goal for both admins and volunteers. The administrators will be able to create/read/update/delete(CRUD) new events and update the user’s information. General users will be able to view events and sign up for them, as well as update their profile. Admins will be able to see all users’s history and information, while a single user can only see their own history and information. The database will supply and receive data: events, users, notification requests, etc. When a user registers (and after the confirmation email is clicked and accepted), the backend will receive the user's information and hash (encrypted) the sensitive data. Their email, name, password, profile picture, events they are signing up for, and other information will be saved. Events will also be on this database, which is created by administrators and shown to all users. Events will not be deleted in order to present the history, track users, and send notifications. Users can be switched to admins by denoting whether the user in the database has permissions (through a boolean or such), thus simplifying the login and registration portal. The history of the user will be as easy as getting all events tied to a user and sending them to the front end to handle visualizing it to the user. Thus, when a user signs up for an event, we use an associative entity of some sort to tie the user and the event together, and therefore, we can show the history of a user/s.
When the admins create events, they attach specific criteria to them, such as location, urgency, skills needed, and topic(or, you could say, preferences tied to) of the event. Right now, we believe these will separate associative entities; for example, for a given availability, like morning or evening, we will have a user ID attached to that. Going into more detail, we will also have associative entitys in the same manner for preferences and skills, like a user says they likes gardening events, we then create a associative entity tieing that user to the preference of "Gardening", they will again be tied with the user id. The same thing will be true for skills. As for location, then we are thinking right now of just having the location of a user in the user entity itself have a varchar attribute of some sort. Then, a matching event with the location will be shown to him in the client. As for the urgency of a specific event, we believe that this should be presented to the user when they view the event, and the user can decide if they can attend it or not. As for notifications, we believe that when a specific event is coming up (for ex., in 1 hour), we send a notification to all registered users of the event. Also, when the user signs up for an event, we should send him a notification that they are registered for this event. This is a very high-level view and in no way represents our final product, but this is something that we are just thinking of. 

Frontend-wise, we will have a few routes (possibly more or less)
  - /admin
  - /dashboard
  - /login
  - /register
  - /profile

When registering, the user will be prompted to input their email, username, and password. After an email is sent and confirmed by the user, the profile page will be shown where the user can edit their information (profile picture, name, etc). Then, they will have access and be directed to the volunteering dashboard, where they can view and sign up for different events. They will be able to view their history by also going to their profile, where the front end will handle showing the user all the events they have attended. When logging in, a general user will be directed to the dashboard page, while an admin will be directed to the admin page. We are still debating whether we should be able to create admins from our website or if we should create admins manually and assign them a username and password. This is something we may need clarification on in the future. 

**Third-party services or APIs we plan to integrate:**
	
  -	SMTP (for emails): Mailersend

### Diagram for our software:
![Diagram](https://github.com/grapejuices/COSC4353-Group30/blob/master/Diagram.drawio.svg)

### Diagram for our database:
![Database](https://github.com/grapejuices/COSC4353-Group30/blob/master/Database.drawio.svg)

## Group Members

As a side note, we all worked on this assignment using various platforms, including (but not limited to) Discord, Google Drive, GitHub, and Draw.io. To ensure everyone gets the credit they deserve, we are including this little note here because everyone did their part. Each of us went back and fixed some of the mistakes that one another made, so it wouldn't be appropriate to attribute each person to one thing. 

| Group Member Name   | What is your contribution?                       | Discussion Notes |
|---------------------|--------------------------------------------------|------------------|
| Talha A Mohammed    | A1  						 |    Read Above    |
| Jonathan I Margolis | A1                                          	 |         ^        |
| Quoc Hung Pham      | A1                                           	 |         ^        |
| Mateus D Smith      | A1                                           	 |         ^        |
