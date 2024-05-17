// export const successNotification = (title, message) => ({
//   title: title,
//   message: message,
//   type: "success",
//   insert: "top",
//   container: "top-right",
//   animationIn: ["animated", "fadeIn"],
//   animationOut: ["animated", "fadeOut"],
//   dismiss: {
//     duration: 3000,
//     onScreen: true
//   },
// });

export const warningNotification = (title, message) => {
  return ({
    title: title,
    message: message,
    type: "warning",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true
    },
  });
};

export const errorNotification = (title, message) => {
  return ({
    title: title,
    message: message,
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 3000,
      onScreen: true
    },
  });
};