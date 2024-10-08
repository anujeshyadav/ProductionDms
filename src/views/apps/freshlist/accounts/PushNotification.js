// import React from "react";

// class PushNotificationDemo extends React.Component {
//   componentDidMount() {
//     this.requestNotificationPermission();
//     this.setupNotificationClickListener();
//   }

//   requestNotificationPermission() {
//     if (!("Notification" in window)) {
//       console.log("Notifications not supported in this browser");
//       return;
//     }

//     Notification.requestPermission().then((result) => {
//       if (result === "granted") {
//         console.log("Notification permission granted");
//       } else {
//         console.log("Notification permission denied");
//       }
//     });
//   }

//   setupNotificationClickListener() {
//     console.log("Notification clicked:", notification);
//     window.addEventListener("notificationclick", (event) => {
//       console.log("Notification clicked:", notification);

//       const notification = event.notification;
//       // Handle notification click as needed
//       notification.close();
//     });
//   }

//   displayNotification() {
//     if (Notification.permission === "granted") {
//       const notification = new Notification("Hello, world!", {
//         body: "This is a sample notification",
//         // icon: "path/to/icon.png", // Optional icon
//       });

//       console.log("Notification clicked:", notification);
//       notification.addEventListener("click", () => {
//         // Handle notification click as needed
//         notification.close();
//       });
//     } else {
//       console.log("Permission not granted to show notifications");
//     }
//   }

//   render() {
//     return (
//       <div>
//         <h1>Push Notification Demo</h1>
//         <button onClick={this.displayNotification}>Show Notification</button>
//       </div>
//     );
//   }
// }

// export default PushNotificationDemo;
// import React from "react";
// import swal from "sweetalert";

// class PushNotificationDemo extends React.Component {
//   componentDidMount() {
//     this.requestNotificationPermission();
//     this.setupNotificationClickListener();
//   }

//   requestNotificationPermission() {
//     if (!("Notification" in window)) {
//       console.log("Notifications not supported in this browser");
//       return;
//     }

//     Notification.requestPermission().then((result) => {
//       if (result === "granted") {
//         console.log("Notification permission granted");
//       } else {
//         console.log("Notification permission denied");
//       }
//     });
//   }

//   setupNotificationClickListener() {
//     window.addEventListener("notificationclick", (event) => {
//       const notification = event.notification;
//       console.log("Notification clicked:", notification);

//       // Handle notification click as needed
//       notification.close();
//     });
//   }

//   displayNotification() {
//     if (Notification.permission === "granted") {
//       const notification = new Notification("Hello, world!", {
//         body: "This is a sample notification",
//         // icon: "path/to/icon.png", // Optional icon
//       });

//       console.log("Notification displayed:", notification);
//       //   swal("success", notification?.body);

//       notification.addEventListener("click", () => {
//         // Handle notification click as needed
//         notification.close();
//       });
//     } else {
//       console.log("Permission not granted to show notifications");
//     }
//   }

//   render() {
//     return (
//       <div>
//         <h1>Push Notification Demo</h1>
//         <button onClick={this.displayNotification}>Show Notification</button>
//       </div>
//     );
//   }
// }

// export default PushNotificationDemo;

import React from "react";

class PushNotificationDemo extends React.Component {
  componentDidMount() {
    this.requestNotificationPermission();
    this.setupNotificationClickListener();
  }

  requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("Notifications not supported in this browser");
      return;
    }

    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied");
      }
    });
  }

  setupNotificationClickListener() {
    window.addEventListener("notificationclick", (event) => {
      const notification = event.notification;
      console.log("Notification clicked:", notification);

      // Handle notification click as needed
      notification.close();
    });
  }

  displayNotification() {
    if (Notification.permission === "granted") {
      const notification = new Notification("Hello, world!", {
        body: "This is a sample notification",
        // icon: "path/to/icon.png", // Optional icon
      });

      console.log("Notification displayed:", notification);

      notification.addEventListener("click", () => {
        // Handle notification click as needed
        notification.close();
      });
    } else {
      console.log("Permission not granted to show notifications");
    }
  }

  render() {
    return (
      <div>
        <h1>Push Notification Demo</h1>
        <button onClick={this.displayNotification}>Show Notification</button>
      </div>
    );
  }
}

export default PushNotificationDemo;
