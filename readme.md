# VIGILANCE AI
Picture this: you're walking down the street, witness a crime, and simply shoot a quick text to report it. No fuss, no complicated forms. But wait, there's more – our AI superhero kicks in to understand the message, figure out what went down, where and when it happened, and even how urgent it is. Cool, right?
## What's Cooking?
We're cooking up an AI-Powered Crime Reporting Service that's all about making crime reporting a breeze. It's like sending a message to a buddy, but instead, you're sending it to our AI that's ready to decode the crime jargon and deliver it to the right doorstep.
## The Why:
By turning text reports into organized insights, we're not just simplifying crime reporting – we're handing law enforcement agencies a whole new level of supercharged information. Think crime trends, hotspots, and patterns that can be total game-changers.We could turn it into something seriously impactful.
## Interactions
**User**
1.  Reports a crime/incident through SMS
2.  Receives confirmation that SMS was receives  

**Server**
1.  Receives and stores report in database
2.  Passes on the received report and other related reports to the AI
3.  Stores AI generated report (all generated reports will be stored to show the progression of the report)
    
**AI**
1.  Generates a report based on related reports

**Law Enforcement**
1.  Visits dashboard
2.  Sees the most urgent reports first (AI generated, but should have the option of seeing the actual SMSs sent by users)
3.  Should be able to see the progression of the AI generated reports
4.  Should be able to leave comments on both the SMS sent and the AI generated report
5.  Should be able to leave a final report after thorough investigation and conclusion of the case

## Tools Used
1. Africastalking API
2. Open AI (Embeddings and Completion)
3. Supabase (PostgreSQL, pgvector)
4. Ngrok
5. NodeJS
6. ExpressJS

***Note:*** *No Error checks were implemented*
### How to setup project
1. Create a user account on [AfricasTalking](https://account.africastalking.com), [Supabase](https://supabase.com),  [Open AI](https://ngrok.com/) and [Ngrok](https://ngrok.com/)
2. Clone the project
3. Edit the .env and change the **API keys** and **URLs** file appropriately
4. [Setup supabase postgreSQL and pgvector](https://supabase.com/blog/openai-embeddings-postgres-vector)
5. Download, extract and run [Ngrok](https://ngrok.com/download) on your computer
6. Run `ngrok http 4000` and copy the ngrok url (4000 is the port in the .env file)
7. Go to [incoming SMS callbacks](https://account.africastalking.com/apps/sandbox/sms/inbox/callback) and paste the ngrok URL. e.g *https://d5af-105-112-117-48.ngrok-free.app/incoming-messages*
8. [Create a short code](https://account.africastalking.com/apps/sandbox/sms/shortcodes/create) on africasTalking
9. Run server.js
10. Go to [africasTalking simulator](https://developers.africastalking.com/simulator), enter any number and send a message to your short code

> Written with [StackEdit](https://stackedit.io/).
