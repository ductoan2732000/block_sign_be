import * as database from 'firebase/database';
export const postToDatabase = (
  pathRef: string | string[],
  db: database.Database,
  value: any | any[],
): void => {
  if (typeof pathRef === 'string') {
    const reference = database.ref(db, pathRef);
    database.set(reference, value);
  } else {
    const listReference = pathRef.map((item) => database.ref(db, item));
    const listPromise = value.map((item, index) =>
      database.set(listReference[index], item),
    );
    Promise.all(listPromise);
  }
};

export const readFromDatabase = async (
  db: database.Database,
  pathRef: string,
) => {
  const dbRef = database.ref(db);
  try {
    const snapshot = await database.get(database.child(dbRef, pathRef));
    if (snapshot.exists()) {
      const res = snapshot.val();
      return res;
    } else {
      return {};
    }
  } catch (error) {
    return error;
  }
};
