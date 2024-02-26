function SendResourceRequest(config, parameters = {}) {
  return `/Z2VuZXJhbA/cmVzb3VyY2Vz/${btoa(
    encodeURIComponent(
      JSON.stringify(
        Object.assign(
          {},
          {
            X2NsYXNz: btoa(config._class),
            X21ldGhvZF9uYW1l: btoa(config._method_name),
          },
          parameters
        )
      )
    )
  )}`;
}

function SendActionRequest(config, parameters = {}) {
  return {
    url: "/Z2VuZXJhbA/YWN0aW9ucw",
    payload: Object.assign(
      {},
      {
        X2NsYXNz: btoa(config._class),
        X21ldGhvZF9uYW1l: btoa(config._method_name),
      },
      config._validation_class
        ? {
            X3ZhbGlkYXRpb25fY2xhc3M: btoa(config._validation_class),
          }
        : {},
      parameters
    ),
  };
}

export { SendActionRequest, SendResourceRequest };
