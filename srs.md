 
Software Requirements Specification (SRS)
Event Ticketing and Showcasing Platform (ETSP)
Prepared for:
Project Stakeholders, Development Team, and QA Engineers
Date: June 2026

 
1. Introduction
1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the Event Ticketing and Showcasing Platform (ETSP). The system is a web-based platform that enables organizers to create and manage events, sell tickets online, and track event performance, while allowing attendees to browse, discover, and purchase tickets with electronic delivery.
 
This document serves as a formal agreement between project stakeholders, the development team, and testers regarding the expected behaviour and constraints of the system.
 
1.2 Document Conventions
The following conventions are used throughout this document:

 
Convention
Meaning
SHALL
Mandatory requirement
SHOULD
Recommended requirement
MAY
Optional requirement
Organizer
Event Creator / Manager
Attendee
Ticket Buyer / Event Browser
Admin
System Administrator

 
1.3 Intended Audience and Reading Suggestions
This document is intended for:
•   	Project sponsors and business stakeholders
•   	Software developers
•   	Test and quality assurance engineers
•   	UI/UX designers
•   	System administrators and DevOps engineers
 
Recommended reading order:
1. 	Introduction
2. 	Overall Description
3. 	System Features (Functional Requirements)
4. 	External Interface Requirements
5. 	Non-Functional Requirements
 
1.4 Project Scope
The Event Ticketing and Showcasing Platform (ETSP) will provide:
•   	An online portal for organizers to create, publish, and manage events
•   	Ticket sales and inventory management functionality
•   	A browsing and discovery interface for attendees to explore upcoming events
•   	Secure online payment processing for ticket purchases
•   	Electronic ticket delivery via QR code and SMS confirmation
•   	Real-time analytics and reporting dashboards for event organizers
•   	Organizer and attendee account management
 
The system will NOT:
•   	Provide live-streaming or virtual event hosting
•   	Handle physical merchandise sales
•   	Offer built-in customer support chat functionality
•   	Manage venue rental agreements or contracts
 
1.5 References
•   	IEEE Standard for Software Requirements Specifications (IEEE Std 830-1998)
•   	Sommerville, I. — Software Engineering, 10th Edition
•   	Pressman, R. — Software Engineering: A Practitioner's Approach
•   	PCI DSS — Payment Card Industry Data Security Standard
•   	OWASP Top 10 — Web Application Security Risks

 
2. Overall Description
2.1 Product Perspective
The Event Ticketing and Showcasing Platform is a standalone, cloud-hosted web application designed to replace fragmented event promotion and manual ticketing processes. It brings together event creation, ticket sales, and attendee management into a single digital ecosystem.
 
Current Process (Without ETSP):
•   	Organizers create events on disparate social media platforms with no unified ticketing capability
•   	Ticket sales are handled manually via bank transfers, mobile money, or informal systems
•   	Attendees receive no formal confirmation or verifiable ticket
•   	Organizers have little to no real-time visibility into ticket sales and revenue
 
Proposed System (ETSP):
•   	Organizers create and publish events through a structured, guided interface
•   	Online payment processing handles all ticket transactions securely
•   	Attendees receive a QR-code-based electronic ticket upon purchase
•   	SMS confirmation is sent to the attendee's registered mobile number
•   	Organizers access a live analytics dashboard to monitor event performance
 
2.2 Product Features
Major features of the platform include:
1. 	User Authentication and Account Management
2. 	Event Creation and Publishing
3. 	Event Discovery and Browsing
4. 	Ticket Purchasing and Payment Processing
5. 	QR Code Electronic Ticket Generation and Delivery
6. 	SMS Purchase Confirmation
7. 	Organizer Analytics and Reporting Dashboard
8. 	Ticket Scanning and Validation at Venue
9. 	Admin Control Panel
 
2.3 User Classes and Characteristics
Organizer (Event Creator)
Responsibilities:
•   	Create and manage event listings
•   	Set ticket types, pricing tiers, and availability
•   	Monitor sales metrics and attendee figures
•   	Access revenue reports and export data
Skill Level: Basic to intermediate computer literacy; familiar with online forms and dashboards.
 
Attendee (Event Browser / Ticket Buyer)
Responsibilities:
•   	Browse and discover events on the platform
•   	Purchase tickets using online payment methods
•   	Receive and present QR code tickets at event entry
•   	Manage purchased tickets from their account
Skill Level: Basic computer literacy; comfortable with online shopping or mobile apps.
 
Administrator (System Admin)
Responsibilities:
•   	Manage user accounts (organizers and attendees)
•   	Review and approve or reject event listings
•   	Monitor platform activity and resolve disputes
•   	Generate platform-wide reports
Skill Level: Intermediate to advanced computer literacy with administrative experience.
 
