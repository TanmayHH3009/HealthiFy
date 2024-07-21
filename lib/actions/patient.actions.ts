'use server'

import { ID, Query } from "node-appwrite";
import {
    BUCKET_ID,
    DATABASE_ID,
    ENDPOINT,
    PATIENT_COLLECTION_ID,
    PROJECT_ID,
    databases,
    storage,
    users,
  } from "../appwrite.config";
import { parseStringify } from "../utils";
import {InputFile} from  "node-appwrite/file"


export const createUser = async (user: CreateUserParams) => {
    try {
        console.log("hello11");
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name,
        );
        console.log("hello33");
        console.log({ newUser });
    } catch (error: any) {
        console.log("hello23");
        if (error && error?.code === 409) {
            console.log("hello43");
            const documents = await users.list([Query.equal('email', [user.email])]);
            return documents?.users[0];
        }
    }
};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
       // console.log("user:",user)
        return parseStringify(user);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the user details:",
            error
          );
      
    }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(identificationDocument?.get('blobFile') as Blob,
            identificationDocument?.get('fileName') as string,
        )
  
console.log(BUCKET_ID,ID.unique())
            file = await storage.createFile('66992394000f60c8fa9a', ID.unique(), inputFile);
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: file
                ? `${ENDPOINT}/storage/buckets/66992394000f60c8fa9a/files/${file.$id}/view?project=${PROJECT_ID}`
                : null,
               
                ...patient,
            }
        )

        return parseStringify(newPatient);
    } catch (error) {
        console.error("An error occurred while creating a new patient:", error);
    }
};



export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!,[Query.equal('userId',userId)])
       // console.log("user:",user)
        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the user details:",
            error
          );
      
    }
};