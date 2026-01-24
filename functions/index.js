// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// admin.initializeApp();

// const auth = admin.auth();
// const db = admin.firestore();

// // ---------------- CREATE NEW ADMIN ----------------
// exports.createAdmin = functions.https.onCall(async (data, context) => {
//   // Only allow current admins to create new admins
//   if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not logged in");
//   const currentUser = await auth.getUser(context.auth.uid);
//   const token = currentUser.customClaims;
//   if (!token?.admin) throw new functions.https.HttpsError("permission-denied", "Not an admin");

//   const { email, password } = data;
//   if (!email || !password) throw new functions.https.HttpsError("invalid-argument", "Email & password required");

//   // 1️⃣ Create user in Firebase Auth
//   const user = await auth.createUser({ email, password, emailVerified: true });
//   await auth.setCustomUserClaims(user.uid, { admin: true, role: "admin" });

//   // 2️⃣ Create Firestore document
//   await db.collection("admin").doc(user.uid).set({
//     email,
//     role: "admin",
//     isBlocked: false,
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//   });

//   return { uid: user.uid };
// });

// // ---------------- BLOCK / UNBLOCK ADMIN ----------------
// exports.toggleAdminBlock = functions.https.onCall(async (data, context) => {
//   if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not logged in");
//   const currentUser = await auth.getUser(context.auth.uid);
//   if (!currentUser.customClaims?.admin) throw new functions.https.HttpsError("permission-denied", "Not an admin");

//   const { uid } = data;
//   if (!uid) throw new functions.https.HttpsError("invalid-argument", "UID required");

//   const adminDoc = db.collection("admin").doc(uid);
//   const docSnap = await adminDoc.get();
//   if (!docSnap.exists) throw new functions.https.HttpsError("not-found", "Admin not found");

//   const isBlocked = docSnap.data().isBlocked;
//   await adminDoc.update({ isBlocked: !isBlocked });

//   return { blocked: !isBlocked };
// });

// // ---------------- CHANGE ADMIN ROLE ----------------
// exports.updateAdminRole = functions.https.onCall(async (data, context) => {
//   if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not logged in");
//   const currentUser = await auth.getUser(context.auth.uid);
//   if (!currentUser.customClaims?.admin) throw new functions.https.HttpsError("permission-denied", "Not an admin");

//   const { uid, role } = data;
//   if (!uid || !role) throw new functions.https.HttpsError("invalid-argument", "UID & role required");

//   await auth.setCustomUserClaims(uid, { admin: role === "admin", role });
//   await db.collection("admin").doc(uid).update({ role });

//   return { success: true };
// });

// // ---------------- DELETE ADMIN ----------------
// exports.deleteAdmin = functions.https.onCall(async (data, context) => {
//   if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not logged in");
//   const currentUser = await auth.getUser(context.auth.uid);
//   if (!currentUser.customClaims?.admin) throw new functions.https.HttpsError("permission-denied", "Not an admin");

//   const { uid } = data;
//   if (!uid) throw new functions.https.HttpsError("invalid-argument", "UID required");

//   await auth.deleteUser(uid);
//   await db.collection("admin").doc(uid).delete();

//   return { success: true };
// });
