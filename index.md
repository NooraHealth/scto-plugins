---
layout: home
title: Home
nav_order: 1
---

A curated collection of custom SurveyCTO plugins designed to enhance teletrainer workflows and improve patient care delivery.

## Why These Plugins?

We created these plugins because we wanted the ability to call different services/applications we built at Noora Health from our SurveyCTO forms. This prevents form users from having to deal with multiple platforms and makes their flow and work smoother by providing integration within the forms.

These plugins also allow us to pass any data already collected on the form to our APIs instead of having the form users enter them multiple times in different platforms/applications.

{: .important }
These plugins only work on Android devices and do not work on iPhone devices.

## Available Plugins

- [Freshdesk Ticket Plugin](fd-ticket-plugin/README.md)
- [RES Signup Plugin](res-signup-plugin/README.md)
- [WhatsApp Template Message Plugin](wa-message-plugin/README.md)

## Trying Out the Plugins

If you want to try out any of the plugins, here are the common steps you need to perform:

### 1. Download the Test Form

Download the test form from the `extras/test-form/` directory in the respective plugin repository. Test forms are included with every plugin and are mentioned in their respective documentation.

### 2. Upload the Test Form to SurveyCTO

Follow the guide at [Working with spreadsheet form definitions](https://support.surveycto.com/hc/en-us/articles/4613295552275-Working-with-spreadsheet-form-definitions-1-Creating-and-uploading#2) to upload the test form to your SurveyCTO server.

### 3. Download and Upload the Plugin

- Download the plugin file from the download link in the respective plugin documentation

  {: .warning }
  **Note**: Ensure the file name doesn't contain any trailing numbers like `(1)`, `(2)` which are automatically added by your system if you already have the plugin downloaded. Remove these and ensure the file name follows the correct format.

- Follow the guide at [Using field plug-ins](https://docs.surveycto.com/02-designing-forms/03-advanced-topics/06.using-field-plug-ins.html) to attach the plugin as an attachment to your form