2.4 Operating Environment
Client Side
•   	Google Chrome (version 90+)
•   	Mozilla Firefox (version 88+)
•   	Microsoft Edge (version 90+)
•   	Mobile browsers on iOS Safari and Android Chrome
Server Side
•   	Node.js / FastAPI application server
 
Database
•   	PostgreSQL (primary relational database)
•   	Redis (session caching and rate limiting)
Third-Party Services
•   	Payment gateway (e.g., Paystack,) for processing transactions
•   	SMS gateway (e.g., Twilio, Mnotify) for delivery confirmations
•   	Cloud object storage (e.g., AWS S3) for media and QR code assets
 
2.5 Design and Implementation Constraints
•   	The system must be developed as a responsive web application accessible on both desktop and mobile browsers
•   	All financial transactions must comply with PCI DSS standards
•   	The system must use HTTPS for all communications
•   	Must support at least 500 concurrent users on the platform
•   	All ticket QR codes must be unique and cryptographically verifiable
•   	SMS delivery must be completed within 60 seconds of a successful payment
•   	Development must be completed within a single project semester
 
2.6 Assumptions and Dependencies
Assumptions:
•   	Users have a stable internet connection to access the platform
•   	Organizers possess a valid bank account or mobile money account for payouts
•   	Attendees provide a valid phone number to receive SMS confirmations
•   	Third-party payment gateway APIs remain operational and available
 
Dependencies:
•   	Availability and uptime of the chosen payment gateway service
•   	Availability and uptime of the SMS gateway service
•   	Cloud hosting infrastructure reliability
•   	Browser compatibility with modern JavaScript standards

 
3. System Features
3.1 Functional Requirements
 
FR1: User Authentication
Description: All users shall securely authenticate before accessing role-specific features of the platform.
 
Req. ID
Requirement
FR1.1
The system shall provide a registration page for new organizers and attendees.
FR1.2
The system shall validate email addresses and enforce strong password policies during registration.
FR1.3
The system shall provide a login page accepting email and password credentials.
FR1.4
The system shall display appropriate error messages for invalid or unrecognized credentials.
FR1.5
The system shall support password reset functionality via email verification link.
FR1.6
The system shall maintain separate role-based access for Organizers, Attendees, and Admins.

 
FR2: Event Creation and Management
Description: Organizers shall be able to create, edit, publish, and delete event listings through a guided interface.
 
Req. ID
Requirement
FR2.1
Organizers shall create a new event by providing a title, description, date, time, venue, and cover image.
FR2.2
Organizers shall define one or more ticket types (e.g., Regular, VIP) with distinct pricing and quantities.
FR2.3
Organizers shall set a sales start and end date for each ticket type.
FR2.4
Organizers shall preview the event listing before publishing.
FR2.5
Organizers shall publish, unpublish, or delete their event listings.
FR2.6
Organizers shall edit event details after publishing, with changes reflected in real time.
FR2.7
The system shall notify affected ticket holders via email if key event details change after purchase.

 
FR3: Event Discovery and Browsing
Description: Attendees and visitors shall browse and search for events on the platform without requiring an account.
 
Req. ID
Requirement
FR3.1
The system shall display a public event showcase page listing all active, upcoming events.
FR3.2
The system shall provide search functionality allowing users to search events by name or keyword.
FR3.3
The system shall support filtering events by category, date range, location, and price.
FR3.4
Each event shall have a dedicated public detail page showing full information, ticket types, and availability.
FR3.5
The system shall indicate ticket availability status (Available, Limited, Sold Out) on event listings.

 
FR4: Ticket Purchase and Payment
Description: Attendees shall purchase tickets through a secure, integrated payment flow.
 
Req. ID
Requirement
FR4.1
Attendees shall select ticket type and quantity from the event detail page.
FR4.2
The system shall display an order summary including ticket subtotal, fees, and total amount before payment.
FR4.3
The system shall process payments through an integrated third-party payment gateway.
FR4.4
The system shall support card payments and mobile money as payment methods.
FR4.5
The system shall decrement available ticket count in real time upon successful payment.
FR4.6
The system shall prevent purchase of tickets that exceed the remaining available quantity.
FR4.7
The system shall generate a unique order reference for each successful transaction.

 
FR5: Electronic Ticket Generation and Delivery (QR Code)
Description: The system shall generate a verifiable QR code-based electronic ticket for each purchased ticket.
 
