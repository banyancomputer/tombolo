export interface IUser {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  jobTitle: string;
  phoneNumber: string;
}

export class User {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  jobTitle: string;
  phoneNumber: string;

  constructor(
    uid: string,
    email: string,
    fullName: string,
    companyName: string,
    jobTitle: string,
    phoneNumber: string
  ) {
    this.id = uid;
    this.email = email;
    this.fullName = fullName;
    this.companyName = companyName;
    this.jobTitle = jobTitle;
    this.phoneNumber = phoneNumber;
  }

  to_interface = (): IUser => {
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
export const userConverter = {
  toFirestore: (user: User) => {
    return user.to_interface();
  },
  fromFirestore: (snapshot: any, options: any) => {
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
