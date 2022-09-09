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