Req. ID
Requirement
FR5.1
The system shall generate a unique QR code for each individual ticket purchased.
FR5.2
Each QR code shall encode the ticket ID, event ID, attendee name, and a cryptographic verification hash.
FR5.3
The system shall deliver the QR code ticket to the attendee via email as a downloadable PDF attachment.
FR5.4
Attendees shall be able to view and download their tickets from their account dashboard at any time.
FR5.5
The system shall support QR code scanning at the venue to validate ticket authenticity.
FR5.6
The system shall flag and reject duplicate or previously scanned QR codes.

 
FR6: SMS Purchase Confirmation
Description: The system shall send an SMS notification to the attendee's registered phone number upon successful ticket purchase.
 
Req. ID
Requirement
FR6.1
The system shall send an SMS confirmation to the attendee's registered phone number within 60 seconds of a successful payment.
FR6.2
The SMS shall include the event name, date, time, ticket type, quantity purchased, and order reference number.
FR6.3
The system shall log the delivery status of each SMS notification.
FR6.4
The system shall re-attempt SMS delivery up to three times in the event of initial failure.

 
FR7: Organizer Analytics and Reporting
Description: Organizers shall have access to a real-time dashboard tracking their event's performance and revenue.
 
Req. ID
Requirement
FR7.1
The organizer dashboard shall display total tickets sold and total revenue in real time.
FR7.2
The dashboard shall show ticket sales broken down by ticket type.
FR7.3
The dashboard shall display a sales trend chart over time (daily and weekly views).
FR7.4
Organizers shall export attendance and sales reports as CSV or PDF.
FR7.5
The system shall display a list of ticket purchasers with name, ticket type, and purchase date.

 
FR8: Admin Control Panel
Description: Administrators shall oversee platform activity, manage accounts, and resolve issues.
 
Req. ID
Requirement
FR8.1
Admins shall view, suspend, or delete any user account on the platform.
FR8.2
Admins shall review pending event submissions and approve or reject them.
FR8.3
Admins shall monitor platform-wide ticket sales and revenue metrics.
FR8.4
Admins shall generate system-wide reports on user activity, events, and transactions.
FR8.5
Admins shall flag or remove event listings that violate platform policies.


 
4. External Interface Requirements
4.1 User Interfaces
Landing / Home Page
•   	Featured and upcoming events carousel
•   	Search bar with category and date filters
•   	Navigation links: Browse Events, Create Event, Login / Sign Up
 
Attendee Registration & Login
•   	Fields: Full Name, Email Address, Phone Number, Password, Confirm Password
•   	Social login option (Google OAuth)
•   	Login form with email and password fields
 
Event Discovery Page
•   	Grid/list layout of event cards (cover image, title, date, location, price)
•   	Filter sidebar: Category, Date Range, Price Range, Location
•   	Sort options: Date, Popularity, Price
 
Event Detail Page
•   	Full event description, cover image, venue, date and time
•   	Ticket type selector with price and availability indicators
•   	Quantity selector and 'Buy Tickets' call-to-action button
 
Checkout and Payment Page
•   	Order summary with line-item breakdown
•   	Payment method selection (Card / Mobile Money)
•   	Secure payment form integrated with the payment gateway
 
Attendee Dashboard
•   	Upcoming and past purchased tickets
•   	QR code viewer and download for each ticket
•   	Profile and account settings
 
Organizer Dashboard
•   	Event management: Create, Edit, Publish, Delete events
•   	Real-time sales metrics, charts, and revenue summary
•   	Attendee list and report export
 
Admin Panel
•   	User management table with search and filter
•   	Event moderation queue
•   	Platform analytics overview
 
4.2 Hardware Interfaces
Client Devices
•   	Desktop and laptop computers
•   	Smartphones and tablets (iOS and Android)
•   	QR code scanners or smartphones with camera access for venue entry validation
Server Hardware (Minimum Recommended)
•   	8 GB RAM
•   	4-core CPU
•   	100 GB SSD Storage
•   	Scalable cloud hosting with auto-scaling capability
 
4.3 Software Interfaces
Payment Gateway
•   	REST API integration with Paystack
•   	Webhook callbacks to confirm payment success or failure
SMS Gateway
•   	RESTful API integration with Mnotify
•   	Delivery status callbacks for tracking SMS success/failure
Cloud Storage
•   	AWS S3 or equivalent for storing event cover images and generated QR code PDFs
Database
•   	PostgreSQL as the primary relational database
•   	Redis for session management and caching
Browser Compatibility
•   	Google Chrome, Mozilla Firefox, Microsoft Edge, Safari
 
