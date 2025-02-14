// import UserProfile from "./schema";

// class DataValidator {

//     filterBodyData=(data: UserProfile): Partial<UserProfile> => {
//         const allowedFields: (keyof UserProfile)[] = [
//             "username",
//             "profilePicture",
//             "premiumStatus",
//             "email",
//             "firstName",
//             "lastName",
//             "gender",
//             "dateOfBirth",
//             "phone",
//             "country",
//             "stateProvince",
//             "profileCompleteness",
//             "profileCompleteBreak",
//             "createdAt",
//             "updatedAt",
//             "status",
//             "password"
//         ];

//         return Object.keys(data).reduce((obj: Partial<UserProfile>, key: string) => {
//             if (data[key as keyof UserProfile] !== null && allowedFields.includes(key as keyof UserProfile)) {
//                 obj[key as keyof UserProfile] = data[key as keyof UserProfile];
//             }
//             return obj;
//         }, {});
//     }
// }

// export default new DataValidator;
