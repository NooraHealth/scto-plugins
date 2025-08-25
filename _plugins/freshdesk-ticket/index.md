---
title: Freshdesk Ticket Plugin
collection: plugins
layout: page
---
# Freshdesk Ticket Plugin
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Preview
![](extras/plugin-preview.png)

## Description

A special SurveyCTO plugin designed for teletrainers. Now, they can easily make Freshdesk tickets for patient questions right within SurveyCTO. No extra steps of opening Freshdesk separately needed.

[Freshdesk](https://www.freshworks.com/freshdesk/) is a powerful and intuitive cloud-based ticketing system that enables companies to streamline customer support, automate workflows, and deliver personalized service through a unified platform

## Download

[![Download now](../../assets/images/download-button.png)](https://github.com/NooraHealth/fd-ticket-scto-plugin/raw/main/fd-ticket.fieldplugin.zip)

{: .warning }
**Note**: Ensure the file name doesn't contain any trailing numbers like `(1)`, `(2)` which are automatically added by your system if you already have the plugin downloaded. Remove these and ensure the file name follows the format: `fd-ticket.fieldplugin.zip`

## Testing the Plugin

For general testing steps, please refer to the [Trying Out the Plugins](../trying-out-plugins.md) guide.

## Configuration

### Obtaining API Credentials

Before using this plugin in production, you need to obtain the correct API credentials:

- **`apiUrl`** and **`apiToken`**: Contact [Abhishek](https://github.com/abhishek-compro) to obtain the correct API credentials for your environment

{: .important }
**Note**: These values are currently set to placeholder/default values in the test form and need to be configured properly for the plugin to function correctly in production.

### Required Parameters

The following parameters need to be configured in your form:

| Key                     | Value                                                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `patientName`         | This is the name of the patient who has raised a query with the teletrainer                                                                                                                           |
| `phoneNumber`         | This is the phone number of the user who has raised a query                                                                                                                                           |
| `patientQuery`        | This is query raised by the user which needs to be escalated to doctors for resolution                                                                                                                |
| `agentEmail`          | This is the email address of the Teletrainer who used the SurveyCTO plugin to raise the query on Freshdesk. It should match the email address they used to sign up for an agent account on Freshdesk. |
| `projectId`           | This will be the project name attribute on the Freshdesk Ticket                                                                                                                                       |
| `familyConnectedOnWa` | This will be a Yes/No question used to inform the medical executive whether the user wants the answer to their query on WhatsApp or not.                                                              |
| `language`            | This specifies the language preference of the user, this will be used to send the answer back on Whatsapp.                                                                                            |
| `apiToken`            | This is the authentication token required by the API endpoint.                                                                                                                                        |
| `apiUrl`              | This is the URL of the API endpoint that will be invoked to create a ticket on Freshdesk.                                                                                                             |
| `fdUrl`               | This is the URL of our Freshdesk workspace, which will be used to populate this field with a link to the ticket on Freshdesk.                                                                         |
| `callName`            | This will contain the name of the form used to create the ticket on Freshdesk, providing context about the query for the Freshdesk ticket.                                                            |
| `countryName`         | This will contain the name of the country the ticket needs to be assigned such as `India`, `Bangladesh` etc.                                                                                      |

## Test Form
[Sample FD Plugin Form](./extras/test-form/fd-plugin-demo.xlsx)