4.4 Communications Interfaces
•   	All client-server communications shall use HTTPS (TLS 1.2 or higher)
•   	RESTful APIs shall be used for all internal and external service integrations
•   	WebSockets may be used to deliver real-time sales updates to the organizer dashboard
•   	Email notifications shall be delivered via an SMTP relay or transactional email service (e.g., SendGrid)

 
5. Non-Functional Requirements
5.1 Performance Requirements
•   	Page load times shall not exceed 3 seconds under normal network conditions.
•   	The system shall support a minimum of 500 concurrent users without performance degradation.
•   	Payment processing and confirmation shall complete within 5 seconds of submission.
•   	QR code ticket generation shall be completed within 10 seconds of payment confirmation.
•   	SMS confirmation shall be dispatched within 60 seconds of a successful payment.
 
5.2 Safety Requirements
•   	All payment data shall be processed through PCI DSS-compliant third-party gateways; no raw card data shall be stored on the platform.
•   	Organizer payouts shall require identity verification before processing.
•   	Cancellation or deletion of an event with existing ticket holders shall trigger mandatory confirmation and attendee notification.
•   	System failures shall not result in duplicate ticket issuance or double-charging of attendees.
•   	Transaction records shall be backed up daily to a geographically separate storage location.
 
5.3 Security Requirements
Authentication
•   	All users shall authenticate with a valid email and password before accessing protected features.
•   	The system shall enforce a minimum password length of 8 characters with at least one uppercase letter, one number, and one special character.
•   	Multi-factor authentication (MFA) shall be offered as an optional feature for organizer accounts.
Authorization
•   	Attendees shall only access their own ticket and order records.
•   	Organizers shall only manage events and analytics belonging to their own account.
•   	Admin actions shall be logged with a timestamp and actor ID for audit purposes.
Data Encryption
•   	All data in transit shall be encrypted using TLS 1.2 or higher.
•   	Passwords shall be hashed using bcrypt or Argon2 before storage; plaintext passwords shall never be stored.
•   	QR code verification hashes shall use HMAC-SHA256 to prevent forgery.
Session Security
•   	Authenticated sessions shall automatically expire after 30 minutes of inactivity.
•   	The system shall invalidate all active sessions upon password change.
•   	The system shall implement CSRF protection on all state-changing requests.
 
5.4 Software Quality Attributes
Reliability
The system shall target a minimum of 99% uptime, measured monthly. Planned maintenance windows shall be communicated to users at least 24 hours in advance.
Usability
The platform shall be intuitive enough for first-time users to discover and purchase an event ticket within 5 minutes without assistance. The interface shall be fully responsive and usable on mobile devices.
Maintainability
The codebase shall follow modular architecture principles with clear separation of concerns. All API endpoints and key business logic shall be documented. The system shall include automated test coverage for all critical payment and ticketing flows.
Scalability
The system architecture shall support horizontal scaling to accommodate traffic spikes during popular event launches. The platform shall support expansion to multiple regions and currencies in future releases.
Portability
The application shall function correctly on all major modern web browsers. The backend shall be containerized using Docker to support deployment across different hosting environments.

 
Appendix A: Sample Use Cases
Use Case 1: Purchase an Event Ticket
Actor: Attendee
 
Preconditions:
•   	The attendee is registered and logged into the platform.
•   	The selected event is active and has available tickets.
 
Main Flow:
1. 	Attendee navigates to the Event Discovery page and selects an event of interest.
2. 	Attendee views the event detail page and selects ticket type and quantity.
3. 	System displays the order summary with total cost.
4. 	Attendee proceeds to checkout and selects a payment method.
5. 	Attendee completes payment via the integrated payment gateway.
6. 	System confirms payment, decrements available ticket count, and generates a unique QR code ticket.
7. 	System delivers the QR code ticket to the attendee via email.
8. 	System sends an SMS confirmation to the attendee's registered phone number within 60 seconds.
 
Postconditions:
•   	A unique QR code ticket is linked to the attendee's account and accessible from their dashboard.
•   	The event's available ticket count is updated in real time.
•   	An SMS and email confirmation has been received by the attendee.
 
Alternative Flow (Payment Failure):
•   	If the payment is declined, the system notifies the attendee and no ticket is issued.
•   	No ticket count decrement occurs; the attendee may retry with a different payment method.
 
Use Case 2: Create and Publish an Event
Actor: Organizer
 
Preconditions:
•   	The organizer is registered and logged into their account.
 
Main Flow:
9. 	Organizer navigates to the Organizer Dashboard and selects 'Create Event'.
10.  Organizer fills in event details: title, description, venue, date, time, and uploads a cover image.
11.  Organizer defines ticket types, sets prices, and specifies quantities.
12.  Organizer previews the event listing.
13.  Organizer submits the event for review or directly publishes it.
14.  System publishes the event and makes it visible on the Event Discovery page.
 
Postconditions:
•   	The event is live and discoverable by all platform visitors.
•   	The organizer can monitor ticket sales in real time from their dashboard.

