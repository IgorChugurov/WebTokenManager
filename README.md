# WebTokenManager Documentation

## Overview

`WebTokenManager` is a lightweight, flexible JavaScript module designed to simplify making HTTP requests with built-in token refresh and retry logic. It's tailored for projects that require handling authentication tokens and refreshing them automatically when they expire. This module is particularly useful for single-page applications (SPAs) that interact with RESTful APIs.

## Features

- Easy-to-use API for making HTTP requests.
- Automatic token refresh mechanism.
- Configurable for different storage keys and authorization header names.
- Supports multipart/form-data requests.

## Installation

To use `WebTokenManager` in your project, first ensure you have `jwt-decode` installed, as it's a peer dependency:

```bash
npm install jwt-decode
```

## Usage

### Importing the Module

To use WebTokenManager, first import the createRequestService function from the module:

```javascript
import createRequestService from "webtokenmanager";
```

### Configuration

Configure the request service with your specific requirements:

```javascript
const requestService = createRequestService({
  lskey: "YOUR_LOCAL_STORAGE_KEY_FOR_TOKEN",
  authheader: "Authorization header key",
  bearer: true, // Set to false if you don't want to use Bearer token format
});
```

### Making a Request

Use the sendRequest method to make HTTP requests:

```javascript
requestService
  .sendRequest({
    url: "https://api.example.com/data",
    method: "GET",
    // Additional options as needed...
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

## API Reference

### createRequestService(config)

Creates a new request service instance with the specified configuration.

Parameters

- options: Object containing request options.
- url: String - The URL to request.
- method: String - The HTTP method to use (e.g., 'GET', 'POST').
- body: Any (optional) - The body of the request for POST and PUT requests.
- queryString: Any (optional) - Object containing query string parameters.
- multipart: Boolean (optional) - Set to true if making a multipart/form-data request.
- page: Number (optional) - For pagination, the page number to request.
- perPage: Number (optional) - For pagination, the number of items per page.
- search: String (optional) - A search query parameter.
- headers: Object (optional) - Additional headers to send with the request.

### Handling Responses

Responses from sendRequest are returned as a Promise. Use .then() to handle success responses and .catch() to handle errors.

### Advanced Configuration

WebTokenManager is designed to work out of the box with minimal configuration. However, it can be customized to fit a wide range of use cases. For further customization, consider modifying the source code or wrapping the module functions with additional logic to suit your specific needs.

This documentation provides a basic overview of how to use the WebTokenManager module for making HTTP requests with token management in your applications. It's designed to be simple enough for developers at any level to integrate into their projects.
