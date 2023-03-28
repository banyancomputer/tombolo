class User {
  constructor(uid, email, fullName, companyName, jobTitle, phoneNumber) {
    this.id = uid;
    this.email = email;
    this.fullName = fullName;
    this.companyName = companyName;
    this.jobTitle = jobTitle;
    this.phoneNumber = phoneNumber;
  }

  to_interface = () => {
    return {
      id: this.id,
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
    let u = user.to_interface();
    return {
      email: u.email,
      fullName: u.fullName,
      companyName: u.companyName,
      jobTitle: u.jobTitle,
    };
  },
  fromFirestore: (snapshotd, options) => {
    const data = snapshot.data(options);
    console.log('data', data);
    // Create a user from the interface.
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
