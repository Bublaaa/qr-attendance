export const requestLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        console.log("Permission Status:", permissionStatus.state);

        if (
          permissionStatus.state === "granted" ||
          permissionStatus.state === "prompt"
        ) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("❌ Location access is required for attendance."));
        }
      })
      .catch((error) => reject(error));
  });
};
