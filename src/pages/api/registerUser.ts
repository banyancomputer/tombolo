// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import admin, { db } from '@/lib/firebase/admin';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get the user's email address from the request body
  const { uid, email, fullName, companyName, jobTitle, phoneNumber } = req.body;
  // Get the token from the request headers
  const token = req.headers.authorization ? req.headers.authorization : '';

  admin
    .auth()
    .verifyIdToken(token)
    .catch((error: any) => {
      console.log(error);
      res.status(401).json({ message: 'Unauthorized' });
    });

  // Check if the user already exists
  db.checkUserExists(uid).then((exists: any) => {
    if (exists) {
      res.status(502).json({ message: 'User already exists' });
    } else {
      db.createUser(uid, email, fullName, companyName, jobTitle, phoneNumber)
        .then(() => {
          res.status(200).json({ message: 'User created' });
        })
        .catch((error: any) => {
          console.log(error);
          res.status(500).json({ message: 'Error creating user' });
        });
    }
  });
}
