# JournalGPT

Your AI journal take notes on the go with your voice and translate them into action items.

# TODOs

## v0.5 - basics

- [x] Add recording audio on the frontend
- [x] Record mp3 on the frontend and save it to ByteScale
- [x] Add whisper v3 endpoint through Fal that will take an mp3 and return the transcript
- [x] Switch from ByteScale to Convex File storage
- [x] Working version of recording audio, uploading it to Convex, and returning the transcript

## v0.7 - frontend

- [x] Implement frontend: dashboard
- [x] Implement frontend: todo list
- [x] Implement frontend: Main recording page
- [x] Implement frontend: Landing Page

## v1 - backend + polish

- [x] Display the transcript in the frontend
- [x] Switch to Replicate for whisper endpoint (https://replicate.com/vaibhavs10/incredibly-fast-whisper)
- [ ] Add GPT-4 Turbo call to format notes into bullet points + add action items
- [ ] Add auth with Clerk through Convex
- [ ] Add Convex DB to store transcripts + user action items
- [ ] Integrate frontend + backend
- [ ] Add Convex vector search for searching

## v2 (stretch)

- [ ] Make sure the transcript gets streamed into the frontend
- [ ] Email reminders through Resend powered by Convex cron jobs
- [ ] Convex scheduled functions to send initial email to user that says "welcome"
- [ ] Add a mind map visualization?
