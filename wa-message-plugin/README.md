---
title: WA Message Plugin
---
# WhatsApp Message Plugin

This plugin simplifies the process of connecting the [Turn platform](https://www.turn.io/) to your SurveyCTO forms, allowing you to send WhatsApp template messages effortlessly. It enables you to send pre-approved template messages to WhatsApp users, facilitating friendly reminders and promoting interaction with your WhatsApp service. This engagement, in turn, enhances participant engagement and improves data quality.


![](extras/plugin-preview.png)

## Download

[![Download now](extras/download-button.png)](wa-message.fieldplugin.zip)


## Required parameters

| Key                   | Value                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `phoneNumber`         | This is the phone number that will receive the WhatsApp template message.                                                                                                                              |
| `countryCode`         | This is the country code for the phone number. It will be automatically added to the phone number when sending a message on WhatsApp using that specific form. For example, it could be `91` or `880`. |
| `apiUrl`              | This is the URL of the API endpoint that will be invoked to send the WhatsApp message. Can be set to `https://whatsapp.turn.io/v1/messages`.                                                                                                                 |
| `apiToken`            | This is the authentication token for the [Turn](https://www.turn.io/) Account associated with the WhatsApp Line where the template is located.                                                         |
| `whatsappNamespaceId` | This is the WhatsApp Namespace ID where the template message is located.                                                                                                                               |
| `whatsappTemplateId`  | This is the WhatsApp Template Message ID, which will be used for sending a message to the user on WhatsApp.                                                                                            |
| `language`            | This language code specifies the language in which the template message should be sent.                                                                                                                |

### Turn API and other credentials 
To access all Turn API credentials, follow these steps:

1. Navigate to the Settings page.
2. Click on the 'API & Webhooks' tab.
3. Scroll down to the 'Authentication Tokens for X Whatsapp Line' section.
4. Locate and click the 'Create a Token' button.
5. Set the name for the token as 'SCTO WA Nudge Plugin.'
6. Ensure you set an expiry date well into the future to prevent it from expiring during the SurveyCTO survey's active period.
7. The value you'll obtain here will be used for `apiToken` field.

## More resources

* **Test form**:
  [Sample WA Message Plugin Form](./extras/test-form/wa-message-plugin-demo.xlsx)

## Developer Notes

**Templates with Variables**: In case you want to use any template with variables in it, you'll need to modify the `createPayload` method in [`script.js`](./source/script.js) and similarly collect variable values from users if needed through a form input. Pass these variables to the plugin definition and obtain them in `script.js` using `getPluginParameter`.
