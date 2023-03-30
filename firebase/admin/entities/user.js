/*
 * The User class represents a user in Firestore. It is used to store metadata about a user
 * Users are indexed by their id. A user is stored in Firestore at:
 * /users/{user.id}
 */
class User {
  constructor(id, email, fullName, companyName, jobTitle, phoneNumber) {
    // We can't generate a unique id for the user so this is passed in
    // This is the id of the user in Firebase Authentication
    this.id = id;
    // The email of the user
    this.email = email;
    // The full name of the user
    this.fullName = fullName;
    // The company name of the user
    this.companyName = companyName;
    // The job title of the user
    this.jobTitle = jobTitle;
    // The phone number of the user
    this.phoneNumber = phoneNumber;
  }

  // Convert the user to an interface that can be used to store in Firestore
  to_interface = () => {
    return {
      email: this.email,
      fullName: this.fullName,
      companyName: this.companyName,
      jobTitle: this.jobTitle,
      phoneNumber: this.phoneNumber,
    };
  };
}

// This is the converter that allows us to convert between the Firestore
const userConverter = {
  toFirestore: (user) => {
    return user.to_interface();
  },
  fromFirestore: (snapshotd, options) => {
    const data = snapshot.data(options);
    return new User(
      snapshot.id,
      data.email,
      data.fullName,
      data.companyName,
      data.jobTitle,
      data.phoneNumber
    );
  },
};

module.exports = {
  User,
  userConverter,
};
